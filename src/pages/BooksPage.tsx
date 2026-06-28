import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../styles/BooksPage.module.css";
import BookCard from "../components/BookCard";
import { Book, Genre } from "../types";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";

type GenreTree = Genre & { subgenres: Genre[] };

type ValuesResponse<T> = {
  $values?: T[];
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://cheshireshelfapp-env.eba-pzcyg6yq.eu-north-1.elasticbeanstalk.com";

const unwrapArray = <T,>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const objectData = data as Record<string, unknown>;

  if (Array.isArray(objectData.$values)) {
    return objectData.$values as T[];
  }

  if (Array.isArray(objectData.items)) {
    return objectData.items as T[];
  }

  if (
    objectData.items &&
    typeof objectData.items === "object" &&
    Array.isArray((objectData.items as ValuesResponse<T>).$values)
  ) {
    return (objectData.items as ValuesResponse<T>).$values ?? [];
  }

  if (Array.isArray(objectData.data)) {
    return objectData.data as T[];
  }

  if (
    objectData.data &&
    typeof objectData.data === "object" &&
    Array.isArray((objectData.data as ValuesResponse<T>).$values)
  ) {
    return (objectData.data as ValuesResponse<T>).$values ?? [];
  }

  return [];
};

const mascotMessages = [
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

const BooksPage: React.FC = () => {
  const { t } = useTranslation();

  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [openGenreId, setOpenGenreId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [mascotMessageIndex, setMascotMessageIndex] = useState(0);
  const [mascotTalking, setMascotTalking] = useState(false);
  const [pupilMove, setPupilMove] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const q = params.get("search") || "";
    const g = params.get("genre");

    setSearchQuery(q);
    setSelectedGenre(g ? Number(g) : null);
  }, [location.search]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API_BASE_URL}/api/books`, {
          params: {
            page: 1,
            pageSize: 100,
          },
          headers: {
            Accept: "text/plain",
          },
        });

        console.log("BOOKS RESPONSE:", response.data);

        const booksData = unwrapArray<Book>(response.data);

        console.log("BOOKS NORMALIZED:", booksData);

        setBooks(booksData);
      } catch (error) {
        console.error("Error loading books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/genres/all`, {
          headers: {
            Accept: "text/plain",
          },
        });

        console.log("GENRES RESPONSE:", response.data);

        const genresData = unwrapArray<Genre>(response.data);

        setGenres(genresData);
      } catch (error) {
        console.error("Error loading genres:", error);
        setGenres([]);
      }
    };

    void fetchBooks();
    void fetchGenres();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mascot = document.getElementById("cheshire-mascot");
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
    const interval = window.setInterval(() => {
      if (Math.random() > 0.55) {
        setMascotMessageIndex((current) => {
          return (current + 1) % mascotMessages.length;
        });
      }
    }, 8500);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const genreTree: GenreTree[] = genres
    .filter((genre) => !genre.parentGenreId)
    .map((root) => ({
      ...root,
      subgenres: genres.filter((genre) => genre.parentGenreId === root.id),
    }));

  const filtered = books.filter((book) => {
    const q = searchQuery.trim().toLowerCase();

    const title = book.title?.toLowerCase() ?? "";
    const author = book.author?.toLowerCase() ?? "";

    const matchesText = !q || title.includes(q) || author.includes(q);

    const matchesGenre =
      selectedGenre === null || Number(book.genreId) === selectedGenre;

    return matchesText && matchesGenre;
  });

  const applySearch = (q: string) => {
    const params = new URLSearchParams(location.search);

    if (q.trim()) {
      params.set("search", q.trim());
    } else {
      params.delete("search");
    }

    navigate(`/books?${params.toString()}`, { replace: true });
  };

  const applyGenre = (genreId: number | null) => {
    const params = new URLSearchParams(location.search);

    if (genreId !== null) {
      params.set("genre", String(genreId));
    } else {
      params.delete("genre");
    }

    navigate(`/books?${params.toString()}`, { replace: true });
  };

  const toggleGenreMenu = (id: number) => {
    setOpenGenreId((current) => (current === id ? null : id));
  };

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

  const handleMascotClick = () => {
    const nextMessageIndex = (mascotMessageIndex + 1) % mascotMessages.length;

    setMascotMessageIndex(nextMessageIndex);
    setMascotTalking(true);
    speak(mascotMessages[nextMessageIndex]);

    window.setTimeout(() => {
      setMascotTalking(false);
    }, 650);
  };

  if (loading) {
    return <div className={styles.loading}>{t("common.loading")}</div>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.searchBar}>
        <div className={styles.searchCat} aria-hidden="true">
          <div className={styles.searchCatTrail}>
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className={styles.searchCatTail} />

          <div className={styles.searchCatBody}>
            <span className={styles.searchCatStripeOne} />
            <span className={styles.searchCatStripeTwo} />
          </div>

          <div className={styles.searchCatHead}>
            <span className={styles.searchCatEarLeft} />
            <span className={styles.searchCatEarRight} />
            <span className={styles.searchCatEyeLeft} />
            <span className={styles.searchCatEyeRight} />
            <span className={styles.searchCatSmile} />
          </div>

          <span className={styles.searchCatPawOne} />
          <span className={styles.searchCatPawTwo} />
          <span className={styles.searchCatPawThree} />
          <span className={styles.searchCatPawFour} />
        </div>

        <input
          type="text"
          placeholder={t("books.searchPlaceholder")}
          value={searchQuery}
          onChange={(event) => {
            const value = event.target.value;
            setSearchQuery(value);

            const params = new URLSearchParams(location.search);

            if (value.trim()) {
              params.set("search", value.trim());
            } else {
              params.delete("search");
            }

            navigate(`/books?${params.toString()}`, { replace: true });
          }}
          className={styles.searchInput}
        />

        <button
          type="button"
          className={styles.searchBtn}
          onClick={() => applySearch(searchQuery)}
        >
          <FiSearch />
        </button>
      </div>

      <nav className={styles.genreNav}>
        <ul>
          <li
            className={`${styles.genreItem} ${
              selectedGenre === null ? styles.active : ""
            }`}
            onClick={() => {
              applyGenre(null);
              setOpenGenreId(null);
            }}
          >
            <span>{t("books.all")}</span>
          </li>

          {genreTree.map((genre) => (
            <li
              key={genre.id}
              className={`${styles.genreItem} ${
                selectedGenre === genre.id ? styles.active : ""
              }`}
            >
              <div
                className={styles.genreTitle}
                onClick={() => {
                  applyGenre(genre.id);
                  toggleGenreMenu(genre.id);
                }}
              >
                <span>{genre.name}</span>

                {genre.subgenres.length > 0 && (
                  <span
                    className={`${styles.arrow} ${
                      openGenreId === genre.id ? styles.open : ""
                    }`}
                  />
                )}
              </div>

              {genre.subgenres.length > 0 && openGenreId === genre.id && (
                <ul className={styles.subMenu}>
                  {genre.subgenres.map((subgenre) => (
                    <li
                      key={subgenre.id}
                      className={`${styles.subItem} ${
                        selectedGenre === subgenre.id ? styles.active : ""
                      }`}
                      onClick={() => applyGenre(subgenre.id)}
                    >
                      {subgenre.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <section className={styles.booksGrid}>
        {filtered.length === 0 ? (
          <p className={styles.noBooks}>{t("books.noBooks")}</p>
        ) : (
          filtered.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className={styles.cardLink}
            >
              <BookCard book={book} />
            </Link>
          ))
        )}
      </section>

      <div
        id="cheshire-mascot"
        className={`${styles.mascotContainer} ${
          mascotTalking ? styles.talking : ""
        }`}
        onClick={handleMascotClick}
      >
        <div className={`${styles.magicOrb} ${styles.orbOne}`} />
        <div className={`${styles.magicOrb} ${styles.orbTwo}`} />
        <div className={`${styles.magicOrb} ${styles.orbThree}`} />

        <div className={styles.speechBubble}>
          {mascotMessages[mascotMessageIndex]}
        </div>

        <svg
          className={styles.catSvg}
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

          <g className={styles.tail}>
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

          <g className={styles.leftEar}>
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

          <g className={styles.rightEar}>
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

          <g className={styles.eye}>
            <ellipse cx="84" cy="86" rx="15" ry="23" fill="#f8f2ff" />
            <ellipse cx="136" cy="86" rx="15" ry="23" fill="#f8f2ff" />
          </g>

          <circle
            className={styles.pupil}
            cx="84"
            cy="86"
            r="7"
            fill="#170027"
            style={{
              transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)`,
            }}
          />
          <circle
            className={styles.pupil}
            cx="136"
            cy="86"
            r="7"
            fill="#170027"
            style={{
              transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)`,
            }}
          />

          <circle cx="80" cy="80" r="3" fill="#ffffff" opacity="0.9" />
          <circle cx="132" cy="80" r="3" fill="#ffffff" opacity="0.9" />

          <path d="M105 101 Q110 96 115 101 Q110 108 105 101Z" fill="#ff8df4" />

          <path
            className={styles.smile}
            d="M66 118 C85 146, 135 146, 154 118"
            fill="none"
            stroke="#ff65f2"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#softGlow)"
          />

          <path
            className={styles.mouthSmall}
            d="M97 126 C105 134, 116 134, 124 126"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />

          <g
            className={styles.whiskers}
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

        <div className={styles.clickHint}>click the cat ✦</div>
      </div>
    </main>
  );
};

export default BooksPage;
