import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import styles from "../styles/WelcomeAnimation.module.css";

type WelcomeVariant = "register" | "login" | "order";

interface WelcomeAnimationProps {
  onClose: () => void;
  variant?: WelcomeVariant;
}

type AssetMap = Record<string, string>;

type CelebrationCopy = {
  eyebrow: string;
  title: string;
  text: string;
  subtext: string;
  button: string;
};

const assetModules = import.meta.glob("../assets/*", {
  eager: true,
  import: "default",
}) as AssetMap;

const mediaHints: Record<WelcomeVariant, string[]> = {
  register: ["video", "welcome", "register"],
  login: ["login"],
  order: ["orders", "order"],
};

const fallbackCopy: Record<WelcomeVariant, CelebrationCopy> = {
  register: {
    eyebrow: "You’ve Found Me…",
    title: "Welcome to Cheshire Shelf",
    text: "Every great story begins with a single page.",
    subtext: "I’ve been waiting for someone curious.",
    button: "Begin the Adventure",
  },
  login: {
    eyebrow: "Welcome back, reader",
    title: "The shelf missed you",
    text: "Your books, favorites and cart are ready to continue the story.",
    subtext: "Come back in — Cheshire Shelf kept your place.",
    button: "Return to the Shelf",
  },
  order: {
    eyebrow: "Order confirmed",
    title: "Your books are on their way",
    text: "The shelf has packed your next adventure with a little magic.",
    subtext: "You can track everything from your orders page.",
    button: "Keep Reading",
  },
};

function findMedia(variant: WelcomeVariant) {
  const entries = Object.entries(assetModules);
  const hints = mediaHints[variant];

  const matched = entries.find(([path]) => {
    const normalized = path.toLowerCase();

    return hints.some((hint) => normalized.includes(hint));
  });

  if (matched) return matched[1];

  const fallback = entries.find(([path]) => path.toLowerCase().includes("video"));

  return fallback?.[1] ?? "";
}

function isVideoFile(src: string) {
  const normalized = src.toLowerCase().split("?")[0];

  return (
    normalized.endsWith(".mp4") ||
    normalized.endsWith(".webm") ||
    normalized.endsWith(".ogg")
  );
}

const WelcomeAnimation = ({ onClose, variant = "register" }: WelcomeAnimationProps) => {
  const { t } = useTranslation();
  const mediaSrc = findMedia(variant);
  const isVideo = isVideoFile(mediaSrc);
  const copy = fallbackCopy[variant];

  return createPortal(
    <div className={styles.overlay}>
      <div className={`${styles.card} ${styles[variant]}`}>
        <button className={styles.closeButton} type="button" onClick={onClose}>
          ×
        </button>

        <div className={styles.videoFrame}>
          {isVideo ? (
            <video
              className={styles.video}
              src={mediaSrc}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              className={styles.video}
              src={mediaSrc}
              alt={t(`celebration.${variant}.title`, copy.title)}
            />
          )}
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>
            {t(`celebration.${variant}.eyebrow`, copy.eyebrow)}
          </p>

          <h2 className={styles.title}>
            {t(`celebration.${variant}.title`, copy.title)}
          </h2>

          <p className={styles.text}>
            {t(`celebration.${variant}.text`, copy.text)}
          </p>

          <p className={styles.subtext}>
            {t(`celebration.${variant}.subtext`, copy.subtext)}
          </p>

          <button className={styles.button} type="button" onClick={onClose}>
            {t(`celebration.${variant}.button`, copy.button)}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default WelcomeAnimation;
export type { WelcomeVariant };
