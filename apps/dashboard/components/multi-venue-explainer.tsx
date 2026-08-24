"use client";

import styles from "./multi-venue-explainer.module.css";
import { useLocale } from "../lib/locale-context";
import { withBold } from "../lib/with-bold";

export function MultiVenueExplainer() {
  const { t } = useLocale();
  const e = t.explainers.multiVenue;
  return (
    <div className={styles.stage}>
      <div className={styles.deviceWrap}>
        <div className={styles.browser}>
          <div className={styles.browserBar}>
            <span className={styles.browserDot} />
            <span className={styles.browserDot} />
            <span className={styles.browserDot} />
            <span className={styles.browserUrl}>velvet-network.app</span>
          </div>

          <div className={styles.browserBody}>
            <div className={styles.sidebar}>
              <div className={styles.brandMark}>VELVET</div>

              <div className={styles.venuePicker}>
                <span className={styles.venuePickerLabel}>Noir Club Berlin</span>
                <span>▾</span>

                <div className={styles.venueDropdown}>
                  <div className={styles.venueOption}>Noir Club Berlin</div>
                  <div className={`${styles.venueOption} ${styles.venueOptionActive}`}>Velvet Lounge HH</div>
                </div>
              </div>

              <div className={`${styles.navItem} ${styles.navItemActive}`}>◆ {e.navOverview}</div>
              <div className={styles.navItem}>＋ {e.navAddVenue}</div>
            </div>

            <div className={styles.main}>
              <div className={`${styles.scene} ${styles.sceneA}`}>
                <p className={styles.pageLabel}>{e.navOverview}</p>
                <p className={styles.pageTitle}>Noir Club Berlin</p>
                <div className={styles.statRow}>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>128</div>
                    <div className={styles.statLabel}>{e.statGuests}</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>4.6</div>
                    <div className={styles.statLabel}>⌀ {e.statAvgScore}</div>
                  </div>
                </div>
              </div>

              <div className={`${styles.scene} ${styles.sceneB}`}>
                <p className={styles.pageLabel}>{e.navOverview}</p>
                <p className={styles.pageTitle}>Velvet Lounge HH</p>
                <div className={styles.statRow}>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>76</div>
                    <div className={styles.statLabel}>{e.statGuests}</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>4.3</div>
                    <div className={styles.statLabel}>⌀ {e.statAvgScore}</div>
                  </div>
                </div>
              </div>

              <div className={`${styles.scene} ${styles.sceneC}`}>
                <p className={styles.pageLabel}>{e.navAddVenue}</p>
                <div className={styles.formField}>CHOOZY Süd</div>
                <div className={styles.formField}>Bahnhofstr. 12, Dresden</div>
                <div className={styles.formButton}>{e.formButtonCreate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.captionStrip}>
        <p className={`${styles.caption} ${styles.captionA}`}>{withBold(e.captionOneLogin)}</p>
        <p className={`${styles.caption} ${styles.captionB}`}>{withBold(e.captionSwitch)}</p>
        <p className={`${styles.caption} ${styles.captionC}`}>{withBold(e.captionCreateOwn)}</p>
      </div>

      <div className={styles.dots}>
        <div className={`${styles.dotIndicator} ${styles.dotA}`} />
        <div className={`${styles.dotIndicator} ${styles.dotB}`} />
        <div className={`${styles.dotIndicator} ${styles.dotC}`} />
      </div>
    </div>
  );
}
