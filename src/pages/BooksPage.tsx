import { useState, useEffect } from "react";
import styles from "../styles/BooksPage.module.css";
import { useFavorites } from "../hooks/useFavorites";
import { useOrders } from "../hooks/useOrders";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import BookCard from "../components/BookCard";
import { Book, OrderItem, Order, OrderStatus } from "../types";

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { placeOrder } = useOrders();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://localhost:44308/api/books");
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
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
      status: OrderStatus.Pending,
      createdAt: new Date().toISOString(),
    };

    placeOrder(order);
    alert(`Order placed for ${book.title}!`);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>Our Books</h1>
      {books.length === 0 && !loading ? (
        <p className={styles.noBooks}>No books available</p>
      ) : (
        <div className={styles.booksGrid}>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isFavorite={isFavorite(book.id)}
              onAddFavorite={() => addFavorite(book)}
              onRemoveFavorite={() => removeFavorite(book.id)}
              onOrder={() => handleOrder(book)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
