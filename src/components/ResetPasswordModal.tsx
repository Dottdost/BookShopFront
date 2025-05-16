import { useState } from "react";
import styles from "../styles/AuthModal.module.css";
import { toast } from "react-toastify";

interface Props {
  onClose: () => void;
}

const ResetPasswordModal: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://localhost:44308/api/v1/Account/request-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to send reset email");
      }

      toast.success("Reset password link has been sent to your email.");
      setEmail("");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while sending reset link.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          &times;
        </button>
        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
