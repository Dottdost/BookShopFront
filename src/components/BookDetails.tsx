import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Book, OrderStatus } from "../types";
import styles from "../styles/BookDetails.module.css";
import { useFavorites } from "../hooks/useFavorites";
import { useOrders } from "../hooks/useOrders";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { placeOrder } = useOrders();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`https://localhost:44308/api/books/${id}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated || !user || !book) {
      alert("Please login to place an order");
      return;
    }
    placeOrder({
      id: Date.now().toString(),
      userId: user.id,
      items: [
        {
          id: Date.now().toString(),
          bookId: book.id,
          quantity: 1,
          price: book.price,
          title: book.title,
          imageUrl: book.imageUrl,
        },
      ],
      totalPrice: book.price,
      status: OrderStatus.Pending,
      createdAt: new Date().toISOString(),
    });
    alert(`Added ${book.title} to cart!`);
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.leftSide}>
        <img src={book.imageUrl} alt={book.title} className={styles.image} />
        <p className={styles.stock}>In stock: {book.stock}</p>
      </div>
      <div className={styles.rightSide}>
        <h2>{book.title}</h2>
        <p>
          <strong>Author:</strong> {book.author}
        </p>
        <p>
          <strong>Description:</strong> {book.description}
        </p>
        <div className={styles.buttons}>
          {isFavorite(book.id) ? (
            <button onClick={() => removeFavorite(book.id)}>
              ♥ Remove from favorites
            </button>
          ) : (
            <button onClick={() => addFavorite(book)}>
              ♡ Add to favorites
            </button>
          )}
          <button onClick={handleAddToCart}>🛒 Add to cart</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
