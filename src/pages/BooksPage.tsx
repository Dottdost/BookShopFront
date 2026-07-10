import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../styles/BooksPage.module.css";
import BookCard from "../components/BookCard";
import { Book, Genre } from "../types";
import { FiBookOpen, FiChevronDown, FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";

type GenreTree = Genre & { subgenres: Genre[] };

type ValuesResponse<T> = {
  $values?: T[];
};

type GenreOption = {
  id: number;
  label: string;
};

type PaginationStyles = Record<string, React.CSSProperties>;

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://cheshireshelfapp-env.eba-pzcyg6yq.eu-north-1.elasticbeanstalk.com";

const BOOKS_PER_PAGE = 10;

const paginationStyles: PaginationStyles = {
  wrapper: {
    width: "min(1220px, 100%)",
    margin: "2rem auto 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.65rem",
    flexWrap: "wrap",
  },
  button: {
    minWidth: "44px",
    height: "44px",
    padding: "0 0.95rem",
    borderRadius: "999px",
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
    cursor: "pointer",
    fontWeight: 900,
    boxShadow: "var(--shadow)",
    transition:
      "transform 0.2s ease, border-color 0.2s ease, background 0.2s ease",
  },
  activeButton: {
    minWidth: "44px",
    height: "44px",
    padding: "0 0.95rem",
    borderRadius: "999px",
    border: "1px solid transparent",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 1000,
    boxShadow: "var(--shadow-purple)",
  },
  disabledButton: {
    minWidth: "44px",
    height: "44px",
    padding: "0 0.95rem",
    borderRadius: "999px",
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text3)",
    cursor: "not-allowed",
    fontWeight: 900,
    opacity: 0.55,
  },
  dots: {
    minWidth: "32px",
    textAlign: "center",
    color: "var(--text3)",
    fontWeight: 900,
  },
  info: {
    width: "100%",
    marginTop: "0.4rem",
    textAlign: "center",
    color: "var(--text3)",
    fontSize: "0.9rem",
    fontWeight: 800,
  },
};

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

const clampPage = (value: number, totalPages: number) => {
  if (!Number.isFinite(value) || value < 1) return 1;
  if (value > totalPages) return totalPages;

  return value;
};

const createVisiblePages = (currentPage: number, totalPages: number) => {
  const pages: Array<number | "dots"> = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  pages.push(1);

  if (currentPage > 4) {
    pages.push("dots");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 3) {
    pages.push("dots");
  }

  pages.push(totalPages);

  return pages;
};

const BooksPage: React.FC = () => {
  const { t } = useTranslation();

  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);
  const [catLeaving, setCatLeaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const leaveTimer = useRef<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const q = params.get("search") || "";
    const g = params.get("genre");
    const p = Number(params.get("page") || "1");

    setSearchQuery(q);
    setSelectedGenre(g ? Number(g) : null);
    setCurrentPage(Number.isFinite(p) && p > 0 ? p : 1);
  }, [location.search]);

  useEffect(() => {
    return () => {
      if (leaveTimer.current) {
        window.clearTimeout(leaveTimer.current);
      }
    };
  }, []);

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

        const booksData = unwrapArray<Book>(response.data);

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

  const genreTree: GenreTree[] = useMemo(
    () =>
      genres
        .filter((genre) => !genre.parentGenreId)
        .map((root) => ({
          ...root,
          subgenres: genres.filter((genre) => genre.parentGenreId === root.id),
        })),
    [genres],
  );

  const genreOptions: GenreOption[] = useMemo(() => {
    const options: GenreOption[] = [];

    genreTree.forEach((genre) => {
      options.push({
        id: genre.id,
        label: genre.name,
      });

      genre.subgenres.forEach((subgenre) => {
        options.push({
          id: subgenre.id,
          label: `${genre.name} — ${subgenre.name}`,
        });
      });
    });

    return options;
  }, [genreTree]);

  const selectedGenreIds = useMemo(() => {
    if (selectedGenre === null) {
      return null;
    }

    const selectedParent = genreTree.find(
      (genre) => genre.id === selectedGenre,
    );

    if (selectedParent) {
      return [
        selectedParent.id,
        ...selectedParent.subgenres.map((subgenre) => subgenre.id),
      ];
    }

    return [selectedGenre];
  }, [selectedGenre, genreTree]);

  const filtered = useMemo(
    () =>
      books.filter((book) => {
        const q = searchQuery.trim().toLowerCase();

        const title = book.title?.toLowerCase() ?? "";
        const author = book.author?.toLowerCase() ?? "";

        const matchesText = !q || title.includes(q) || author.includes(q);

        const bookGenreId = Number(book.genreId);

        const matchesGenre =
          selectedGenreIds === null || selectedGenreIds.includes(bookGenreId);

        return matchesText && matchesGenre;
      }),
    [books, searchQuery, selectedGenreIds],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / BOOKS_PER_PAGE));
  const safeCurrentPage = clampPage(currentPage, totalPages);
  const paginatedBooks = filtered.slice(
    (safeCurrentPage - 1) * BOOKS_PER_PAGE,
    safeCurrentPage * BOOKS_PER_PAGE,
  );
  const visiblePages = createVisiblePages(safeCurrentPage, totalPages);

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      const params = new URLSearchParams(location.search);

      if (safeCurrentPage > 1) {
        params.set("page", String(safeCurrentPage));
      } else {
        params.delete("page");
      }

      const queryString = params.toString();

      navigate(queryString ? `/books?${queryString}` : "/books", {
        replace: true,
      });
    }
  }, [currentPage, safeCurrentPage, location.search, navigate]);

  const goToPage = (page: number) => {
    const nextPage = clampPage(page, totalPages);
    const params = new URLSearchParams(location.search);

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    } else {
      params.delete("page");
    }

    const queryString = params.toString();

    navigate(queryString ? `/books?${queryString}` : "/books", {
      replace: true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applySearch = (q: string) => {
    const params = new URLSearchParams(location.search);

    if (q.trim()) {
      params.set("search", q.trim());
    } else {
      params.delete("search");
    }

    params.delete("page");

    const queryString = params.toString();

    navigate(queryString ? `/books?${queryString}` : "/books", {
      replace: true,
    });
  };

  const applyGenre = (genreId: number | null) => {
    const params = new URLSearchParams(location.search);

    if (genreId !== null) {
      params.set("genre", String(genreId));
    } else {
      params.delete("genre");
    }

    params.delete("page");

    const queryString = params.toString();

    navigate(queryString ? `/books?${queryString}` : "/books", {
      replace: true,
    });
  };

  const handleSearchFocus = () => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }

    setCatLeaving(false);
    setSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);

    if (!searchQuery.trim()) {
      setCatLeaving(true);

      leaveTimer.current = window.setTimeout(() => {
        setCatLeaving(false);
      }, 1700);
    }
  };

  const selectedGenreLabel =
    selectedGenre === null
      ? "All genres"
      : genreOptions.find((genre) => genre.id === selectedGenre)?.label ||
        "Selected genre";

  const foundText =
    filtered.length === 1 ? "1 book found" : `${filtered.length} books found`;

  const searchHasText = searchQuery.trim().length > 0;
  const catIsActive = searchFocused || searchHasText;
  const firstVisibleBook =
    filtered.length === 0 ? 0 : (safeCurrentPage - 1) * BOOKS_PER_PAGE + 1;
  const lastVisibleBook = Math.min(
    safeCurrentPage * BOOKS_PER_PAGE,
    filtered.length,
  );

  if (loading) {
    return <div className={styles.loading}>{t("common.loading")}</div>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.searchBar}>
        <div
          className={`${styles.searchCat} ${
            catIsActive ? styles.searchCatActive : ""
          } ${searchHasText ? styles.searchCatWatching : ""} ${
            catLeaving ? styles.searchCatLeaving : ""
          }`}
          aria-hidden="true"
        >
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
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onChange={(event) => {
            const value = event.target.value;

            setSearchQuery(value);

            const params = new URLSearchParams(location.search);

            if (value.trim()) {
              params.set("search", value.trim());
            } else {
              params.delete("search");
            }

            params.delete("page");

            const queryString = params.toString();

            navigate(queryString ? `/books?${queryString}` : "/books", {
              replace: true,
            });
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

      <section className={styles.genreFilterCard}>
        <div className={styles.genreFilterGlow} />

        <div className={styles.genreFilterLeft}>
          <div className={styles.genreFilterIcon}>
            <FiBookOpen />
          </div>

          <div className={styles.genreFilterText}>
            <span className={styles.genreFilterLabel}>Explore by genre</span>

            <h3 className={styles.genreFilterTitle}>{selectedGenreLabel}</h3>

            <p className={styles.genreFilterHint}>
              Choose a category and discover books that match your mood.
            </p>
          </div>
        </div>

        <div className={styles.genreFilterRight}>
          <div className={styles.genreCountPill}>{foundText}</div>

          <div className={styles.genreSelectWrap}>
            <span className={styles.genreSelectLabel}>Selected category</span>

            <div className={styles.genreSelectBox}>
              <select
                value={selectedGenre ?? ""}
                onChange={(event) => {
                  const value = event.target.value;

                  applyGenre(value ? Number(value) : null);
                }}
                className={styles.genreSelect}
              >
                <option value="">All genres</option>

                {genreOptions.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.label}
                  </option>
                ))}
              </select>

              <FiChevronDown className={styles.genreSelectIcon} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.booksGrid}>
        {filtered.length === 0 ? (
          <p className={styles.noBooks}>{t("books.noBooks")}</p>
        ) : (
          paginatedBooks.map((book) => (
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

      {filtered.length > BOOKS_PER_PAGE && (
        <nav aria-label="Books pagination" style={paginationStyles.wrapper}>
          <button
            type="button"
            style={
              safeCurrentPage === 1
                ? paginationStyles.disabledButton
                : paginationStyles.button
            }
            disabled={safeCurrentPage === 1}
            onClick={() => goToPage(safeCurrentPage - 1)}
          >
            {t("common.prev")}
          </button>

          {visiblePages.map((page, index) =>
            page === "dots" ? (
              <span key={`dots-${index}`} style={paginationStyles.dots}>
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                style={
                  page === safeCurrentPage
                    ? paginationStyles.activeButton
                    : paginationStyles.button
                }
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            style={
              safeCurrentPage === totalPages
                ? paginationStyles.disabledButton
                : paginationStyles.button
            }
            disabled={safeCurrentPage === totalPages}
            onClick={() => goToPage(safeCurrentPage + 1)}
          >
            {t("common.next")}
          </button>

          <div style={paginationStyles.info}>
            Showing {firstVisibleBook}-{lastVisibleBook} of {filtered.length}{" "}
            books
          </div>
        </nav>
      )}
    </main>
  );
};

export default BooksPage;
