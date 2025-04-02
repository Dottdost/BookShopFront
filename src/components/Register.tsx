import { useState } from "react";
import styles from "../styles/AuthModal.module.css";

interface Props {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const Register: React.FC<Props> = ({ onClose, onLoginSuccess }) => {
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

    try {
      const response = await fetch(
        "https://localhost:44308/api/v1/Account/Register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      alert("Registration successful!");
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
        <h2>Register</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
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
            Register
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{" "}
          <span className={styles.switchLink} onClick={() => onClose()}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
