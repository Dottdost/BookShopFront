import styles from "../styles/FavoritesPage.module.css";
import { useFavorites } from "../hooks/useFavorites";
import { useCart } from "../hooks/useCart";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import BookCard from "../components/BookCard";
import { Book } from "../types/book";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const FavoritesPage = () => {
  const { t } = useTranslation();
  const { favorites, addFavorite, removeFavorite, isFavorite, isLoaded } =
    useFavorites();
  const { addItem } = useCart();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = (book: Book) => {
    if (!isAuthenticated) {
      toast.error(t("favorites.loginToCart"));
      return;
    }
    addItem(book);
  };

  if (!isLoaded) {
    return <div className={styles.container}>{t("favorites.loading")}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{t("favorites.title")}</h1>
      {favorites.length === 0 ? (
        <p>{t("favorites.empty")}</p>
      ) : (
        <div className={styles.booksGrid}>
          {favorites.map((book) => (
            <div key={book.id}>
              <Link
                to={`/books/${book.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <BookCard
                  book={book}
                  isFavorite={isFavorite(book.id)}
                  onAddFavorite={() => addFavorite(book)}
                  onRemoveFavorite={() => removeFavorite(book.id)}
                  onAddToCart={() => handleAddToCart(book)}
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
