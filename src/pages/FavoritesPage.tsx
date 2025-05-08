import styles from "../styles/FavoritesPage.module.css";
import { useFavorites } from "../hooks/useFavorites";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import BookCard from "../components/BookCard";
import { addToCart } from "../store/slices/cartSlice";
import { Book } from "../types/book";

const FavoritesPage = () => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleAddToCart = (book: Book) => {
    if (!isAuthenticated) {
      alert("Please login to add to cart");
      return;
    }

    dispatch(
      addToCart({
        id: Date.now().toString(),
        bookId: book.id,
        quantity: 1,
        price: book.price,
        title: book.title,
        imageUrl: book.imageUrl,
      })
    );
  };

  return (
    <div className={styles.container}>
      <h1>Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>You don't have any favorite books yet.</p>
      ) : (
        <div className={styles.booksGrid}>
          {favorites.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isFavorite={true}
              onAddFavorite={() => addFavorite(book)}
              onRemoveFavorite={() => removeFavorite(book.id)}
              onAddToCart={() => handleAddToCart(book)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
