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

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }

    if (
      !cardDetails.cardNumber ||
      !cardDetails.cardHolderName ||
      !cardDetails.expirationDate ||
      !cardDetails.cvv
    ) {
      alert("Please fill in all card details.");
      return;
    }

    const cardRequest = {
      cardNumber: cardDetails.cardNumber,
      cardHolderName: cardDetails.cardHolderName,
      expirationDate: cardDetails.expirationDate,
      cvv: cardDetails.cvv,
      userId: user.id,
    };

    try {
      // Сначала создаём банковскую карту
      const cardResponse = await axios.post(
        "https://localhost:44308/api/Card",
        cardRequest
      );
      console.log("Card added successfully:", cardResponse.data);

      // После этого отправляем заказ с добавленной картой
      const request = {
        userId: user.id,
        userAddressId: "some-address-id", // Можно заменить на реальный ID
        userBankCardId: cardResponse.data.id, // Получаем ID карты из ответа
        orderItems: cartItems.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        })),
      };

      const orderResponse = await axios.post(
        "https://localhost:44308/api/Order",
        request
      );
      console.log("Order placed successfully:", orderResponse.data);

      placeOrder(orderResponse.data);
      clear();
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
                        onError={(e) => {
                          console.error("Image load error:", imageSrc);
                          (e.target as HTMLImageElement).src =
                            "/book-placeholder.jpg";
                        }}
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
            <h2>Enter Card Details</h2>
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
              type="text"
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
            <button onClick={handlePlaceOrder}>Submit</button>
            <button onClick={() => setShowCardModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
