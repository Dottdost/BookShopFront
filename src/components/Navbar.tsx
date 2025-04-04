import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import logo from "../assets/LogoCS.png";

interface NavbarProps {
  user: string | null;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("accessToken")
  );
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
  };

  return (
    <nav className={`${styles.navbar} ${theme === "dark" ? "dark" : ""}`}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="Logo" />
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
          <button className={styles.profileButton} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className={styles.loginButton} onClick={onLoginClick}>
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
  );
};

export default Navbar;
