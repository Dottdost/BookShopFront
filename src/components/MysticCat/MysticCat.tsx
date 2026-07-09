import { useEffect, useState } from "react";
import "./MysticCat.css";

const messages = [
  "Welcome to Cheshire Shelf...",
  "What story shall we open today?",
  "Looking for your next favorite book?",
  "I know a book that might haunt you beautifully.",
  "Careful... good books have claws.",
  "Purr. Let me help you find the perfect read.",
  "In this library, even shadows read.",
  "Click again. I promise I will not disappear. Yet.",
  "Some books choose their readers first.",
  "Every shelf has a secret. Shall we find yours?",
  "Need a recommendation? I have excellent taste.",
  "A little mystery makes every story better.",
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
    utterance.rate = 0.9;
    utterance.pitch = 1.12;
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
    }, 780);
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

      const moveX = Math.max(-3.2, Math.min(3.2, x * 8));
      const moveY = Math.max(-2.2, Math.min(2.2, y * 6));

      setPupilMove({ x: moveX, y: moveY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (Math.random() > 0.55) {
        setCurrent((prev) => (prev + 1) % messages.length);
      }
    }, 8500);

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
      <div className="magic-orb orb-3" />

      <div className="speech-bubble show">{messages[current]}</div>

      <svg
        className="cat-svg"
        viewBox="0 0 220 240"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="furGradient" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#d9b2ff" />
            <stop offset="42%" stopColor="#9b5cff" />
            <stop offset="100%" stopColor="#4a168c" />
          </radialGradient>

          <linearGradient id="innerEar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd1fa" />
            <stop offset="100%" stopColor="#a64dff" />
          </linearGradient>

          <linearGradient
            id="bellyGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#d8c4ff" />
            <stop offset="100%" stopColor="#8d62ec" />
          </linearGradient>

          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="tail">
          <path
            d="M142 150 C190 155, 204 201, 174 214 C148 225, 126 205, 144 187 C158 172, 181 190, 165 201"
            fill="none"
            stroke="#8f4dff"
            strokeWidth="25"
            strokeLinecap="round"
            opacity="0.95"
          />

          <path
            d="M142 150 C190 155, 204 201, 174 214"
            fill="none"
            stroke="#ff78f0"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>

        <ellipse
          cx="110"
          cy="162"
          rx="50"
          ry="58"
          fill="url(#furGradient)"
          opacity="0.96"
        />

        <ellipse
          cx="110"
          cy="170"
          rx="28"
          ry="36"
          fill="url(#bellyGradient)"
          opacity="0.45"
        />

        <g className="left-ear">
          <path
            d="M60 72 L76 22 L101 75 Z"
            fill="url(#furGradient)"
            stroke="#3b0b70"
            strokeWidth="5"
          />

          <path
            d="M70 65 L78 38 L92 66 Z"
            fill="url(#innerEar)"
            opacity="0.85"
          />
        </g>

        <g className="right-ear">
          <path
            d="M160 72 L144 22 L119 75 Z"
            fill="url(#furGradient)"
            stroke="#3b0b70"
            strokeWidth="5"
          />

          <path
            d="M150 65 L142 38 L128 66 Z"
            fill="url(#innerEar)"
            opacity="0.85"
          />
        </g>

        <ellipse
          cx="110"
          cy="92"
          rx="66"
          ry="60"
          fill="url(#furGradient)"
          stroke="#3b0b70"
          strokeWidth="5"
        />

        <path
          d="M74 57 C87 47, 99 48, 111 57"
          fill="none"
          stroke="#ffb4fb"
          strokeWidth="4"
          opacity="0.3"
        />

        <path
          d="M104 43 C112 52, 121 52, 130 45"
          fill="none"
          stroke="#ffb4fb"
          strokeWidth="4"
          opacity="0.22"
        />

        <g className="eye">
          <ellipse cx="84" cy="88" rx="15" ry="21" fill="#f8f2ff" />
          <ellipse cx="136" cy="88" rx="15" ry="21" fill="#f8f2ff" />
        </g>

        <circle
          className="pupil"
          cx="84"
          cy="90"
          r="7"
          fill="#170027"
          style={{ transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)` }}
        />

        <circle
          className="pupil"
          cx="136"
          cy="90"
          r="7"
          fill="#170027"
          style={{ transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)` }}
        />

        <circle cx="80" cy="83" r="3" fill="#ffffff" opacity="0.9" />
        <circle cx="132" cy="83" r="3" fill="#ffffff" opacity="0.9" />

        <path d="M105 103 Q110 98 115 103 Q110 110 105 103Z" fill="#ff8df4" />

        <path
          className="cat-cheek-left"
          d="M61 108 C69 104, 78 104, 86 108"
          fill="none"
          stroke="#ff9eea"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.5"
        />

        <path
          className="cat-cheek-right"
          d="M134 108 C142 104, 151 104, 159 108"
          fill="none"
          stroke="#ff9eea"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.5"
        />

        <path
          className="mouth-rest"
          d="M96 121 Q110 130 124 121"
          fill="none"
          stroke="#ffd6ff"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#softGlow)"
        />

        <ellipse
          className="mouth-talk"
          cx="110"
          cy="124"
          rx="9"
          ry="6"
          fill="#fff0fb"
          stroke="#ffd6ff"
          strokeWidth="2"
        />

        <g
          className="whiskers"
          stroke="#ffd6ff"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <path d="M92 108 C68 100, 47 101, 28 107" />
          <path d="M92 116 C67 116, 48 124, 30 136" />
          <path d="M128 108 C152 100, 173 101, 192 107" />
          <path d="M128 116 C153 116, 172 124, 190 136" />
        </g>

        <ellipse cx="80" cy="211" rx="19" ry="13" fill="#7b35d8" />
        <ellipse cx="140" cy="211" rx="19" ry="13" fill="#7b35d8" />

        <ellipse
          cx="110"
          cy="122"
          rx="82"
          ry="96"
          fill="none"
          stroke="#d783ff"
          strokeWidth="2"
          opacity="0.25"
          strokeDasharray="8 12"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 110 122"
            to="360 110 122"
            dur="18s"
            repeatCount="indefinite"
          />
        </ellipse>
      </svg>

      <div className="click-hint">click the cat ✦</div>
    </div>
  );
}
