import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../styles/BooksPage.module.css";
import BookCard from "../components/BookCard";
import { Book, Genre } from "../types";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";

type GenreTree = Genre & { subgenres: Genre[] };

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
    setSelectedGenre(g ? +g : null);
  }, [location.search]);

  useEffect(() => {
    (async () => {
      try {
        const [booksRes, genresRes] = await Promise.all([
          fetch("https://localhost:44308/api/books?page=1&pageSize=50"),
          axios.get("https://localhost:44308/api/genres/all"),
        ]);
        const bData = await booksRes.json();
        setBooks(bData.$values ?? bData);

        const gData: Genre[] = genresRes.data.$values;
        setGenres(gData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const genreTree: GenreTree[] = genres
    .filter((g) => !g.parentGenreId)
    .map((root) => ({
      ...root,
      subgenres: genres.filter((g) => g.parentGenreId === root.id),
    }));

  const filtered = books.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesText =
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    const matchesGenre = selectedGenre === null || +b.genreId === selectedGenre;
    return matchesText && matchesGenre;
  });

  const applySearch = (q: string) => {
    const params = new URLSearchParams(location.search);
    if (q) params.set("search", q);
    else params.delete("search");
    navigate(`/books?${params.toString()}`, { replace: true });
  };
  const applyGenre = (gId: number | null) => {
    const params = new URLSearchParams(location.search);
    if (gId !== null) params.set("genre", String(gId));
    else params.delete("genre");
    navigate(`/books?${params.toString()}`, { replace: true });
  };
  const toggleGenreMenu = (id: number) =>
    setOpenGenreId(openGenreId === id ? null : id);

  if (loading) {
    return <div className={styles.loading}>{t("common.loading")}</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder={t("books.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch(searchQuery)}
          className={styles.searchInput}
        />
        <button
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
          {genreTree.map((g) => (
            <li
              key={g.id}
              className={`${styles.genreItem} ${
                selectedGenre === g.id ? styles.active : ""
              }`}
            >
              <div
                className={styles.genreTitle}
                onClick={() => {
                  applyGenre(g.id);
                  toggleGenreMenu(g.id);
                }}
              >
                <span>{g.name}</span>
                {g.subgenres.length > 0 && (
                  <span
                    className={`${styles.arrow} ${
                      openGenreId === g.id ? styles.open : ""
                    }`}
                  />
                )}
              </div>
              {g.subgenres.length > 0 && openGenreId === g.id && (
                <ul className={styles.subMenu}>
                  {g.subgenres.map((s) => (
                    <li
                      key={s.id}
                      className={`${styles.subItem} ${
                        selectedGenre === s.id ? styles.active : ""
                      }`}
                      onClick={() => applyGenre(s.id)}
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <main className={styles.booksGrid}>
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
      </main>
    </div>
  );
};

export default BooksPage;
