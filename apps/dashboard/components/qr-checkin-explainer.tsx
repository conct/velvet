"use client";

import styles from "./qr-checkin-explainer.module.css";
import { useLocale } from "../lib/locale-context";
import { withBold } from "../lib/with-bold";

// Deterministic "looks like a QR code" filler pattern — fixed seed so server
// and client render the exact same markup (Math.random() here would cause a
// hydration mismatch).
function seededGrid(seed: number, density: number): boolean[] {
  let state = seed;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
  return Array.from({ length: 49 }, (_, i) => {
    const row = Math.floor(i / 7);
    const col = i % 7;
    const isFinder = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2);
    return isFinder || next() < density;
  });
}

const GUEST_GRID = seededGrid(42, 0.42);
const SCAN_GRID = seededGrid(1337, 0.4);

function QrGrid({ pattern, dim }: { pattern: boolean[]; dim?: boolean }) {
  return (
    <div className={styles.qrBox} style={dim ? { opacity: 0.55 } : undefined}>
      {pattern.map((on, i) => (
        <span key={i} className={on ? styles.on : undefined} />
      ))}
    </div>
  );
}

function VfGrid({ pattern }: { pattern: boolean[] }) {
  return (
    <div className={styles.vfTarget}>
      {pattern.map((on, i) => (
        <span key={i} className={on ? styles.on : undefined} />
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M4 12.5l5 5L20 7" />
    </svg>
  );
}

export function QrCheckinExplainer() {
  const { t } = useLocale();
  const e = t.explainers.qrCheckin;
  return (
    <div className={styles.stage}>
      <div className={styles.devices}>
        {/* Guest phone */}
        <div className={`${styles.device} ${styles.phone}`}>
          <div className={styles.phoneScreen}>
            <div className={styles.brandMark}>VELVET</div>

            <div className={styles.sceneStack}>
              <div className={`${styles.scene} ${styles.sceneA}`}>
                <p className={styles.codeLabel}>{e.accessCodeLabel}</p>
                <QrGrid pattern={GUEST_GRID} />
                <div className={styles.accessCode}>481206</div>
                <div className={styles.countdownTrack}>
                  <div className={styles.countdownFill} />
                </div>
              </div>

              <div className={`${styles.scene} ${styles.sceneB}`}>
                <p className={styles.codeLabel} style={{ opacity: 0.6 }}>
                  {e.scanningLabel}
                </p>
                <QrGrid pattern={GUEST_GRID} dim />
              </div>

              <div className={`${styles.scene} ${styles.sceneC}`}>
                <svg width="30" height="30" viewBox="0 0 24 24" style={{ marginBottom: 8 }}>
                  <path
                    d="M4 12.5l5 5L20 7"
                    stroke="var(--color-success)"
                    strokeWidth="2.4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className={styles.codeLabel} style={{ color: "var(--color-success)", opacity: 0.9 }}>
                  {e.checkedInLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* scan pulse */}
        <div className={styles.pulseTrack}>
          <div className={styles.pulseDot} />
        </div>

        {/* staff tablet */}
        <div className={`${styles.device} ${styles.tablet}`}>
          <div className={styles.tabletScreen}>
            <div className={`${styles.scene} ${styles.sceneA}`}>
              <p className={styles.scanCaption}>{e.readyToScan}</p>
              <div className={styles.viewfinder}>
                <div className={`${styles.vfCorner} ${styles.tl}`} />
                <div className={`${styles.vfCorner} ${styles.tr}`} />
                <div className={`${styles.vfCorner} ${styles.bl}`} />
                <div className={`${styles.vfCorner} ${styles.br}`} />
              </div>
            </div>

            <div className={`${styles.scene} ${styles.sceneB}`}>
              <div className={styles.viewfinder}>
                <div className={`${styles.vfCorner} ${styles.tl}`} />
                <div className={`${styles.vfCorner} ${styles.tr}`} />
                <div className={`${styles.vfCorner} ${styles.bl}`} />
                <div className={`${styles.vfCorner} ${styles.br}`} />
                <VfGrid pattern={SCAN_GRID} />
                <div className={styles.scanLine} />
              </div>
              <p className={styles.scanCaption}>{e.scanningStaffLabel}</p>
            </div>

            <div className={`${styles.scene} ${styles.sceneC}`}>
              <div className={styles.resultAvatar}>L</div>
              <div className={styles.resultName}>Lena K.</div>
              <div className={styles.tierBadge}>VIP</div>
              <div className={styles.checkRow}>
                <CheckIcon />
                {e.entryGranted}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.captionStrip}>
        <p className={`${styles.caption} ${styles.captionA}`}>{withBold(e.captionShow)}</p>
        <p className={`${styles.caption} ${styles.captionB}`}>{withBold(e.captionScan)}</p>
        <p className={`${styles.caption} ${styles.captionC}`}>{withBold(e.captionAppear)}</p>
      </div>

      <div className={styles.dots}>
        <div className={`${styles.dot} ${styles.dotA}`} />
        <div className={`${styles.dot} ${styles.dotB}`} />
        <div className={`${styles.dot} ${styles.dotC}`} />
      </div>
    </div>
  );
}
