import { useTranslation } from "react-i18next";
import styles from "../styles/Contacts.module.css";

const Contacts = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.contacts}>
      <h1>{t("contacts.title")}</h1>
      <p>{t("contacts.subtitle")}</p>
      <div className={styles.contactList}>
        <div className={styles.contactCard}>
          <h2>Hamida Samad-zada</h2>
          <p>
            {t("contacts.email")}: 
            <a href="mailto:elikosamed@gmail.com">elikosamed@gmail.com</a>
          </p>
        </div>
        <div className={styles.contactCard}>
          <h2>Eteri Jafarova</h2>
          <p>
            {t("contacts.email")}: 
            <a href="mailto:etericeferova2005@gmail.com">
              etericeferova2005@gmail.com
            </a>
          </p>
        </div>
      </div>
      <div className={styles.schedule}>
        <h3>{t("contacts.businessHours")}</h3>
        <p>{t("contacts.weekdays")}</p>
        <p>{t("contacts.weekend")}</p>
      </div>
    </div>
  );
};

export default Contacts;
