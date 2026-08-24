import type { ReactNode } from "react";

// Splits a translated string on `**bold**` markers and wraps the marked
// segments in <b>. Lets each locale control its own word order/emphasis
// placement instead of assembling a caption from separate lead/bold/trail keys.
export function withBold(text: string, boldClassName?: string): ReactNode[] {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => (i % 2 === 1 ? <b key={i} className={boldClassName}>{part}</b> : part));
}
