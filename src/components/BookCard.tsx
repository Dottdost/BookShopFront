import { Book } from "../types/book";
import styles from "../styles/BookCard.module.css";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const isOutOfStock = book.stock === 0;

  const imageSrc =
    book.imageUrl &&
    typeof book.imageUrl === "string" &&
    book.imageUrl.length > 0
      ? book.imageUrl
      : "/book-placeholder.jpg";

  return (
    <div
      className={`${styles.card} ${isOutOfStock ? styles.outOfStockCard : ""}`}
    >
      <div className={styles.imageContainer}>
        {isOutOfStock && (
          <div className={styles.outOfStockBadge}>Out of Stock</div>
        )}
        <img src={imageSrc} alt={book.title} className={styles.image} />
        <div className={styles.overlay}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.price}>${book.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
