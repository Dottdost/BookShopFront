import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Manager.module.css";
import { Order, OrderStatus } from "../types";

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://localhost:44308/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error while fetching orders:", error);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await axios.post(
        `https://localhost:44308/api/v1/Admin/ChangeOrderStatus/${orderId}`,
        newStatus
      );
      fetchOrders();
    } catch (error) {
      console.error("Error while updating order status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className={styles.manager}>
      <h2>Order Management</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userId}</td>
              <td>{order.status}</td>
              <td>
                <button
                  className={styles.edit}
                  onClick={() =>
                    handleStatusChange(order.id, OrderStatus.Completed)
                  }
                >
                  Complete
                </button>
                <button
                  className={styles.delete}
                  onClick={() =>
                    handleStatusChange(order.id, OrderStatus.Canceled)
                  }
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManager;
