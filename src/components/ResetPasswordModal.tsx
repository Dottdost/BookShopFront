import { useState } from "react";
import styles from "../styles/AuthModal.module.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface Props {
  onClose: () => void;
}

type ErrorResponse = {
  message?: string;
};

const ResetPasswordModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const getErrorMessage = async (response: Response) => {
    try {
      const data = (await response.json()) as ErrorResponse;

      return data.message || t("auth.failedResetEmail");
    } catch {
      return t("auth.failedResetEmail");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://cheshireshelfapp-env.eba-pzcyg6yq.eu-north-1.elasticbeanstalk.com/api/v1/Account/request-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      toast.success(t("auth.resetLinkSent"));
      setEmail("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("auth.resetLinkError");

      toast.error(message);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <button className={styles.close} onClick={onClose} type="button">
          &times;
        </button>

        <h2 className={styles.title}>{t("auth.resetPassword")}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              placeholder={t("auth.enterEmail")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button}>
            {t("auth.sendResetLink")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
