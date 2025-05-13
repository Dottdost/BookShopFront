import styles from "../styles/BookCard.module.css";
import { Book } from "../types/book";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const isOutOfStock = book.stock === 0;

  return (
    <div
      className={`${styles.card} ${isOutOfStock ? styles.outOfStockCard : ""}`}
    >
      <div className={styles.imageContainer}>
        {isOutOfStock && (
          <div className={styles.outOfStockBadge}>Out of Stock</div>
        )}
        <img
          src={book.imageUrl || "/book-placeholder.jpg"}
          alt={book.title}
          className={styles.image}
        />
        <div className={styles.overlay}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.price}>${book.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
