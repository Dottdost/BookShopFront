import styles from "../styles/FavoritesPage.module.css";
import { useFavorites } from "../hooks/useFavorites";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FavoritesPage = () => {
  const { t } = useTranslation();
  const { favorites, isLoaded } = useFavorites();

  if (!isLoaded) {
    return <div className={styles.container}>{t("favorites.loading")}</div>;
  }

  return (
    <main className={styles.container}>
      <h1>{t("favorites.title")}</h1>

      {favorites.length === 0 ? (
        <p>{t("favorites.empty")}</p>
      ) : (
        <div className={styles.booksGrid}>
          {favorites.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <BookCard book={book} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default FavoritesPage;
