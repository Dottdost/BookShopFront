import { useSelector } from "react-redux";
import { RootState } from "../store";
import styles from "../styles/OrdersPage.module.css";

const OrdersPage = () => {
  const {
    items: orders,
    loading,
    error,
  } = useSelector((state: RootState) => state.orders);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>Your Orders</h1>
      {orders && orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {Array.isArray(orders) &&
            orders.map((order) => (
              <li key={order.id}>
                Order {order.id}: {order.items.length} items
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
