import styles from "../styles/OrdersPage.module.css";
import { useOrders } from "../hooks/useOrders";

const OrdersPage = () => {
  const { orders } = useOrders();

  return (
    <div className={styles.container}>
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>You don't have any orders yet.</p>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <h3>Order #{order.id}</h3>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Total: ${order.totalPrice.toFixed(2)}</p>
              <p>Status: {order.status}</p>
              <div className={styles.orderItems}>
                {order.items.map((item) => (
                  <div key={item.id} className={styles.orderItem}>
                    <span>{item.title}</span>
                    <span>
                      ${item.price.toFixed(2)} × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
