import { useState } from "react";
import styles from "../styles/AuthModal.module.css";
import { useAuth } from "../hooks/useAuth";

interface Props {
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ onClose }) => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const { handleLogin, handleRegister } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegistering) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const { success, error } = await handleRegister(
        formData.userName,
        formData.email,
        formData.password
      );

      if (success) {
        alert("Registration successful! Please login.");
        setIsRegistering(false);
      } else {
        setError(error || "Registration failed");
      }
    } else {
      const { success, error } = await handleLogin(
        formData.userName,
        formData.password
      );

      if (success) {
        onClose();
      } else {
        setError(error || "Login failed");
      }
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          &times;
        </button>
        <h2>{isRegistering ? "Register" : "Login"}</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          {isRegistering && (
            <>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </>
          )}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          {isRegistering && (
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
          )}
          <button type="submit" className={styles.button}>
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <p className={styles.switchText}>
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            className={styles.switchLink}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
