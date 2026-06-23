import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/12345.jpg";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useAuth } from "../hooks/useAuth";
import { changeAppLanguage, languages, type AppLanguage } from "../i18n";
import styles from "../styles/Navbar.module.css";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  openAuthModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ openAuthModal }) => {
  const { t, i18n } = useTranslation();
  const { user, roles, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const { handleLogout } = useAuth();
  const isAdmin = roles.some(
    (r) =>
      r.roleName === "Admin" ||
      r.roleName === "AppAdmin" ||
      r.roleName === "SuperAdmin",
  );

  const [menuOpen, setMenuOpen] = useState(false);

  const currentLanguage = languages.includes(i18n.language as AppLanguage)
    ? (i18n.language as AppLanguage)
    : "en";

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLinkClick = () => setMenuOpen(false);

  const handleLanguageChange = async () => {
    const currentIndex = languages.indexOf(currentLanguage);
    const nextLanguage = languages[(currentIndex + 1) % languages.length];
    await changeAppLanguage(nextLanguage);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/" onClick={handleLinkClick}>
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <div
        className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ul>
          <li>
            <Link to="/" onClick={handleLinkClick}>
              {t("nav.home")}
            </Link>
          </li>
          <li>
            <Link to="/books" onClick={handleLinkClick}>
              {t("nav.books")}
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={handleLinkClick}>
              {t("nav.about")}
            </Link>
          </li>
          <li>
            <Link to="/contacts" onClick={handleLinkClick}>
              {t("nav.contacts")}
            </Link>
          </li>

          {isAdmin && (
            <li>
              <Link to="/admin" onClick={handleLinkClick}>
                {t("nav.admin")}
              </Link>
            </li>
          )}

          {isAuthenticated && (
            <>
              <li>
                <Link to="/favorites" onClick={handleLinkClick}>
                  {t("nav.favorites")}
                </Link>
              </li>
              <li>
                <Link to="/orders" onClick={handleLinkClick}>
                  {t("nav.orders")}
                </Link>
              </li>
              <li>
                <Link to="/cart" onClick={handleLinkClick}>
                  {t("nav.cart")}
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className={styles.auth}>
        <button
          className={styles.languageButton}
          type="button"
          onClick={handleLanguageChange}
          aria-label={t("language.label")}
        >
          🌐 {currentLanguage.toUpperCase()}
        </button>

        {isAuthenticated && user ? (
          <div className={styles.userSection}>
            <button className={styles.logoutButton} onClick={handleLogout}>
              {t("nav.logout")}
            </button>
          </div>
        ) : (
          <button className={styles.loginButton} onClick={openAuthModal}>
            {t("nav.login")}
          </button>
        )}
      </div>

      <div
        className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
