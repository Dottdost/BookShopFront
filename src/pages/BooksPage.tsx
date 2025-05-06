import { useState, useEffect } from "react";
import styles from "../styles/BooksPage.module.css";
import { useFavorites } from "../hooks/useFavorites";
import { useOrders } from "../hooks/useOrders";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";
import { Book, Genre } from "../types";
import { Order, OrderItem, OrderStatus } from "../types/order";
import axios from "axios";

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { placeOrder } = useOrders();

  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://localhost:44308/api/books");
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

  const handleOrder = (book: Book) => {
    if (!isAuthenticated || !user) {
      alert("Please login to place an order");
      return;
    }

    const orderItem: OrderItem = {
      id: Date.now().toString(),
      bookId: book.id,
      quantity: 1,
      price: book.price,
      title: book.title,
      imageUrl: book.imageUrl,
    };

    const order: Order = {
      id: Date.now().toString(),
      userId: user.id,
      items: [orderItem],
      totalPrice: book.price,
      createdAt: new Date().toISOString(),
      status: OrderStatus.Pending,
    };

    placeOrder(order);
    alert(`Order placed for ${book.title}!`);
  };

  const handleGenreChange = (genreId: number) => {
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genreId)
        ? prevSelectedGenres.filter((id) => id !== genreId)
        : [...prevSelectedGenres, genreId]
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
    <div className={styles.container}>
      <h1>Our Books</h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.genresFilter}>
        <div className={styles.sidePanel}>
          {genres.map((genre) => (
            <label key={genre.id} className={styles.genreLabel}>
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}
                onChange={() => handleGenreChange(genre.id)}
              />
              {genre.name || "Unknown Genre"}
            </label>
          ))}
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <p className={styles.noBooks}>No books available</p>
      ) : (
        <div className={styles.booksGrid}>
          {filteredBooks.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <BookCard
                book={book}
                isFavorite={isFavorite(book.id)}
                onAddFavorite={() => addFavorite(book)}
                onRemoveFavorite={() => removeFavorite(book.id)}
                onOrder={() => handleOrder(book)}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
