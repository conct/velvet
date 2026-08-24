// Compares server/prisma/schema.prisma (SQLite, local dev) against
// server/prisma/mysql/schema.prisma (production) model-by-model and
// field-by-field, so a forgotten change in one surfaces before `db push`
// against production does. Deliberately ignores type attributes like
// `@db.Text` -- those exist only because MySQL needs them for long strings,
// not because the two schemas actually disagree about the data.
//
// Usage: npm run check-schemas

import fs from "fs";
import path from "path";

interface FieldInfo {
  type: string;
  optional: boolean;
  isList: boolean;
}

interface ModelInfo {
  fields: Map<string, FieldInfo>;
}

function parseModels(source: string): Map<string, ModelInfo> {
  const models = new Map<string, ModelInfo>();
  const modelRegex = /model\s+(\w+)\s*\{([^}]*)\}/g;
  let match: RegExpExecArray | null;

  while ((match = modelRegex.exec(source))) {
    const [, name, body] = match;
    const fields = new Map<string, FieldInfo>();

    for (const rawLine of body.split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("//") || line.startsWith("@@")) continue;

      const fieldMatch = /^(\w+)\s+([\w[\]]+)(\??)/.exec(line);
      if (!fieldMatch) continue;
      const [, fieldName, rawType, optionalMark] = fieldMatch;

      // Relation fields (e.g. `memberships StaffVenueMembership[]`) are a
      // consequence of the other side's foreign key, not an independent
      // column -- comparing them would just duplicate the *Id field check
      // and flag relation-array ordering differences that mean nothing.
      const isList = rawType.endsWith("[]");
      const isKnownScalar = /^(String|Int|Boolean|DateTime|Float|Json|BigInt|Decimal)(\[\])?$/.test(rawType);
      if (isList && !isKnownScalar) continue;
      if (!isKnownScalar && !isList) continue;

      fields.set(fieldName, { type: rawType.replace("[]", ""), optional: optionalMark === "?", isList });
    }

    models.set(name, { fields });
  }

  return models;
}

function main() {
  const sqlitePath = path.join(__dirname, "..", "prisma", "schema.prisma");
  const mysqlPath = path.join(__dirname, "..", "prisma", "mysql", "schema.prisma");

  const sqliteModels = parseModels(fs.readFileSync(sqlitePath, "utf8"));
  const mysqlModels = parseModels(fs.readFileSync(mysqlPath, "utf8"));

  const problems: string[] = [];

  const allModelNames = new Set([...sqliteModels.keys(), ...mysqlModels.keys()]);
  for (const modelName of allModelNames) {
    const sqlite = sqliteModels.get(modelName);
    const mysql = mysqlModels.get(modelName);

    if (!sqlite) {
      problems.push(`Model "${modelName}" existiert nur in der MySQL-Schema (fehlt in schema.prisma)`);
      continue;
    }
    if (!mysql) {
      problems.push(`Model "${modelName}" existiert nur in schema.prisma (fehlt in der MySQL-Schema)`);
      continue;
    }

    const allFieldNames = new Set([...sqlite.fields.keys(), ...mysql.fields.keys()]);
    for (const fieldName of allFieldNames) {
      const sqliteField = sqlite.fields.get(fieldName);
      const mysqlField = mysql.fields.get(fieldName);

      if (!sqliteField) {
        problems.push(`${modelName}.${fieldName} existiert nur in der MySQL-Schema`);
        continue;
      }
      if (!mysqlField) {
        problems.push(`${modelName}.${fieldName} existiert nur in schema.prisma`);
        continue;
      }
      if (sqliteField.type !== mysqlField.type) {
        problems.push(
          `${modelName}.${fieldName}: Typ weicht ab (schema.prisma: ${sqliteField.type}, mysql: ${mysqlField.type})`
        );
      }
      if (sqliteField.optional !== mysqlField.optional) {
        problems.push(
          `${modelName}.${fieldName}: optional weicht ab (schema.prisma: ${sqliteField.optional}, mysql: ${mysqlField.optional})`
        );
      }
      if (sqliteField.isList !== mysqlField.isList) {
        problems.push(
          `${modelName}.${fieldName}: Liste/Skalar weicht ab (schema.prisma: ${sqliteField.isList}, mysql: ${mysqlField.isList})`
        );
      }
    }
  }

  if (problems.length === 0) {
    console.log(`OK -- ${allModelNames.size} Models, schema.prisma und prisma/mysql/schema.prisma stimmen überein.`);
    return;
  }

  console.error(`${problems.length} Abweichung(en) zwischen schema.prisma und prisma/mysql/schema.prisma:\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exitCode = 1;
}

main();
