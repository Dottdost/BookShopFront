import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import styles from "../styles/RegisterPopup.module.css";

const RegisterPopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRegisterClick = () => {
    setShowPopup(false); // Закрытие попапа
    setShowAuthModal(true); // Открытие модального окна регистрации
  };

  return (
    <>
      {showPopup && (
        <div className={styles.overlay} onClick={() => setShowPopup(false)}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.close}
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
            <img
              src="https://i.pinimg.com/736x/e4/0b/5b/e40b5b2570129482db2b1864b030ecdf.jpg"
              alt="Cat"
              className={styles.image}
            />
            <h2>Join us!</h2>
            <p>Register to get 20% discount!</p>
            <button className={styles.button} onClick={handleRegisterClick}>
              Register Now
            </button>
          </div>
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={() => console.log("Logged in successfully!")}
        />
      )}
    </>
  );
};

export default RegisterPopup;
