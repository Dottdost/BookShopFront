import styles from "../styles/Contacts.module.css";

const Contacts = () => {
  return (
    <div className={styles.contacts}>
      <h1>Contact Us</h1>
      <p>
        You can reach us during business hours for any questions or assistance!
      </p>
      <div className={styles.contactList}>
        <div className={styles.contactCard}>
          <h2>Hamida Samad-zade</h2>
          <p>
            Email:
            <a href="mailto:elikosamed@gmail.com">elikosamed@gmail.com</a>
          </p>
        </div>
        <div className={styles.contactCard}>
          <h2>Eteri Jafarova</h2>
          <p>
            Email:
            <a href="mailto:etericeferova2005@gmail.com">
              etericeferova2005@gmail.com
            </a>
          </p>
        </div>
      </div>
      <div className={styles.schedule}>
        <h3>Business Hours</h3>
        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
        <p>Saturday - Sunday: Closed</p>
      </div>
    </div>
  );
};

export default Contacts;
