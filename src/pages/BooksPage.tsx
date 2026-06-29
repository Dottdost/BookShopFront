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

const BooksPage: React.FC = () => {
  const { t } = useTranslation();

  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [openGenreId, setOpenGenreId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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
    </main>
  );
};

export default BooksPage;
