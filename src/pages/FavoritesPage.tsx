import styles from "../styles/FavoritesPage.module.css";
import { useFavorites } from "../hooks/useFavorites";
import { useOrders } from "../hooks/useOrders";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import BookCard from "../components/BookCard";
import { Order, OrderItem, OrderStatus } from "../types/order";

const FavoritesPage = () => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { placeOrder } = useOrders();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const handleOrder = (book: (typeof favorites)[number]) => {
    if (!isAuthenticated || !user) {
      alert("Please login to place an order");
      return;
    }

    const orderItem: OrderItem = {
      id: Date.now().toString(),
      bookId: book.id,
      quantity: 1,
      price: book.price,
      title: book.title,
      imageUrl: book.imageUrl,
    };

    const order: Order = {
      id: Date.now().toString(),
      userId: user.id,
      items: [orderItem],
      totalPrice: book.price,
      status: OrderStatus.Pending,
      createdAt: new Date().toISOString(),
    };

    placeOrder(order);
    alert(`Order placed for ${book.title}!`);
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
              onOrder={() => handleOrder(book)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
