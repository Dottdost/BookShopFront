import { useState } from "react";
import styles from "../styles/AuthModal.module.css";

interface Props {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<Props> = ({ onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
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

    try {
      const response = await fetch(
        "https://localhost:44308/api/v1/Auth/Login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      onLoginSuccess();
      alert("Login successful!");
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
        <h2>Login</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?{" "}
          <span
            className={styles.switchLink}
            onClick={() => onClose()} // This should trigger the registration modal
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
