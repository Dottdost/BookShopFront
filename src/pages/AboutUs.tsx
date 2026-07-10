import { useTranslation } from "react-i18next";
import { FiBookOpen, FiHeart, FiStar } from "react-icons/fi";
import aboutImage from "../assets/ab.jpg";
import styles from "../styles/AboutUs.module.css";

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <main className={styles.aboutUs}>
      <section className={styles.container}>
        <div className={styles.visualCard} aria-hidden="true">
          <div className={styles.imageGlow} />
          <div className={styles.imageFrame}>
            <img
              src={aboutImage}
              alt={t("about.imageAlt")}
              className={styles.aboutImage}
            />
          </div>

          <div className={styles.floatingNote}>
            <span>✦</span>
            <strong>{t("about.visualTitle")}</strong>
          </div>

          <div className={styles.visualBadge}>
            <strong>{t("about.visualBadgeTitle")}</strong>
            <span>{t("about.visualBadgeText")}</span>
          </div>
        </div>

        <div className={styles.contentCard}>
          <p className={styles.eyebrow}>{t("about.eyebrow")}</p>

          <h1 className={styles.title}>{t("about.title")}</h1>

          <div className={styles.paragraphs}>
            <p className={styles.paragraph}>{t("about.p1")}</p>
            <p className={styles.paragraph}>{t("about.p2")}</p>
            <p className={styles.paragraph}>{t("about.p3")}</p>
            <p className={styles.paragraph}>{t("about.p4")}</p>
          </div>

          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiBookOpen />
              </div>
              <strong>{t("about.statCatalog")}</strong>
              <span>{t("about.statCatalogText")}</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiHeart />
              </div>
              <strong>{t("about.statFavorites")}</strong>
              <span>{t("about.statFavoritesText")}</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiStar />
              </div>
              <strong>{t("about.statSupport")}</strong>
              <span>{t("about.statSupportText")}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
