import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";

interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
}

const bookIds = [
  "4292644e-5757-48ea-a9f1-5781b0f8afb8",
  "0d6d635e-03f9-48b6-bef6-bb4b90373588",
  "43fd1bbf-7a04-4789-8833-18d1b54be9f5",
  "ec249b5f-918e-4ef0-9ee2-21a4383a45ee",
  "d14eb84f-22f0-4edf-91c5-ec512d2450da",
  "3d47df4d-22a6-4da8-9aa4-1c492f773c4b",
  "ed00555e-5375-41bb-87c5-e562c558a4d5",
];

const Home = () => {
  const [text, setText] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);

  const fullText =
    "Welcome to Cheshire Shelf! Step into a world where stories come to life!";
  const typingSpeed = 70;

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const responses = await Promise.all(
          bookIds.map(async (id) => {
            const res = await fetch(`https://localhost:44308/api/books/${id}`);
            return res.json();
          })
        );
        setBooks(responses);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <>
      <div className={styles.home}>
        <div className={styles.text}>{text}</div>
      </div>

      <div className={styles.contentWrapper}>
        <h2 className={styles.recommendationsTitle}>
          Recommendations from Cheshire Shelf Team
        </h2>
        <div className={styles.bookGrid}>
          {books.map((book) => (
            <Link
              style={{ textDecoration: "none" }}
              key={book.id}
              to={`/books/${book.id}`}
              className={styles.cardLink}
            >
              <div className={styles.card}>
                <div className={styles.imageContainer}>
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className={styles.image}
                  />
                </div>
                <div className={styles.bookInfo}>
                  <h3 className={styles.title}>{book.title}</h3>
                  <p className={styles.bookAuthor}>{book.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
