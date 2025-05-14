import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import styles from "../styles/CartPage.module.css";
import axios from "axios";
import { useState } from "react";

const CartPage = () => {
  const { cartItems, removeItem, changeQuantity, clear } = useCart();
  const user = useSelector((state: RootState) => state.auth.user);
  const { placeOrder } = useOrders(user?.id ?? "");

  const [showCardModal, setShowCardModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolderName: "",
    expirationDate: "",
    cvv: "",
  });

  const [addressDetails, setAddressDetails] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }

    const { cardNumber, cardHolderName, expirationDate, cvv } = cardDetails;
    const { street, city, state, postalCode, country } = addressDetails;

    if (!cardNumber || !cardHolderName || !expirationDate || !cvv) {
      alert("Please fill in all card details.");
      return;
    }

    if (!street || !city || !state || !postalCode || !country) {
      alert("Please fill in all address details.");
      return;
    }

    try {
      // ✅ 1. Сохраняем карту
      const cardPayload = {
        cardNumber,
        cardHolderName,
        expirationDate: new Date(expirationDate).toISOString().split("T")[0],
        cvv,
        userId: user.id,
      };

      const cardResponse = await axios.post(
        "https://localhost:44308/api/Card",
        cardPayload
      );
      const userBankCardId = cardResponse.data.id;

      // ✅ 2. Сохраняем адрес
      const addressPayload = {
        userId: user.id,
        street,
        city,
        state,
        postalCode,
        country,
      };

      const addressResponse = await axios.post(
        "https://localhost:44308/api/Adress",
        addressPayload
      );
      const userAddressId = addressResponse.data.id;

      // ✅ 3. Формируем заказ
      const orderRequest = {
        userId: user.id,
        userAddressId,
        userBankCardId,
        orderItems: cartItems.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        })),
      };

      console.log("📦 Order request payload:", orderRequest);

      // ❗ Удалили поле totalPrice, его быть не должно!

      const orderResponse = await axios.post(
        "https://localhost:44308/api/Order",
        orderRequest
      );

      // 🧹 Очистка корзины и сообщение
      placeOrder(orderResponse.data);
      clear();
      alert("Order placed successfully!");
      setShowCardModal(false);
    } catch (error) {
      console.error("❌ Order error:", error);
      if (axios.isAxiosError(error)) {
        console.error("🔎 Server response:", error.response?.data);
      }
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => {
                const imageSrc =
                  typeof item.imageFile === "string" &&
                  item.imageFile.length > 0
                    ? item.imageFile
                    : "/book-placeholder.jpg";

                return (
                  <tr key={`${item.bookId}-${index}`}>
                    <td>
                      <img
                        src={imageSrc}
                        alt={item.title ?? "Book"}
                        className={styles.image}
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "/book-placeholder.jpg")
                        }
                      />
                    </td>
                    <td>{item.title ?? "Untitled"}</td>
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
                );
              })}
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
              onClick={() => setShowCardModal(true)}
            >
              Place Order
            </button>
          </div>
        </>
      )}

      {showCardModal && (
        <div className={styles.cardModal}>
          <div className={styles.cardModalContent}>
            <h2>Enter Card & Address</h2>

            <h3>Card Info</h3>
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleCardInputChange}
            />
            <label>Cardholder Name</label>
            <input
              type="text"
              name="cardHolderName"
              value={cardDetails.cardHolderName}
              onChange={handleCardInputChange}
            />
            <label>Expiration Date</label>
            <input
              type="date"
              name="expirationDate"
              value={cardDetails.expirationDate}
              onChange={handleCardInputChange}
            />
            <label>CVV</label>
            <input
              type="text"
              name="cvv"
              value={cardDetails.cvv}
              onChange={handleCardInputChange}
            />

            <h3>Shipping Address</h3>
            <label>Street</label>
            <input
              type="text"
              name="street"
              value={addressDetails.street}
              onChange={handleAddressInputChange}
            />
            <label>City</label>
            <input
              type="text"
              name="city"
              value={addressDetails.city}
              onChange={handleAddressInputChange}
            />
            <label>State</label>
            <input
              type="text"
              name="state"
              value={addressDetails.state}
              onChange={handleAddressInputChange}
            />
            <label>Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={addressDetails.postalCode}
              onChange={handleAddressInputChange}
            />
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={addressDetails.country}
              onChange={handleAddressInputChange}
            />

            <button onClick={handlePlaceOrder}>Submit</button>
            <button onClick={() => setShowCardModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
