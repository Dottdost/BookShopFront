import styles from "../styles/AboutUs.module.css";

const AboutUs = () => {
  return (
    <div className={styles.aboutUs}>
      <div className={styles.container}>
        <h1>About Cheschire Shelf</h1>
        <p>
          Welcome to <strong>Cheschire Shelf</strong> — your gateway to a world
          of stories, adventures, and knowledge. Our mission is to bring books
          closer to readers and create a space where literature thrives.
        </p>
        <p>
          At Cheschire Shelf, we believe that books have the power to inspire,
          educate, and transform lives. We offer a carefully curated collection
          of books from various genres, ensuring that there’s something for
          every reader.
        </p>
        <p>
          Whether you're a fan of timeless classics, modern fiction, or
          thought-provoking non-fiction, we’ve got you covered. Our team of
          passionate book lovers is always ready to recommend your next great
          read.
        </p>
        <p>
          Join us and become part of a vibrant reading community. Let the
          stories come to life on your shelf!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
