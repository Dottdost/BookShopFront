import { useEffect, useState } from "react";
import "./MysticCat.css";

const messages = [
  "Your cart believes in you.",
  "A good book is already waiting.",
  "Maybe add just one more book?",
  "Cheshire Shelf approves this choice.",
  "Books look better in pairs.",
  "I can already hear the pages calling.",
  "Your next favorite story might be here.",
  "A little magic for your cart.",
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
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 0.75;

    window.speechSynthesis.speak(utterance);
  };

  const handleClick = () => {
    const next = (current + 1) % messages.length;
    setCurrent(next);
    setIsTalking(true);
    speak(messages[next]);

    window.setTimeout(() => {
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

      const moveX = Math.max(-2, Math.min(2, x * 6));
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
      if (Math.random() > 0.65) {
        setCurrent((prev) => (prev + 1) % messages.length);
      }
    }, 9000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      id="mystic-cat-mascot"
      className={`mascot-container ${isTalking ? "talking" : ""}`}
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
      <div className="magic-dot dot-1" />
      <div className="magic-dot dot-2" />

      <div className="speech-bubble show">{messages[current]}</div>

      <svg
        className="cat-svg"
        viewBox="0 0 220 250"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="catHeadGradient" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6d28d9" />
          </radialGradient>

          <linearGradient
            id="catBodyGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {/* tail */}
        <path
          className="tail"
          d="M148 168 C190 170, 196 214, 170 224 C150 232, 130 214, 145 198"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* body */}
        <ellipse
          cx="110"
          cy="180"
          rx="46"
          ry="52"
          fill="url(#catBodyGradient)"
        />
        <ellipse
          cx="110"
          cy="188"
          rx="22"
          ry="28"
          fill="#c4b5fd"
          opacity="0.4"
        />

        {/* paws */}
        <ellipse cx="82" cy="225" rx="16" ry="10" fill="#6d28d9" />
        <ellipse cx="138" cy="225" rx="16" ry="10" fill="#6d28d9" />

        {/* ears */}
        <g className="ear-left">
          <path
            d="M67 86 L82 38 L104 88 Z"
            fill="url(#catHeadGradient)"
            stroke="#3b0764"
            strokeWidth="4"
          />
          <path d="M77 78 L83 52 L95 78 Z" fill="#f5d0fe" />
        </g>

        <g className="ear-right">
          <path
            d="M153 86 L138 38 L116 88 Z"
            fill="url(#catHeadGradient)"
            stroke="#3b0764"
            strokeWidth="4"
          />
          <path d="M143 78 L137 52 L125 78 Z" fill="#f5d0fe" />
        </g>

        {/* head */}
        <circle
          cx="110"
          cy="105"
          r="58"
          fill="url(#catHeadGradient)"
          stroke="#3b0764"
          strokeWidth="4"
        />

        {/* soft tiny identical brows */}
        <path
          d="M76 83 Q85 79 94 83"
          fill="none"
          stroke="#4c1d95"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M126 83 Q135 79 144 83"
          fill="none"
          stroke="#4c1d95"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* eyes */}
        <g className="eye-group">
          <ellipse cx="85" cy="105" rx="16" ry="21" fill="#ffffff" />
          <ellipse cx="135" cy="105" rx="16" ry="21" fill="#ffffff" />
        </g>

        <circle
          cx="85"
          cy="108"
          r="7"
          fill="#140022"
          className="pupil"
          style={{ transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)` }}
        />
        <circle
          cx="135"
          cy="108"
          r="7"
          fill="#140022"
          className="pupil"
          style={{ transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)` }}
        />

        <circle cx="81" cy="103" r="2.5" fill="#ffffff" opacity="0.9" />
        <circle cx="131" cy="103" r="2.5" fill="#ffffff" opacity="0.9" />

        {/* cheeks */}
        <ellipse
          cx="74"
          cy="132"
          rx="13"
          ry="7"
          fill="#f9a8d4"
          opacity="0.45"
        />
        <ellipse
          cx="146"
          cy="132"
          rx="13"
          ry="7"
          fill="#f9a8d4"
          opacity="0.45"
        />

        {/* nose */}
        <path d="M104 122 Q110 116 116 122 Q110 127 104 122Z" fill="#f9a8d4" />

        {/* simple mouth */}
        <path
          className="mouth-rest"
          d="M100 132 Q110 141 120 132"
          fill="none"
          stroke="#fff7fb"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* talking mouth */}
        <ellipse
          className="mouth-talk"
          cx="110"
          cy="135"
          rx="6"
          ry="4.5"
          fill="#fff7fb"
          stroke="#f9a8d4"
          strokeWidth="1.5"
        />

        {/* whiskers */}
        <g
          className="whiskers"
          stroke="#f3e8ff"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M90 126 C70 121, 51 121, 35 126" />
          <path d="M90 136 C72 138, 55 145, 42 154" />
          <path d="M130 126 C150 121, 169 121, 185 126" />
          <path d="M130 136 C148 138, 165 145, 178 154" />
        </g>
      </svg>

      <div className="click-hint">comfort the cat ✦</div>
    </div>
  );
}
