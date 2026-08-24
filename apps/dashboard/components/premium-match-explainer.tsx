"use client";

import styles from "./premium-match-explainer.module.css";
import { useLocale } from "../lib/locale-context";
import { withBold } from "../lib/with-bold";

export function PremiumMatchExplainer() {
  const { t } = useLocale();
  const e = t.explainers.premiumMatch;
  return (
    <div className={styles.stage}>
      <div className={styles.devices}>
        {/* Guest A phone */}
        <div className={`${styles.device} ${styles.phone}`}>
          <div className={styles.phoneScreen}>
            <div className={styles.brandMark}>VELVET</div>

            <div className={styles.sceneStack}>
              <div className={`${styles.scene} ${styles.sceneA}`}>
                <div className={styles.checkinAvatar}>J</div>
                <div className={styles.venueLabel}>Noir Club</div>
                <div className={styles.checkedInTag}>
                  <span className={styles.dot} />
                  {e.checkedInTag}
                </div>
              </div>

              <div className={`${styles.scene} ${styles.sceneB}`}>
                <p className={styles.matchesLabel}>{e.matchesQuestion}</p>
                <div className={styles.matchRing}>
                  <div className={styles.matchAvatar}>L</div>
                </div>
                <div className={styles.matchName}>Lena K.</div>
                <div className={styles.matchVenue}>Noir Club</div>
              </div>

              <div className={`${styles.scene} ${styles.sceneC}`}>
                <div className={styles.chatColumn}>
                  <div className={styles.chatBubbleOut}>{e.chatMsgOut}</div>
                  <div className={styles.chatBubbleIn}>{e.chatMsgIn}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* connecting pulse */}
        <div className={styles.pulseTrack}>
          <div className={styles.pulseDot} />
        </div>

        {/* Guest B phone */}
        <div className={`${styles.device} ${styles.phone}`}>
          <div className={styles.phoneScreen}>
            <div className={styles.brandMark}>VELVET</div>

            <div className={styles.sceneStack}>
              <div className={`${styles.scene} ${styles.sceneA}`}>
                <div className={styles.checkinAvatar}>L</div>
                <div className={styles.venueLabel}>Noir Club</div>
                <div className={styles.checkedInTag}>
                  <span className={styles.dot} />
                  {e.checkedInTag}
                </div>
              </div>

              <div className={`${styles.scene} ${styles.sceneB}`}>
                <p className={styles.matchesLabel}>{e.matchesQuestion}</p>
                <div className={styles.matchRing}>
                  <div className={styles.matchAvatar}>J</div>
                </div>
                <div className={styles.matchName}>Jana B.</div>
                <div className={styles.matchVenue}>Noir Club</div>
              </div>

              <div className={`${styles.scene} ${styles.sceneC}`}>
                <div className={styles.chatColumn}>
                  <div className={styles.chatBubbleIn}>{e.chatMsgOut}</div>
                  <div className={styles.chatBubbleOut}>{e.chatMsgIn}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.unreadBadge}>1</div>
        </div>
      </div>

      <div className={styles.captionStrip}>
        <p className={`${styles.caption} ${styles.captionA}`}>{withBold(e.captionSameNight)}</p>
        <p className={`${styles.caption} ${styles.captionB}`}>{withBold(e.captionPremiumShows)}</p>
        <p className={`${styles.caption} ${styles.captionC}`}>{withBold(e.captionRealMatches)}</p>
      </div>

      <div className={styles.dots}>
        <div className={`${styles.dotIndicator} ${styles.dotA}`} />
        <div className={`${styles.dotIndicator} ${styles.dotB}`} />
        <div className={`${styles.dotIndicator} ${styles.dotC}`} />
      </div>
    </div>
  );
}
