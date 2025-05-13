import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import styles from "../styles/CartPage.module.css";
import axios from "axios";

const CartPage = () => {
  const { cartItems, removeItem, changeQuantity, clear } = useCart();
  const user = useSelector((state: RootState) => state.auth.user); // предполагается, что у вас есть auth

  // Передаем user.id в useOrders
  const { placeOrder } = useOrders(user?.id ?? "");

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }

    try {
      const request = {
        userId: user.id,
        items: cartItems.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice,
      };

      const response = await axios.post(
        "http://localhost:44308/api/Order",
        request
      );

      placeOrder(response.data); // передаем заказ в placeOrder
      clear(); // очищаем корзину
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

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
              {cartItems.map((item, index) => (
                <tr key={`${item.bookId}-${index}`}>
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
            <button
              className={styles.placeOrderButton}
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
