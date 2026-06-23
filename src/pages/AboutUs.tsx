import { useTranslation } from "react-i18next";
import styles from "../styles/AboutUs.module.css";

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.aboutUs}>
      <div className={styles.container}>
        <h1>{t("about.title")}</h1>
        <p>{t("about.p1")}</p>
        <p>{t("about.p2")}</p>
        <p>{t("about.p3")}</p>
        <p>{t("about.p4")}</p>
      </div>
    </div>
  );
};

export default AboutUs;
