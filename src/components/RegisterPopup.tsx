import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useTranslation } from "react-i18next";
import AuthModal from "./AuthModal";
import styles from "../styles/RegisterPopup.module.css";

const RegisterPopup: React.FC = () => {
  const { t } = useTranslation();

  const [showPopup, setShowPopup] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      const timer = window.setTimeout(() => setShowPopup(true), 1000);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [user]);

  const handleRegisterClick = () => {
    setShowPopup(false);
    setShowAuthModal(true);
  };

  return (
    <>
      {showPopup && (
        <div className={styles.overlay} onClick={() => setShowPopup(false)}>
          <div
            className={styles.popup}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className={styles.close}
              onClick={() => setShowPopup(false)}
              type="button"
            >
              &times;
            </button>

            <div className={styles.imageFrame}>
              <img
                src="https://i.pinimg.com/736x/e4/0b/5b/e40b5b2570129482db2b1864b030ecdf.jpg"
                alt="Cheshire cat"
                className={styles.image}
              />
            </div>

            <h2 className={styles.title}>{t("registerPopup.title")}</h2>

            <p className={styles.subtitle}>{t("registerPopup.subtitle")}</p>

            <button
              className={styles.button}
              onClick={handleRegisterClick}
              type="button"
            >
              {t("registerPopup.button")}
            </button>
          </div>
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onResetPasswordClick={() => undefined}
        />
      )}
    </>
  );
};

export default RegisterPopup;
