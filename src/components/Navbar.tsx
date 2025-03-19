import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <nav className={`${styles.navbar} ${theme === "dark" ? "dark" : ""}`}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="src/assets/LogoCS.png" alt="Logo" />
          </Link>
        </div>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/books">Books</Link>
          </li>
          <li>
            <Link to="/about">About us</Link>
          </li>
          <li>
            <Link to="/contacts">Contacts</Link>
          </li>
        </ul>
        <div className={styles.auth}>
          {isLoggedIn ? (
            <button className={styles.profileButton}>Profile</button>
          ) : (
            <button
              className={styles.loginButton}
              onClick={() => setShowAuthModal(true)}
            >
              Login
            </button>
          )}
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </nav>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={() => setIsLoggedIn(true)}
        />
      )}
    </>
  );
};

export default Navbar;
