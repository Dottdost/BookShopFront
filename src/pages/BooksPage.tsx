import { useState, useEffect } from "react";
import styles from "../styles/BooksPage.module.css";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";
import { Book, Genre } from "../types";
import axios from "axios";

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchBooks = async (page = 1, pageSize = 20) => {
      try {
        const response = await fetch(
          `https://localhost:44308/api/books?page=${page}&pageSize=${pageSize}`
        );
        const data = await response.json();
        setBooks(data.$values ?? data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          "https://localhost:44308/api/genres/all"
        );
        const values = response.data?.$values;
        if (Array.isArray(values)) {
          setGenres(values);
        }
      } catch (error) {
        console.error("Error fetching genres", error);
      }
    };

    fetchBooks();
    fetchGenres();
  }, []);

  const handleGenreChange = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearchQuery =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const genreId = Number(book.genreId);
    const matchesGenres =
      selectedGenres.length === 0 || selectedGenres.includes(genreId);

    return matchesSearchQuery && matchesGenres;
  });

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by title or author"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.genresContainer}>
          <h2 className={styles.filterTitle}>Genres</h2>
          {genres.map((genre) => (
            <label key={genre.id} className={styles.genreLabel}>
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}
                onChange={() => handleGenreChange(genre.id)}
              />
              <span>{genre.name || "Unknown Genre"}</span>
            </label>
          ))}
        </div>
      </aside>

      <main className={styles.booksGrid}>
        {filteredBooks.length === 0 ? (
          <p className={styles.noBooks}>No books available</p>
        ) : (
          filteredBooks.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
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
