import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiBookOpen,
  FiHeart,
  FiMessageCircle,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";
import styles from "../styles/Home.module.css";

const Home = () => {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState("");

  const fullText = t("home.heroTitle");
  const typingSpeed = 58;

  useEffect(() => {
    let index = 0;
    setText("");

    const typingInterval = window.setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1));
        index += 1;
      } else {
        window.clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => window.clearInterval(typingInterval);
  }, [fullText, i18n.language]);

  return (
    <main className={styles.page}>
      <section className={styles.home}>
        <div className={styles.heroShell}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>{t("home.eyebrow")}</p>

            <h1 className={styles.text}>
              <span>{text}</span>
              <span className={styles.cursor} />
              <span className={styles.textGradient}>Cheshire Shelf</span>
            </h1>

            <p className={styles.subtitle}>{t("home.heroSubtitle")}</p>

            <div className={styles.heroActions}>
              <Link to="/books" className={styles.primaryAction}>
                <FiBookOpen />
                {t("home.exploreBooks")}
                <FiArrowRight />
              </Link>

              <Link to="/books" className={styles.secondaryAction}>
                <FiSearch />
                {t("home.findNextRead")}
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.bookStack}>
              <div className={`${styles.bookCover} ${styles.coverLeft}`}>
                <div className={styles.bookSpine} />
              </div>

              <div className={`${styles.bookCover} ${styles.coverRight}`}>
                <div className={styles.bookSpine} />
              </div>

              <div className={`${styles.bookCover} ${styles.coverMain}`}>
                <div className={styles.bookSpine} />
                <div className={styles.coverTitle}>Cheshire Shelf</div>
                <div className={styles.coverLine} />
                <div className={styles.coverAuthor}>
                  {t("home.coverAuthor")}
                </div>
              </div>

              <div className={`${styles.sparkle} ${styles.sparkleOne}`}>
                <FiStar />
              </div>

              <div className={`${styles.sparkle} ${styles.sparkleTwo}`}>
                <FiHeart />
              </div>

              <div className={`${styles.sparkle} ${styles.sparkleThree}`}>
                <FiShoppingBag />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contentWrapper}>
        <div className={styles.section}>
          <h2 className={styles.recommendationsTitle}>
            {t("home.specialTitle")}
          </h2>

          <p className={styles.sectionIntro}>{t("home.specialIntro")}</p>

          <div className={styles.featureGrid}>
            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiBookOpen />
              </div>

              <h3>{t("home.featureBrowseTitle")}</h3>
              <p>{t("home.featureBrowseText")}</p>
            </article>

            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiHeart />
              </div>

              <h3>{t("home.featureShelfTitle")}</h3>
              <p>{t("home.featureShelfText")}</p>
            </article>

            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiMessageCircle />
              </div>

              <h3>{t("home.featureSupportTitle")}</h3>
              <p>{t("home.featureSupportText")}</p>
            </article>
          </div>
        </div>

        <div className={styles.showcase}>
          <article className={styles.quoteCard}>
            <div>
              <div className={styles.quoteMark}>“</div>
              <p className={styles.quoteText}>{t("home.quote")}</p>
            </div>

            <p className={styles.quoteAuthor}>{t("home.quoteAuthor")}</p>
          </article>

          <article className={styles.stepsCard}>
            <h2>{t("home.howItWorks")}</h2>

            <div className={styles.steps}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>01</span>
                <div>
                  <h3>{t("home.stepOneTitle")}</h3>
                  <p>{t("home.stepOneText")}</p>
                </div>
              </div>

              <div className={styles.step}>
                <span className={styles.stepNumber}>02</span>
                <div>
                  <h3>{t("home.stepTwoTitle")}</h3>
                  <p>{t("home.stepTwoText")}</p>
                </div>
              </div>

              <div className={styles.step}>
                <span className={styles.stepNumber}>03</span>
                <div>
                  <h3>{t("home.stepThreeTitle")}</h3>
                  <p>{t("home.stepThreeText")}</p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <section className={styles.cta}>
          <FiShield />

          <h2>{t("home.ctaTitle")}</h2>

          <p>{t("home.ctaText")}</p>

          <div className={styles.ctaActions}>
            <Link to="/books" className={styles.primaryAction}>
              <FiBookOpen />
              {t("home.openCatalog")}
            </Link>

            <Link to="/books?search=" className={styles.secondaryAction}>
              <FiSearch />
              {t("home.browseLibrary")}
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Home;
