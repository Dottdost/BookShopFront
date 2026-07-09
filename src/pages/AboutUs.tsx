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
              alt="Cheshire Shelf visual"
              className={styles.aboutImage}
            />
          </div>

          <div className={styles.floatingNote}>
            <span>✦</span>
            <strong>Cheshire Shelf</strong>
          </div>

          <div className={styles.visualBadge}>
            <strong>Designed for readers</strong>
            <span>A soft digital shelf for stories, orders and support.</span>
          </div>
        </div>

        <div className={styles.contentCard}>
          <p className={styles.eyebrow}>About the project</p>

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
              <strong>Catalog</strong>
              <span>Books and genres</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiHeart />
              </div>
              <strong>Favorites</strong>
              <span>Personal shelf</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiStar />
              </div>
              <strong>Support</strong>
              <span>Live chat flow</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
