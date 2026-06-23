import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Manager.module.css";
import { Order } from "../types/order";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const token = localStorage.getItem("accessToken");

  const statusLabelMap: Record<string, string> = {
    Pending: t("orders.pending"),
    Paid: t("admin.paid"),
    Shipped: t("orders.shipped"),
    Completed: t("admin.completed"),
    Canceled: t("admin.canceled"),
  };

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
        toast.error(t("admin.unexpectedResponse"));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(t("admin.failedLoadOrders"));
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
      toast.success(t("admin.orderStatusUpdated", { id: orderId }));
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(t("admin.failedUpdateStatus"));
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      await axios.delete(
        `https://localhost:44308/api/Order/${orderId}`,
        axiosConfig
      );
      fetchOrders();
      toast.success(t("admin.orderDeleted", { id: orderId }));
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(t("admin.failedDeleteOrder"));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className={styles.manager}>
      <h2>{t("admin.orderManagement")}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t("admin.id")}</th>
            <th>{t("common.status")}</th>
            <th>{t("common.actions")}</th>
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
                        {statusLabelMap[status] ?? status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(order.id)}
                  >
                    {t("common.delete")}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>{t("admin.noOrders")}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManager;
