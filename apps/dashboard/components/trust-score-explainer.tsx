"use client";

import styles from "./trust-score-explainer.module.css";
import { useLocale } from "../lib/locale-context";
import { withBold } from "../lib/with-bold";

export function TrustScoreExplainer() {
  const { t } = useLocale();
  const e = t.explainers.trustScore;
  return (
    <div className={styles.stage}>
      <div className={styles.devices}>
        {/* staff tablet */}
        <div className={`${styles.device} ${styles.tablet}`}>
          <div className={styles.tabletScreen}>
            <div className={`${styles.scene} ${styles.sceneA}`}>
              <p className={styles.rateLabel}>{e.rateLabel}</p>
              <div className={styles.stars}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={`${styles.star} ${i < 5 ? styles.starOn : ""}`}>
                    ★
                  </span>
                ))}
              </div>
              <div className={styles.tagRow}>
                <span className={styles.tag}>{e.tagFriendly}</span>
                <span className={styles.tag}>{e.tagPunctual}</span>
              </div>
              <div className={styles.submitButton}>{e.submitButton}</div>
            </div>

            <div className={`${styles.scene} ${styles.sceneB}`}>
              <div className={styles.processingRing} />
              <p className={styles.processingLabel}>{e.processingLabel}</p>
            </div>

            <div className={`${styles.scene} ${styles.sceneC}`}>
              <p className={styles.rateLabel}>{e.rateCapturedLabel}</p>
            </div>
          </div>
        </div>

        {/* pulse */}
        <div className={styles.pulseTrack}>
          <div className={styles.pulseDot} />
        </div>

        {/* guest phone */}
        <div className={`${styles.device} ${styles.phone}`}>
          <div className={styles.phoneScreen}>
            <div className={styles.brandMark}>VELVET</div>

            <div className={styles.sceneStack}>
              <div className={`${styles.scene} ${styles.sceneA}`}>
                <div className={styles.tierBadgeOld}>{t.tiers.STANDARD}</div>
                <div className={styles.scoreText} style={{ marginTop: 10 }}>
                  4,3
                </div>
                <div className={styles.scoreSub}>{t.landing.guestsGlobalStatus}</div>
              </div>

              <div className={`${styles.scene} ${styles.sceneB}`}>
                <div className={styles.processingRing} />
                <p className={styles.processingLabel}>{e.statusUpdatingLabel}</p>
              </div>

              <div className={`${styles.scene} ${styles.sceneC}`}>
                <div className={styles.tierBadgeNew}>{t.tiers.TRUSTED}</div>
                <div className={styles.scoreText}>4,7</div>
                <div className={styles.scoreSub}>{e.networkWideValidLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.captionStrip}>
        <p className={`${styles.caption} ${styles.captionA}`}>{withBold(e.captionStars)}</p>
        <p className={`${styles.caption} ${styles.captionB}`}>{withBold(e.captionGlobalStatus)}</p>
        <p className={`${styles.caption} ${styles.captionC}`}>{withBold(e.captionTravels)}</p>
      </div>

      <div className={styles.dots}>
        <div className={`${styles.dotIndicator} ${styles.dotA}`} />
        <div className={`${styles.dotIndicator} ${styles.dotB}`} />
        <div className={`${styles.dotIndicator} ${styles.dotC}`} />
      </div>
    </div>
  );
}
