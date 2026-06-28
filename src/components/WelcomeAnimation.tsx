import styles from "../styles/WelcomeAnimation.module.css";
import welcomeVideo from "../assets/video.mp4";

interface WelcomeAnimationProps {
  onClose: () => void;
}

const WelcomeAnimation = ({ onClose }: WelcomeAnimationProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <button className={styles.closeButton} type="button" onClick={onClose}>
          ×
        </button>

        <div className={styles.videoFrame}>
          <video
            className={styles.video}
            src={welcomeVideo}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>You’ve Found Me…</p>

          <h2 className={styles.title}>Welcome to Cheshire Shelf</h2>

          <p className={styles.text}>
            Every great story begins with a single page.
          </p>

          <p className={styles.subtext}>
            I’ve been waiting for someone curious.
          </p>

          <button className={styles.button} type="button" onClick={onClose}>
            Begin the Adventure
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
