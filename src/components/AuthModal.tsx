import { useState, useEffect } from "react";
import styles from "../styles/AuthModal.module.css";
import { useAuth } from "../hooks/useAuth";
import classNames from "classnames";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface Props {
  onClose: () => void;
  onResetPasswordClick: () => void;
}

const AuthModal: React.FC<Props> = ({ onClose, onResetPasswordClick }) => {
  const { t } = useTranslation();
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
          newErrors.userName = t("auth.usernameHint");
        }

        if (formData.password && !validatePassword(formData.password)) {
          newErrors.password = t("auth.passwordHint");
        }

        setErrors(newErrors);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.userName, formData.password, isRegistering, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegistering) {
      if (!validateUsername(formData.userName)) {
        setError(t("auth.invalidUsername"));
        toast.error(t("auth.invalidUsername"));
        return;
      }
      if (!validatePassword(formData.password)) {
        setError(t("auth.invalidPassword"));
        toast.error(t("auth.invalidPassword"));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(t("auth.passwordsDoNotMatch"));
        toast.error(t("auth.passwordsDoNotMatch"));
        return;
      }

      const { success, error } = await handleRegister(
        formData.userName,
        formData.email,
        formData.password
      );

      if (success) {
        toast.success(t("auth.registrationSuccess"));
        setIsRegistering(false);
      } else {
        setError(error || t("auth.registrationFailed"));
        toast.error(error || t("auth.registrationFailed"));
      }
    } else {
      const { success, error } = await handleLogin(
        formData.userName,
        formData.password
      );

      if (success) {
        toast.success(t("auth.loginSuccess"));
        onClose();
      } else {
        setError(error || t("auth.loginFailed"));
        toast.error(error || t("auth.loginFailed"));
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
        <h2>{isRegistering ? t("auth.register") : t("auth.login")}</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder={t("auth.username")}
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

          {isRegistering && (
            <div className={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("auth.email")}
                required
              />
            </div>
          )}

          <div className={styles.inputWrapper}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("auth.password")}
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

          {isRegistering && (
            <div className={styles.inputWrapper}>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t("auth.confirmPassword")}
                required
              />
            </div>
          )}

          <button type="submit" className={styles.button}>
            {isRegistering ? t("auth.register") : t("auth.login")}
          </button>
        </form>

        {!isRegistering && (
          <p className={styles.forgotPassword}>
            {t("auth.forgotPassword")} {" "}
            <span
              className={styles.switchLink}
              onClick={() => {
                onClose();
                onResetPasswordClick();
              }}
            >
              {t("auth.resetHere")}
            </span>
          </p>
        )}

        <p className={styles.switchText}>
          {isRegistering ? t("auth.alreadyHaveAccount") : t("auth.noAccount")} {" "}
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
            {isRegistering ? t("auth.login") : t("auth.register")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
