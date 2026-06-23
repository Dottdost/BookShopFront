import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Book } from "../types/book";
import styles from "../styles/BookDetails.module.css";
import { useFavorites } from "../hooks/useFavorites";
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const BookDetails = () => {
  const { t } = useTranslation();
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
        toast.error(t("details.failedLoad"));
      }
    };
    fetchBook();
  }, [id, t]);

  const handleAddToCart = () => {
    if (!book) return;
    addItem(book);
    toast.success(t("details.addedToCart", { title: book.title }), {
      position: "bottom-left",
      autoClose: 3000,
    });
  };

  const handleToggleFavorite = () => {
    if (!book) return;

    if (isFavorite(book.id)) {
      removeFavorite(book.id);
      toast.info(t("details.removedFromFavorites", { title: book.title }), {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      addFavorite(book);
      toast.success(t("details.addedToFavorites", { title: book.title }), {
        position: "bottom-left",
        autoClose: 3000,
      });
    }
  };

  if (!book) return <div>{t("common.loading")}</div>;

  const imageSrc =
    typeof book.imageUrl === "string" && book.imageUrl.length > 0
      ? book.imageUrl
      : "/book-placeholder.jpg";

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.leftSide}>
        <img src={imageSrc} alt={book.title} className={styles.image} />
        <p className={styles.stock}>{t("details.stockCount", { count: book.stock })}</p>
      </div>
      <div className={styles.rightSide}>
        <h2>{book.title}</h2>
        <p>
          <strong>{t("details.author")}:</strong> {book.author}
        </p>
        <p>
          <strong>{t("details.description")}:</strong> {book.description}
        </p>
        <div className={styles.buttons}>
          <button onClick={handleToggleFavorite}>
            {isFavorite(book.id)
              ? t("details.removeFromFavorites")
              : t("details.addToFavorites")}
          </button>
          <button onClick={handleAddToCart}>🛒 {t("details.addToCart")}</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
