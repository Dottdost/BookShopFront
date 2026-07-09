import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import styles from "../styles/CartPage.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
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

const cartCatMessages = [
  "Are you... not planning to buy anything?",
  "I guarded these books all day for you...",
  "This cart feels a little lonely.",
  "One small order would make my whiskers happy.",
  "The books are waiting. I am trying to be brave.",
  "Please don't leave them behind...",
  "I can hear the books softly crying.",
  "Maybe just one book? For emotional support?",
  "Your cart believes in you.",
  "I am not begging. I am just dramatically concerned.",
  "A checkout button was made to be clicked...",
  "If you buy a book, I might purr again.",
];

const CartPage = () => {
  const { t } = useTranslation();
  const { cartItems, removeItem, changeQuantity, clear } = useCart();
  const user = useSelector((state: RootState) => state.auth.user);
  const { placeOrder } = useOrders(user?.id ?? "");

  const [showCardModal, setShowCardModal] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const [cartCatMessageIndex, setCartCatMessageIndex] = useState(0);
  const [cartCatTalking, setCartCatTalking] = useState(false);
  const [pupilMove, setPupilMove] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mascot = document.getElementById("cart-cat");
      if (!mascot) return;

      const rect = mascot.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (event.clientX - centerX) / rect.width;
      const y = (event.clientY - centerY) / rect.height;

      const moveX = Math.max(-3, Math.min(3, x * 8));
      const moveY = Math.max(-2, Math.min(2, y * 6));

      setPupilMove({ x: moveX, y: moveY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (Math.random() > 0.55) {
        setCartCatMessageIndex((current) => {
          return (current + 1) % cartCatMessages.length;
        });
      }
    }, 9000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

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

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.pitch = 0.98;
    utterance.volume = 0.75;

    window.speechSynthesis.speak(utterance);
  };

  const handleCartCatClick = () => {
    const nextMessageIndex = (cartCatMessageIndex + 1) % cartCatMessages.length;

    setCartCatMessageIndex(nextMessageIndex);
    setCartCatTalking(true);
    speak(cartCatMessages[nextMessageIndex]);

    window.setTimeout(() => {
      setCartCatTalking(false);
    }, 850);
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

      <div
        id="cart-cat"
        className={`${styles.cartCatContainer} ${
          cartCatTalking ? styles.cartCatTalking : ""
        }`}
        onClick={handleCartCatClick}
      >
        <div className={`${styles.cartCatOrb} ${styles.cartCatOrbOne}`} />
        <div className={`${styles.cartCatOrb} ${styles.cartCatOrbTwo}`} />

        <div className={styles.cartCatBubble}>
          {cartCatMessages[cartCatMessageIndex]}
        </div>

        <svg
          className={styles.cartCatSvg}
          viewBox="0 0 220 240"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="cartFurGradient" cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#d9ccff" />
              <stop offset="46%" stopColor="#9b7cf0" />
              <stop offset="100%" stopColor="#3c2b6d" />
            </radialGradient>

            <linearGradient
              id="cartInnerEar"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffd8f6" />
              <stop offset="100%" stopColor="#9b7cf0" />
            </linearGradient>

            <filter id="cartSoftGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className={styles.cartCatTail}>
            <path
              d="M142 155 C185 162, 197 204, 168 215 C143 224, 125 205, 143 188 C157 175, 178 190, 162 202"
              fill="none"
              stroke="#6f55c9"
              strokeWidth="23"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M143 156 C177 165, 190 197, 168 213"
              fill="none"
              stroke="#d7c9ff"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>

          <ellipse
            cx="110"
            cy="162"
            rx="48"
            ry="56"
            fill="url(#cartFurGradient)"
            opacity="0.96"
          />

          <ellipse
            cx="110"
            cy="174"
            rx="27"
            ry="35"
            fill="#d7c9ff"
            opacity="0.28"
          />

          <g className={styles.cartLeftEar}>
            <path
              d="M60 74 L76 26 L101 76 Z"
              fill="url(#cartFurGradient)"
              stroke="#26164e"
              strokeWidth="5"
            />
            <path
              d="M70 66 L78 40 L92 67 Z"
              fill="url(#cartInnerEar)"
              opacity="0.82"
            />
          </g>

          <g className={styles.cartRightEar}>
            <path
              d="M160 74 L144 26 L119 76 Z"
              fill="url(#cartFurGradient)"
              stroke="#26164e"
              strokeWidth="5"
            />
            <path
              d="M150 66 L142 40 L128 67 Z"
              fill="url(#cartInnerEar)"
              opacity="0.82"
            />
          </g>

          <ellipse
            cx="110"
            cy="94"
            rx="65"
            ry="60"
            fill="url(#cartFurGradient)"
            stroke="#26164e"
            strokeWidth="5"
          />

          <path
            d="M74 56 C87 48, 99 48, 111 58"
            fill="none"
            stroke="#d7c9ff"
            strokeWidth="4"
            opacity="0.28"
          />

          <path
            d="M109 45 C116 54, 124 55, 133 47"
            fill="none"
            stroke="#d7c9ff"
            strokeWidth="4"
            opacity="0.22"
          />

          <g className={styles.cartCatEyes}>
            <ellipse cx="84" cy="90" rx="15" ry="20" fill="#f8f3ff" />
            <ellipse cx="136" cy="90" rx="15" ry="20" fill="#f8f3ff" />
          </g>

          <circle
            className={styles.cartCatPupil}
            cx="84"
            cy="92"
            r="7"
            fill="#13091f"
            style={{
              transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)`,
            }}
          />

          <circle
            className={styles.cartCatPupil}
            cx="136"
            cy="92"
            r="7"
            fill="#13091f"
            style={{
              transform: `translate(${pupilMove.x}px, ${pupilMove.y}px)`,
            }}
          />

          <circle cx="80" cy="84" r="3" fill="#ffffff" opacity="0.88" />
          <circle cx="132" cy="84" r="3" fill="#ffffff" opacity="0.88" />

          <path
            d="M105 105 Q110 100 115 105 Q110 112 105 105Z"
            fill="#f0a7df"
          />

          <path
            className={styles.cartCatMouth}
            d="M96 124 Q110 134 124 124"
            fill="none"
            stroke="#ffd7f8"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#cartSoftGlow)"
          />

          <ellipse
            className={styles.cartCatTalkMouth}
            cx="110"
            cy="126"
            rx="9"
            ry="6"
            fill="#fff0fb"
            stroke="#ffd7f8"
            strokeWidth="2"
          />

          <path
            className={styles.cartCatBlushLeft}
            d="M63 108 C70 104, 79 104, 86 108"
            fill="none"
            stroke="#ffb7e8"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.55"
          />

          <path
            className={styles.cartCatBlushRight}
            d="M134 108 C141 104, 150 104, 157 108"
            fill="none"
            stroke="#ffb7e8"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.55"
          />

          <g
            className={styles.cartCatWhiskers}
            stroke="#e8dcff"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M92 111 C67 106, 47 108, 29 115" />
            <path d="M92 119 C67 119, 49 128, 32 140" />
            <path d="M128 111 C153 106, 173 108, 191 115" />
            <path d="M128 119 C153 119, 171 128, 188 140" />
          </g>

          <ellipse cx="80" cy="211" rx="18" ry="12" fill="#6752ba" />
          <ellipse cx="140" cy="211" rx="18" ry="12" fill="#6752ba" />

          <ellipse
            cx="110"
            cy="124"
            rx="80"
            ry="94"
            fill="none"
            stroke="#b9a6ff"
            strokeWidth="2"
            opacity="0.2"
            strokeDasharray="7 12"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 110 124"
              to="360 110 124"
              dur="22s"
              repeatCount="indefinite"
            />
          </ellipse>
        </svg>

        <div className={styles.cartCatHint}>comfort the cat ✦</div>
      </div>

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

            <div className={styles.modalActions}>
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
        </div>
      )}
    </main>
  );
};

export default CartPage;
