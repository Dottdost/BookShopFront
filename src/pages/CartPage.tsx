import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import styles from "../styles/CartPage.module.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

type OrderRequest = {
  userId: string;
  userAddressId: string;
  userBankCardId: string;
  orderItems: {
    bookId: string | number;
    quantity: number;
  }[];
  promoCode?: string;
};

const CartPage = () => {
  const { t } = useTranslation();
  const { cartItems, removeItem, changeQuantity, clear } = useCart();
  const user = useSelector((state: RootState) => state.auth.user);
  const { placeOrder } = useOrders(user?.id ?? "");

  const [showCardModal, setShowCardModal] = useState(false);
  const [promoCode, setPromoCode] = useState("");

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
    0,
  );

  const handleCardInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setAddressDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.warn(t("cart.loginRequired"));
      return;
    }

    const { cardNumber, cardHolderName, expirationDate, cvv } = cardDetails;
    const { street, city, state, postalCode, country } = addressDetails;

    if (!cardNumber || !cardHolderName || !expirationDate || !cvv) {
      toast.warn(t("cart.fillCard"));
      return;
    }

    if (!street || !city || !state || !postalCode || !country) {
      toast.warn(t("cart.fillAddress"));
      return;
    }

    try {
      const cardPayload = {
        cardNumber,
        cardHolderName,
        expirationDate: new Date(expirationDate).toISOString().split("T")[0],
        cvv,
        userId: user.id,
      };

      const cardResponse = await axios.post(
        "http://cheshireshelfapp-env.eba-pzcyg6yq.eu-north-1.elasticbeanstalk.com/api/Card",
        cardPayload,
      );

      const userBankCardId = cardResponse.data.id;

      const addressPayload = {
        userId: user.id,
        street,
        city,
        state,
        postalCode,
        country,
      };

      const addressResponse = await axios.post(
        "http://cheshireshelfapp-env.eba-pzcyg6yq.eu-north-1.elasticbeanstalk.com/api/Adress",
        addressPayload,
      );

      const userAddressId = addressResponse.data.id;

      const orderRequest: OrderRequest = {
        userId: user.id,
        userAddressId,
        userBankCardId,
        orderItems: cartItems.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        })),
      };

      if (promoCode.trim()) {
        orderRequest.promoCode = promoCode.trim();
      }

      const orderResponse = await axios.post(
        "http://cheshireshelfapp-env.eba-pzcyg6yq.eu-north-1.elasticbeanstalk.com/api/Order",
        orderRequest,
      );

      placeOrder(orderResponse.data);
      clear();
      toast.success(t("cart.orderSuccess"));
      setShowCardModal(false);
    } catch (error) {
      console.error("Order error:", error);

      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data;

        if (
          typeof errorMsg === "string" &&
          errorMsg.toLowerCase().includes("promo code")
        ) {
          toast.error(t("cart.invalidPromo"));
        } else {
          toast.error(t("cart.orderFailed"));
        }
      } else {
        toast.error(t("cart.unexpectedError"));
      }
    }
  };

  return (
    <main className={styles.container}>
      <h1>{t("cart.title")}</h1>

      {cartItems.length === 0 ? (
        <p>{t("cart.empty")}</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("common.image")}</th>
                <th>{t("common.title")}</th>
                <th>{t("common.price")}</th>
                <th>{t("common.quantity")}</th>
                <th>{t("common.total")}</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item, index) => {
                const imageSrc =
                  typeof item.imageUrl === "string" && item.imageUrl.length > 0
                    ? item.imageUrl
                    : "/book-placeholder.jpg";

                return (
                  <tr key={`${item.bookId}-${index}`}>
                    <td data-label={t("common.image")}>
                      <img
                        src={imageSrc}
                        alt={item.title ?? "Book"}
                        className={styles.image}
                        onError={(event) => {
                          event.currentTarget.src = "/book-placeholder.jpg";
                        }}
                      />
                    </td>

                    <td data-label={t("common.title")}>
                      {item.title ?? t("cart.untitled")}
                    </td>

                    <td data-label={t("common.price")}>
                      $
                      {item.price != null
                        ? item.price.toFixed(2)
                        : t("cart.notAvailable")}
                    </td>

                    <td data-label={t("common.quantity")}>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          changeQuantity(
                            item.bookId,
                            Number(event.target.value),
                          )
                        }
                        className={styles.quantityInput}
                      />
                    </td>

                    <td data-label={t("common.total")}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>

                    <td>
                      <button
                        className={styles.removeButton}
                        onClick={() => removeItem(item.bookId)}
                        aria-label={t("cart.remove")}
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
              <strong>{t("common.total")}:</strong> ${totalPrice.toFixed(2)}
            </p>

            <input
              type="text"
              placeholder={t("cart.enterPromo")}
              value={promoCode}
              onChange={(event) => setPromoCode(event.target.value)}
              className={styles.promoInput}
            />

            <button className={styles.clearButton} onClick={clear}>
              {t("cart.clear")}
            </button>

            <button
              className={styles.button}
              onClick={() => setShowCardModal(true)}
            >
              {t("cart.placeOrder")}
            </button>
          </div>
        </>
      )}

      {showCardModal && (
        <div className={styles.cardModal}>
          <div className={styles.cardModalContent}>
            <h2>{t("cart.enterCardAddress")}</h2>

            <h3>{t("cart.cardInfo")}</h3>

            <label>{t("cart.cardNumber")}</label>
            <input
              type="text"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleCardInputChange}
            />

            <label>{t("cart.cardholderName")}</label>
            <input
              type="text"
              name="cardHolderName"
              value={cardDetails.cardHolderName}
              onChange={handleCardInputChange}
            />

            <label>{t("cart.expirationDate")}</label>
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

            <h3>{t("cart.shippingAddress")}</h3>

            <label>{t("cart.street")}</label>
            <input
              type="text"
              name="street"
              value={addressDetails.street}
              onChange={handleAddressInputChange}
            />

            <label>{t("cart.city")}</label>
            <input
              type="text"
              name="city"
              value={addressDetails.city}
              onChange={handleAddressInputChange}
            />

            <label>{t("cart.state")}</label>
            <input
              type="text"
              name="state"
              value={addressDetails.state}
              onChange={handleAddressInputChange}
            />

            <label>{t("cart.postalCode")}</label>
            <input
              type="text"
              name="postalCode"
              value={addressDetails.postalCode}
              onChange={handleAddressInputChange}
            />

            <label>{t("cart.country")}</label>
            <input
              type="text"
              name="country"
              value={addressDetails.country}
              onChange={handleAddressInputChange}
            />

            <button className={styles.button} onClick={handlePlaceOrder}>
              {t("common.submit")}
            </button>

            <button
              className={styles.clearButton}
              onClick={() => setShowCardModal(false)}
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
