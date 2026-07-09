import { useEffect, useState } from "react";
import "./MysticCat.css";

const messages = [
  "Welcome to Cheshire Shelf...",
  "What story shall we open today?",
  "Looking for your next favorite book?",
  "Need help finding a book?",
  "Careful... good books have claws.",
  "Purr. Let me help you choose.",
  "Some books choose their readers first.",
  "Every shelf has a secret.",
];

export default function MysticCat() {
  const [current, setCurrent] = useState(0);
  const [isTalking, setIsTalking] = useState(false);
  const [pupilMove, setPupilMove] = useState({ x: 0, y: 0 });

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.94;
    utterance.pitch = 1.08;
    utterance.volume = 0.72;

    window.speechSynthesis.speak(utterance);
  };

  const handleClick = () => {
    const next = (current + 1) % messages.length;
    setCurrent(next);
    setIsTalking(true);
    speak(messages[next]);

    window.setTimeout(() => {
      setIsTalking(false);
    }, 700);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mascot = document.getElementById("mystic-cat-mascot");
      if (!mascot) return;

      const rect = mascot.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (event.clientX - centerX) / rect.width;
      const y = (event.clientY - centerY) / rect.height;

      const moveX = Math.max(-2.5, Math.min(2.5, x * 7));
      const moveY = Math.max(-2, Math.min(2, y * 6));

      setPupilMove({ x: moveX, y: moveY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (Math.random() > 0.6) {
        setCurrent((prev) => (prev + 1) % messages.length);
      }
    }, 9000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className={`mascot-container ${isTalking ? "talking" : ""}`}
      id="mystic-cat-mascot"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleClick();
        }
      }}
      aria-label="Mystic cat assistant"
    >
      <div className="magic-orb orb-1" />
      <div className="magic-orb orb-2" />

      <div className="speech-bubble show">{messages[current]}</div>

      <svg
        className="cat-svg"
        viewBox="0 0 220 240"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="furGradient" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="48%" stopColor="#9b5cff" />
            <stop offset="100%" stopColor="#5b21b6" />
          </radialGradient>

          <linearGradient id="innerEar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9d5ff" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          <linearGradient
            id="bellyGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        <g className="tail">
          <path
            d="M145 154 C185 160, 196 199, 170 210 C150 218, 132 204, 145 190"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="22"
            strokeLinecap="round"
          />
        </g>

        <ellipse cx="110" cy="165" rx="46" ry="55" fill="url(#furGradient)" />
        <ellipse
          cx="110"
          cy="173"
          rx="24"
          ry="32"
          fill="url(#bellyGradient)"
          opacity="0.45"
        />

        <ellipse cx="80" cy="212" rx="18" ry="12" fill="#6d28d9" />
        <ellipse cx="140" cy="212" rx="18" ry="12" fill="#6d28d9" />

        <g className="left-ear">
          <path
            d="M63 76 L79 26 L102 76 Z"
            fill="url(#furGradient)"
            stroke="#3b0764"
            strokeWidth="4"
          />
          <path d="M73 66 L80 40 L93 66 Z" fill="url(#innerEar)" />
        </g>

        <g className="right-ear">
          <path
            d="M157 76 L141 26 L118 76 Z"
            fill="url(#furGradient)"
            stroke="#3b0764"
            strokeWidth="4"
          />
          <path d="M147 66 L140 40 L127 66 Z" fill="url(#innerEar)" />
        </g>

        <ellipse
          cx="110"
          cy="95"
          rx="62"
          ry="57"
          fill="url(#furGradient)"
          stroke="#3b0764"
          strokeWidth="4"
        />

        {/* normal symmetric eyebrows */}
        <path
          d="M74 72 Q84 66 94 72"
          fill="none"
          stroke="#3b0764"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M126 72 Q136 66 146 72"
          fill="none"
          stroke="#3b0764"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <g className="eye">
          <ellipse cx="84" cy="92" rx="14" ry="18" fill="#ffffff" />
          <ellipse cx="136" cy="92" rx="14" ry="18" fill="#ffffff" />
        </g>

        <circle
          className="pupil"
          cx="84"
          cy="94"
          r="6.5"
          fill="#1f1130"
          style={{ transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)` }}
        />
        <circle
          className="pupil"
          cx="136"
          cy="94"
          r="6.5"
          fill="#1f1130"
          style={{ transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)` }}
        />

        <circle cx="80" cy="89" r="2.5" fill="#ffffff" opacity="0.9" />
        <circle cx="132" cy="89" r="2.5" fill="#ffffff" opacity="0.9" />

        <path d="M104 106 Q110 100 116 106 Q110 112 104 106Z" fill="#f9a8d4" />

        <path
          className="mouth-rest"
          d="M99 118 Q110 128 121 118"
          fill="none"
          stroke="#fdf2f8"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <ellipse
          className="mouth-talk"
          cx="110"
          cy="121"
          rx="7"
          ry="5"
          fill="#fff7fb"
          stroke="#f9a8d4"
          strokeWidth="1.8"
        />

        <g
          className="whiskers"
          stroke="#f5d0fe"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M92 109 C72 103, 52 104, 34 109" />
          <path d="M92 117 C72 118, 54 126, 38 136" />
          <path d="M128 109 C148 103, 168 104, 186 109" />
          <path d="M128 117 C148 118, 166 126, 182 136" />
        </g>
      </svg>

      <div className="click-hint">click the cat ✦</div>
    </div>
  );
}
