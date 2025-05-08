import { useCart } from "../hooks/useCart";
import styles from "../styles/CartPage.module.css";

const CartPage = () => {
  const { cartItems, removeItem, changeQuantity, clear } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={styles.container}>
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.bookId}>
                  <td>
                    <img
                      src={item.imageUrl || "/book-placeholder.jpg"}
                      alt={item.title}
                      className={styles.image}
                    />
                  </td>
                  <td>{item.title}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        changeQuantity(item.bookId, Number(e.target.value))
                      }
                      className={styles.quantityInput}
                    />
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className={styles.removeButton}
                      onClick={() => removeItem(item.bookId)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.summary}>
            <p>
              <strong>Total:</strong> ${totalPrice.toFixed(2)}
            </p>
            <button className={styles.clearButton} onClick={clear}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
