import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Manager.module.css";
import { Order } from "../types/order";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const orderStatusMap = {
  0: "Pending",
  1: "Paid",
  2: "Shipped",
  3: "Completed",
  4: "Canceled",
};

const statusToNumber = {
  Pending: 0,
  Paid: 1,
  Shipped: 2,
  Completed: 3,
  Canceled: 4,
};

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = localStorage.getItem("accessToken");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://localhost:44308/api/Order/get-all-orders",
        axiosConfig
      );
      if (response.data && Array.isArray(response.data.$values)) {
        setOrders(response.data.$values);
      } else {
        toast.error("Unexpected response format.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders.");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const numericStatus =
      statusToNumber[newStatus as keyof typeof statusToNumber];

    try {
      await axios.patch(
        `https://localhost:44308/api/Order/${orderId}/status`,
        { status: numericStatus },
        axiosConfig
      );
      fetchOrders();
      toast.success(`Order #${orderId} status updated.`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.");
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      await axios.delete(
        `https://localhost:44308/api/Order/${orderId}`,
        axiosConfig
      );
      fetchOrders();
      toast.success(`Order #${orderId} deleted.`);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order.");
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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <select
                    className={styles.select}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    {Object.values(orderStatusMap).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManager;
