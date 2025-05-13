import { useState, useEffect } from "react";
import styles from "../styles/AuthModal.module.css";
import { useAuth } from "../hooks/useAuth";
import classNames from "classnames";
import { toast } from "react-toastify";

interface Props {
  onClose: () => void;
  onResetPasswordClick: () => void;
}

const AuthModal: React.FC<Props> = ({ onClose, onResetPasswordClick }) => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    userName: "",
    password: "",
  });

  const { handleLogin, handleRegister } = useAuth();

  const validateUsername = (username: string) => {
    const usernameRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{6,}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isRegistering) {
        const newErrors = { userName: "", password: "" };

        if (formData.userName && !validateUsername(formData.userName)) {
          newErrors.userName =
            "Username must be at least 6 characters and include a letter, number, and special character.";
        }

        if (formData.password && !validatePassword(formData.password)) {
          newErrors.password =
            "Password must be at least 8 characters, include lowercase, uppercase, number, and special character.";
        }

        setErrors(newErrors);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.userName, formData.password, isRegistering]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegistering) {
      if (!validateUsername(formData.userName)) {
        setError("Invalid username.");
        toast.error("Invalid username.");
        return;
      }
      if (!validatePassword(formData.password)) {
        setError("Invalid password.");
        toast.error("Invalid password.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        toast.error("Passwords do not match.");
        return;
      }

      const { success, error } = await handleRegister(
        formData.userName,
        formData.email,
        formData.password
      );

      if (success) {
        toast.success("Registration successful! Please login.");
        setIsRegistering(false);
      } else {
        setError(error || "Registration failed");
        toast.error(error || "Registration failed");
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
        toast.error(error || "Login failed");
      }
    }
  };

  const isUsernameValid = validateUsername(formData.userName);
  const isPasswordValid = validatePassword(formData.password);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          &times;
        </button>
        <h2>{isRegistering ? "Register" : "Login"}</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Username"
              required
              className={classNames({
                [styles.valid]:
                  isRegistering && formData.userName && isUsernameValid,
                [styles.invalid]:
                  isRegistering && formData.userName && !isUsernameValid,
              })}
            />
            {isRegistering && formData.userName && (
              <span
                className={`${styles.icon} ${
                  isUsernameValid ? styles.success : styles.errorIcon
                }`}
              >
                {isUsernameValid ? "✅" : "❌"}
              </span>
            )}
          </div>
          {errors.userName && (
            <small className={styles.errorHint}>{errors.userName}</small>
          )}

          {/* Email */}
          {isRegistering && (
            <div className={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
          )}

          {/* Password */}
          <div className={styles.inputWrapper}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className={classNames({
                [styles.valid]:
                  isRegistering && formData.password && isPasswordValid,
                [styles.invalid]:
                  isRegistering && formData.password && !isPasswordValid,
              })}
            />
            {isRegistering && formData.password && (
              <span
                className={`${styles.icon} ${
                  isPasswordValid ? styles.success : styles.errorIcon
                }`}
              >
                {isPasswordValid ? "✅" : "❌"}
              </span>
            )}
          </div>
          {errors.password && (
            <small className={styles.errorHint}>{errors.password}</small>
          )}

          {/* Confirm Password */}
          {isRegistering && (
            <div className={styles.inputWrapper}>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </div>
          )}

          <button type="submit" className={styles.button}>
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        {!isRegistering && (
          <p className={styles.forgotPassword}>
            Forgot password?{" "}
            <span
              className={styles.switchLink}
              onClick={() => {
                onClose();
                onResetPasswordClick();
              }}
            >
              Reset here
            </span>
          </p>
        )}

        <p className={styles.switchText}>
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            className={styles.switchLink}
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
              setFormData({
                userName: "",
                email: "",
                password: "",
                confirmPassword: "",
              });
              setErrors({ userName: "", password: "" });
            }}
          >
            {isRegistering ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
