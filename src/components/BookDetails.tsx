import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Book } from "../types/book";
import styles from "../styles/BookDetails.module.css";
import { useFavorites } from "../hooks/useFavorites";
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addItem } = useCart();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`https://localhost:44308/api/books/${id}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
        toast.error("Failed to load book details");
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;
    addItem(book);
    toast.success(`"${book.title}" added to cart!`, {
      position: "bottom-left",
      autoClose: 3000,
    });
  };

  const handleToggleFavorite = () => {
    if (!book) return;

    if (isFavorite(book.id)) {
      removeFavorite(book.id);
      toast.info(`"${book.title}" removed from favorites`, {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      addFavorite(book);
      toast.success(`"${book.title}" added to favorites`, {
        position: "bottom-left",
        autoClose: 3000,
      });
    }
  };

  if (!book) return <div>Loading...</div>;

  const imageSrc =
    typeof book.imageUrl === "string" && book.imageUrl.length > 0
      ? book.imageUrl
      : "/book-placeholder.jpg";

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.leftSide}>
        <img src={imageSrc} alt={book.title} className={styles.image} />
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
          <button onClick={handleToggleFavorite}>
            {isFavorite(book.id)
              ? "♥ Remove from favorites"
              : "♡ Add to favorites"}
          </button>
          <button onClick={handleAddToCart}>🛒 Add to cart</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
