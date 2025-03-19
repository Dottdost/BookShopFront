import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Home = () => {
  const [text, setText] = useState<string>("");
  const fullText =
    "Welcome to Cheschire Shelf! Step into a world where stories come to life!";
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

  return (
    <div className={styles.home}>
      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default Home;
