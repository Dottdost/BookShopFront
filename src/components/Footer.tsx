import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../styles/Footer.module.css";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.info}>
          <p>{t("footer.delivery")}</p>

          <p>
            {t("footer.contacts")}:{" "}
            <a href="mailto:info@CheschireShelf.az">info@CheschireShelf.az</a>
          </p>

          <p>{t("footer.tagline")}</p>
        </div>

        <div className={styles.image}>
          <img
            src="https://th.bing.com/th/id/R.4bb4061762fa6e8da77329fbe6ffa2b6?rik=qoAo0V1SkpgeWQ&riu=http%3a%2f%2fclipart-library.com%2fimg1%2f725330.gif&ehk=yx8A%2fihduaVxP0IbICqjW6vFdv2YnnqRTWkUim%2bVNZQ%3d&risl=1&pid=ImgRaw&r=0"
            alt={t("footer.imageAlt")}
            className={styles.bookImage}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
