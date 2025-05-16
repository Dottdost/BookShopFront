import { useSelector } from "react-redux";
import { RootState } from "../store";
import styles from "../styles/OrdersPage.module.css";
import { useOrders } from "../hooks/useOrders";
import { useEffect, useState } from "react";
import { Order, OrderItem } from "../types";

const OrdersPage = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [isUserReady, setIsUserReady] = useState(false);
  const { orders, loading, error } = useOrders(userId || "");

  useEffect(() => {
    if (userId) setIsUserReady(true);
  }, [userId]);

  if (!isUserReady) return <p>Loading user...</p>;
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order: Order) => (
            <div key={order.id} className={styles.orderCard}>
              <h2>Order #{order.id}</h2>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {order.status || "Unknown"}
              </p>
              <p>
                <strong>Total Items:</strong> {order.orderItems?.length || 0}
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
                            <strong>{item.title || "Unknown Book"}</strong>
                          </p>
                          <p>Quantity: {quantity}</p>
                          <p>Price: ${price.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No items in this order.</p>
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
