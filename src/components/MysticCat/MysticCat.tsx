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
    utterance.rate = 0.92;
    utterance.pitch = 1.25;
    utterance.volume = 0.75;

    window.speechSynthesis.speak(utterance);
  };

  const handleClick = () => {
    const next = (current + 1) % messages.length;

    setCurrent(next);
    setIsTalking(true);
    speak(messages[next]);

    setTimeout(() => {
      setIsTalking(false);
    }, 650);
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

      const moveX = Math.max(-4, Math.min(4, x * 10));
      const moveY = Math.max(-4, Math.min(4, y * 10));

      setPupilMove({ x: moveX, y: moveY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.55) {
        setCurrent((prev) => (prev + 1) % messages.length);
      }
    }, 8500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`mascot-container ${isTalking ? "talking" : ""}`}
      id="mystic-cat-mascot"
      onClick={handleClick}
    >
      <div className="magic-orb orb-1"></div>
      <div className="magic-orb orb-2"></div>
      <div className="magic-orb orb-3"></div>

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

          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
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
            opacity="0.55"
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
          fill="#caa4ff"
          opacity="0.35"
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
          stroke="#ff8df4"
          strokeWidth="5"
          opacity="0.45"
        />
        <path
          d="M100 42 C111 54, 119 54, 131 44"
          fill="none"
          stroke="#ff8df4"
          strokeWidth="4"
          opacity="0.38"
        />
        <path
          d="M59 92 C70 85, 81 84, 91 90"
          fill="none"
          stroke="#36125c"
          strokeWidth="5"
          opacity="0.42"
        />
        <path
          d="M129 90 C140 84, 152 85, 163 92"
          fill="none"
          stroke="#36125c"
          strokeWidth="5"
          opacity="0.42"
        />

        <g className="eye">
          <ellipse cx="84" cy="86" rx="15" ry="23" fill="#f8f2ff" />
          <ellipse cx="136" cy="86" rx="15" ry="23" fill="#f8f2ff" />
        </g>

        <circle
          className="pupil"
          cx="84"
          cy="86"
          r="7"
          fill="#170027"
          style={{ transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)` }}
        />
        <circle
          className="pupil"
          cx="136"
          cy="86"
          r="7"
          fill="#170027"
          style={{ transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)` }}
        />

        <circle cx="80" cy="80" r="3" fill="#ffffff" opacity="0.9" />
        <circle cx="132" cy="80" r="3" fill="#ffffff" opacity="0.9" />

        <path d="M105 101 Q110 96 115 101 Q110 108 105 101Z" fill="#ff8df4" />

        <path
          className="smile"
          d="M66 118 C85 146, 135 146, 154 118"
          fill="none"
          stroke="#ff65f2"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#softGlow)"
        />

        <path
          className="mouth-small"
          d="M97 126 C105 134, 116 134, 124 126"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.8"
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
          opacity="0.28"
          strokeDasharray="8 12"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 110 122"
            to="360 110 122"
            dur="16s"
            repeatCount="indefinite"
          />
        </ellipse>
      </svg>

      <div className="click-hint">click the cat ✦</div>
    </div>
  );
}
