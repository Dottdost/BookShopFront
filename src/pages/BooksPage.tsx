import React, { useState, useEffect, useMemo } from "react";
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

  const filtered = books.filter((book) => {
    const q = searchQuery.trim().toLowerCase();

    const title = book.title?.toLowerCase() ?? "";
    const author = book.author?.toLowerCase() ?? "";

    const matchesText = !q || title.includes(q) || author.includes(q);

    const bookGenreId = Number(book.genreId);

    const matchesGenre =
      selectedGenreIds === null || selectedGenreIds.includes(bookGenreId);

    return matchesText && matchesGenre;
  });

  const applySearch = (q: string) => {
    const params = new URLSearchParams(location.search);

    if (q.trim()) {
      params.set("search", q.trim());
    } else {
      params.delete("search");
    }

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

    const queryString = params.toString();

    navigate(queryString ? `/books?${queryString}` : "/books", {
      replace: true,
    });
  };

  const selectedGenreLabel =
    selectedGenre === null
      ? "All genres"
      : genreOptions.find((genre) => genre.id === selectedGenre)?.label ||
        "Selected genre";

  const foundText =
    filtered.length === 1 ? "1 book found" : `${filtered.length} books found`;

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
