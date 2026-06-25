import { useTranslation } from "react-i18next";
import {
  FiClock,
  FiMail,
  FiMessageCircle,
  FiSend,
  FiUser,
} from "react-icons/fi";
import styles from "../styles/Contacts.module.css";

const Contacts = () => {
  const { t } = useTranslation();

  return (
    <main className={styles.contacts}>
      <section className={styles.shell}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Get in touch</p>

          <h1 className={styles.title}>{t("contacts.title")}</h1>

          <p className={styles.subtitle}>{t("contacts.subtitle")}</p>
        </div>

        <div className={styles.contactList}>
          <article className={styles.contactCard}>
            <div className={styles.avatar}>
              <FiUser />
            </div>

            <h2>Hamida Samad-zada</h2>

            <div className={styles.contactInfo}>
              <p>{t("contacts.email")}</p>

              <a className={styles.mailLink} href="mailto:elikosamed@gmail.com">
                <FiMail />
                elikosamed@gmail.com
              </a>
            </div>
          </article>

          <article className={styles.contactCard}>
            <div className={styles.avatar}>
              <FiSend />
            </div>

            <h2>Eteri Jafarova</h2>

            <div className={styles.contactInfo}>
              <p>{t("contacts.email")}</p>

              <a
                className={styles.mailLink}
                href="mailto:etericeferova2005@gmail.com"
              >
                <FiMail />
                etericeferova2005@gmail.com
              </a>
            </div>
          </article>
        </div>

        <section className={styles.schedule}>
          <div className={styles.scheduleIcon}>
            <FiClock />
          </div>

          <div>
            <h3>{t("contacts.businessHours")}</h3>

            <p>{t("contacts.weekdays")}</p>
            <p>{t("contacts.weekend")}</p>

            <div className={styles.message}>
              <FiMessageCircle /> We are always happy to help readers find their
              next story.
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Contacts;
