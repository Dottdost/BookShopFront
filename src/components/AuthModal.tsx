import { useState, useEffect } from "react";
import styles from "../styles/AuthModal.module.css";
import { useAuth } from "../hooks/useAuth";
import classNames from "classnames";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import WelcomeAnimation from "./WelcomeAnimation";
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
  const [showWelcome, setShowWelcome] = useState(false);
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!isRegistering) return;

      const newErrors = {
        userName: "",
        password: "",
      };

      if (formData.userName && !validateUsername(formData.userName)) {
        newErrors.userName = t("auth.usernameHint");
      }

      if (formData.password && !validatePassword(formData.password)) {
        newErrors.password = t("auth.passwordHint");
      }

      setErrors(newErrors);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [formData.userName, formData.password, isRegistering, t]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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

      const { success, error: registerError } = await handleRegister(
        formData.userName,
        formData.email,
        formData.password,
      );

      if (success) {
        toast.success(t("auth.registrationSuccess"));

        setShowWelcome(true);
        setIsRegistering(false);
      } else {
        setError(registerError || t("auth.registrationFailed"));
        toast.error(registerError || t("auth.registrationFailed"));
      }

      return;
    }

    const { success, error: loginError } = await handleLogin(
      formData.userName,
      formData.password,
    );

    if (success) {
      toast.success(t("auth.loginSuccess"));
      onClose();
    } else {
      setError(loginError || t("auth.loginFailed"));
      toast.error(loginError || t("auth.loginFailed"));
    }
  };

  const isUsernameValid = validateUsername(formData.userName);
  const isPasswordValid = validatePassword(formData.password);

  const resetForm = () => {
    setIsRegistering((prev) => !prev);
    setError("");

    setFormData({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setErrors({
      userName: "",
      password: "",
    });
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div
          className={styles.modal}
          onClick={(event) => event.stopPropagation()}
        >
          <button className={styles.close} onClick={onClose} type="button">
            &times;
          </button>

          <h2 className={styles.title}>
            {isRegistering ? t("auth.register") : t("auth.login")}
          </h2>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder={t("auth.username")}
                required
                className={classNames(styles.input, {
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
                  {isUsernameValid ? <FiCheckCircle /> : <FiXCircle />}
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
                  className={styles.input}
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
                className={classNames(styles.input, {
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
                  {isPasswordValid ? <FiCheckCircle /> : <FiXCircle />}
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
                  className={styles.input}
                />
              </div>
            )}

            <button type="submit" className={styles.button}>
              {isRegistering ? t("auth.register") : t("auth.login")}
            </button>
          </form>

          {!isRegistering && (
            <p className={styles.forgotPassword}>
              {t("auth.forgotPassword")}{" "}
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
            {isRegistering ? t("auth.alreadyHaveAccount") : t("auth.noAccount")}{" "}
            <span className={styles.switchLink} onClick={resetForm}>
              {isRegistering ? t("auth.login") : t("auth.register")}
            </span>
          </p>
        </div>
      </div>

      {showWelcome && (
        <WelcomeAnimation
          onClose={() => {
            setShowWelcome(false);
          }}
        />
      )}
    </>
  );
};

export default AuthModal;
