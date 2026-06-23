import { useSelector } from "react-redux";
import { RootState } from "../store";
import styles from "../styles/OrdersPage.module.css";
import { useOrders } from "../hooks/useOrders";
import { useEffect, useState } from "react";
import { Order, OrderItem } from "../types";
import { useTranslation } from "react-i18next";

const OrdersPage = () => {
  const { t } = useTranslation();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [isUserReady, setIsUserReady] = useState(false);
  const { orders, loading, error } = useOrders(userId || "");

  useEffect(() => {
    if (userId) setIsUserReady(true);
  }, [userId]);

  if (!isUserReady) return <p>{t("orders.loadingUser")}</p>;
  if (loading) return <p>{t("orders.loadingOrders")}</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>{t("orders.title")}</h1>
      {orders.length === 0 ? (
        <p>{t("orders.empty")}</p>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order: Order) => (
            <div key={order.id} className={styles.orderCard}>
              <h2>{t("orders.orderNumber", { id: order.id })}</h2>
              <p>
                <strong>{t("orders.date")}:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>{t("orders.status")}:</strong>{" "}
                {order.status || t("orders.unknown")}
              </p>
              <p>
                <strong>{t("orders.totalItems")}:</strong>{" "}
                {order.orderItems?.length || 0}
              </p>

              <div className={styles.orderItems}>
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item: OrderItem, index: number) => {
                    const price = item.price
                      ? parseFloat(item.price.toString())
                      : 0;
                    const quantity = item.quantity
                      ? parseInt(item.quantity.toString(), 10)
                      : 0;

                    return (
                      <div key={index} className={styles.orderItem}>
                        <div className={styles.bookImageWrapper}></div>
                        <div className={styles.bookInfo}>
                          <p>
                            <strong>{item.title || t("orders.unknownBook")}</strong>
                          </p>
                          <p>{t("common.quantity")}: {quantity}</p>
                          <p>{t("common.price")}: ${price.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>{t("orders.noItems")}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
