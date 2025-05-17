import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import AuthModal from "./AuthModal";
import styles from "../styles/RegisterPopup.module.css";

const RegisterPopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setShowPopup(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleRegisterClick = () => {
    setShowPopup(false);
    setShowAuthModal(true);
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
            <p>
              ✨ Sign up to receive a magical promo code upon confirmation - and
              enjoy 15% off your next adventure! 🛍
            </p>
            <button className={styles.button} onClick={handleRegisterClick}>
              Register Now
            </button>
          </div>
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onResetPasswordClick={() => {}}
        />
      )}
    </>
  );
};

export default RegisterPopup;
