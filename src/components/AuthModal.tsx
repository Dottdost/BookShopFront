import { useState } from "react";
import styles from "../styles/AuthModal.module.css";

interface Props {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AuthModal: React.FC<Props> = ({ onClose, onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const url = isRegistering
      ? "https://localhost:44308/api/v1/.../Register"
      : "https://localhost:44308/api/v1/.../Login";//dont forgeet to change the url

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(isRegistering ? "Registration failed" : "Login failed");
      }

      const data = await response.json();

      if (!isRegistering) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        onLoginSuccess();
      }

      alert(isRegistering ? "Registration successful!" : "Login successful!");
      onClose();
    } catch (err) {
      setError((err as Error).message);
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
          {isRegistering && (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
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
