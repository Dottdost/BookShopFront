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
      </div>
      <div className={styles.info}>
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
        <p className={styles.price}>${book.price.toFixed(2)}</p>
        {isOutOfStock ? (
          <p className={styles.outOfStock}>Out of Stock</p>
        ) : (
          <p className={styles.inStock}>In Stock: {book.stock}</p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
