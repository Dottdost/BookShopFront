import styles from "../styles/BookCard.module.css";
import { Book } from "../types/book";

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  onAddFavorite: () => void;
  onRemoveFavorite: () => void;
  onOrder: () => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  isFavorite,
  onAddFavorite,
  onRemoveFavorite,
  onOrder,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={book.imageUrl || "/book-placeholder.jpg"}
          alt={book.title}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
        <p className={styles.price}>${book.price.toFixed(2)}</p>
        {book.stock > 0 ? (
          <p className={styles.inStock}>In Stock: {book.stock}</p>
        ) : (
          <p className={styles.outOfStock}>Out of Stock</p>
        )}
      </div>
      <div className={styles.actions}>
        <button
          className={styles.orderButton}
          onClick={onOrder}
          disabled={book.stock <= 0}
        >
          {book.stock > 0 ? "Order Now" : "Not Available"}
        </button>
        {isFavorite ? (
          <button
            className={styles.favoriteButtonActive}
            onClick={onRemoveFavorite}
            title="Remove from favorites"
          >
            ♥
          </button>
        ) : (
          <button
            className={styles.favoriteButton}
            onClick={onAddFavorite}
            title="Add to favorites"
          >
            ♡
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
