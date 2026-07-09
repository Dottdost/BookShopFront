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
  const [pupilMove, setPupilMove] = useState({ x: 0, y: 0 });

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 0.7;

    window.speechSynthesis.speak(utterance);
  };

  const handleClick = () => {
    const next = (current + 1) % messages.length;
    setCurrent(next);
    speak(messages[next]);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mascot = document.getElementById("cheshire-mystic-cat");
      if (!mascot) return;

      const rect = mascot.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (event.clientX - centerX) / rect.width;
      const y = (event.clientY - centerY) / rect.height;

      const moveX = Math.max(-1.8, Math.min(1.8, x * 5));
      const moveY = Math.max(-1.4, Math.min(1.4, y * 4));

      setPupilMove({ x: moveX, y: moveY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (Math.random() > 0.68) {
        setCurrent((prev) => (prev + 1) % messages.length);
      }
    }, 9000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      id="cheshire-mystic-cat"
      className="cheshireMysticCat"
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
      <div className="cheshireCatDot cheshireCatDotOne" />
      <div className="cheshireCatDot cheshireCatDotTwo" />

      <div className="cheshireCatBubble">{messages[current]}</div>

      <svg
        className="cheshireCatSvg"
        viewBox="0 0 180 210"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="cheshireCatFur" cx="50%" cy="36%" r="70%">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="52%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6d28d9" />
          </radialGradient>

          <linearGradient
            id="cheshireCatBody"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        <path
          className="cheshireCatTail"
          d="M119 138 C151 141, 159 176, 135 184 C119 190, 103 176, 115 164"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="14"
          strokeLinecap="round"
        />

        <ellipse
          cx="90"
          cy="151"
          rx="36"
          ry="42"
          fill="url(#cheshireCatBody)"
        />
        <ellipse
          cx="90"
          cy="158"
          rx="18"
          ry="24"
          fill="#c4b5fd"
          opacity="0.38"
        />

        <ellipse cx="68" cy="190" rx="13" ry="8" fill="#6d28d9" />
        <ellipse cx="112" cy="190" rx="13" ry="8" fill="#6d28d9" />

        <g className="cheshireCatEarLeft">
          <path
            d="M56 70 L68 31 L86 71 Z"
            fill="url(#cheshireCatFur)"
            stroke="#3b0764"
            strokeWidth="3"
          />
          <path d="M64 63 L69 43 L79 63 Z" fill="#f5d0fe" />
        </g>

        <g className="cheshireCatEarRight">
          <path
            d="M124 70 L112 31 L94 71 Z"
            fill="url(#cheshireCatFur)"
            stroke="#3b0764"
            strokeWidth="3"
          />
          <path d="M116 63 L111 43 L101 63 Z" fill="#f5d0fe" />
        </g>

        <circle
          cx="90"
          cy="85"
          r="47"
          fill="url(#cheshireCatFur)"
          stroke="#3b0764"
          strokeWidth="3"
        />

        {/* ОДИНАКОВЫЕ мягкие брови */}
        <path
          d="M60 70 Q70 63 80 70"
          fill="none"
          stroke="#7e22ce"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M100 70 Q110 63 120 70"
          fill="none"
          stroke="#7e22ce"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity="0.9"
        />

        <g className="cheshireCatEyes">
          <ellipse cx="70" cy="87" rx="11" ry="15" fill="#ffffff" />
          <ellipse cx="110" cy="87" rx="11" ry="15" fill="#ffffff" />
        </g>

        <circle
          className="cheshireCatPupil"
          cx="70"
          cy="89"
          r="5"
          fill="#140022"
          style={{ transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)` }}
        />
        <circle
          className="cheshireCatPupil"
          cx="110"
          cy="89"
          r="5"
          fill="#140022"
          style={{ transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)` }}
        />

        <circle cx="67" cy="84" r="2" fill="#ffffff" opacity="0.9" />
        <circle cx="107" cy="84" r="2" fill="#ffffff" opacity="0.9" />

        <ellipse
          cx="59"
          cy="108"
          rx="10"
          ry="5"
          fill="#f9a8d4"
          opacity="0.42"
        />
        <ellipse
          cx="121"
          cy="108"
          rx="10"
          ry="5"
          fill="#f9a8d4"
          opacity="0.42"
        />

        <path d="M85 101 Q90 96 95 101 Q90 106 85 101Z" fill="#f9a8d4" />

        {/* ОДИН статичный рот, без падающей улыбки */}
        <path
          className="cheshireCatMouthRest"
          d="M82 113 Q90 118 98 113"
          fill="none"
          stroke="#fff7fb"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <g
          className="cheshireCatWhiskers"
          stroke="#f3e8ff"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M76 104 C59 100, 44 100, 30 104" />
          <path d="M76 112 C60 114, 46 119, 34 126" />
          <path d="M104 104 C121 100, 136 100, 150 104" />
          <path d="M104 112 C120 114, 134 119, 146 126" />
        </g>
      </svg>

      <div className="cheshireCatHint">comfort the cat ✦</div>
    </div>
  );
}
