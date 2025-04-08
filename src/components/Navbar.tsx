import { Link } from "react-router-dom";
import logo from "../assets/LogoCS.png";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/Navbar.module.css";

interface NavbarProps {
  openAuthModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ openAuthModal }) => {
  const { user, isAdmin, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { handleLogout } = useAuth();

  return (
    <nav className={styles.navbar}>
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
        {isAdmin && (
          <li>
            <Link to="/admin">Admin Panel</Link>
          </li>
        )}
        {isAuthenticated && (
          <>
            <li>
              <Link to="/favorites">Favorites</Link>
            </li>
            <li>
              <Link to="/orders">My Orders</Link>
            </li>
          </>
        )}
      </ul>
      <div className={styles.auth}>
        {isAuthenticated ? (
          <div className={styles.userSection}>
            <span className={styles.username}>Hello, {user}!</span>
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
    </nav>
  );
};

export default Navbar;
