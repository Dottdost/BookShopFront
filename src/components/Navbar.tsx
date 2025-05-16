import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/12345.jpg";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/Navbar.module.css";

interface NavbarProps {
  openAuthModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ openAuthModal }) => {
  const { user, roles, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { handleLogout } = useAuth();
  const isAdmin = roles.some((r) => r.roleName === "Admin");

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLinkClick = () => setMenuOpen(false);

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
              Home
            </Link>
          </li>
          <li>
            <Link to="/books" onClick={handleLinkClick}>
              Books
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={handleLinkClick}>
              About us
            </Link>
          </li>
          <li>
            <Link to="/contacts" onClick={handleLinkClick}>
              Contacts
            </Link>
          </li>

          {isAdmin && (
            <li>
              <Link to="/admin" onClick={handleLinkClick}>
                Admin Panel
              </Link>
            </li>
          )}

          {isAuthenticated && (
            <>
              <li>
                <Link to="/favorites" onClick={handleLinkClick}>
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/orders" onClick={handleLinkClick}>
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" onClick={handleLinkClick}>
                  Cart
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className={styles.auth}>
        {isAuthenticated && user ? (
          <div className={styles.userSection}>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className={styles.loginButton} onClick={openAuthModal}>
            Login
          </button>
        )}
      </div>

      {/* Гамбургер-иконка */}
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
