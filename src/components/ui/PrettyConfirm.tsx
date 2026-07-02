import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import styles from "../../styles/PrettyConfirm.module.css";

type PrettyConfirmType = "danger" | "warning" | "info" | "success";

type PrettyConfirmProps = {
  open: boolean;
  title: string;
  message: string;
  type?: PrettyConfirmType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function getIcon(type: PrettyConfirmType) {
  if (type === "success") return <FiCheckCircle />;
  if (type === "info") return <FiInfo />;
  return <FiAlertTriangle />;
}

export default function PrettyConfirm({
  open,
  title,
  message,
  type = "warning",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: PrettyConfirmProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onCancel}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onCancel}
          aria-label="Close"
        >
          <FiX />
        </button>

        <div className={`${styles.iconCircle} ${styles[type]}`}>
          {getIcon(type)}
        </div>

        <h3>{title}</h3>

        <p>{message}</p>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>

          <button
            type="button"
            className={`${styles.confirmBtn} ${styles[type]}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
