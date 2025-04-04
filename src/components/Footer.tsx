import React from "react";
import styles from "../styles/Footer.module.css";
const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.info}>
          <p>Delivery: 3-5 days</p>
          <p>
            Contacts:
            <a href="mailto:info@CheschireShelf.az">info@CheschireShelf.az</a>
          </p>
          <p>
            We hope that your journey into the world of books will be exciting
            with us!
          </p>
        </div>
        <div className={styles.image}>
          <img
            src="https://th.bing.com/th/id/R.4bb4061762fa6e8da77329fbe6ffa2b6?rik=qoAo0V1SkpgeWQ&riu=http%3a%2f%2fclipart-library.com%2fimg1%2f725330.gif&ehk=yx8A%2fihduaVxP0IbICqjW6vFdv2YnnqRTWkUim%2bVNZQ%3d&risl=1&pid=ImgRaw&r=0"
            alt="Book"
            className={styles.bookImage}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
