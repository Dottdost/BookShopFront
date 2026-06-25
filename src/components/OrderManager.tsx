import { useEffect, useState } from "react";
import styles from "../styles/Manager.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import {
  AdminOrder,
  deleteOrder,
  getErrorMessage,
  getOrders,
  updateOrderStatus,
} from "../services/adminApi";

const statusOptions = [
  { value: 0, key: "Pending" },
  { value: 1, key: "Paid" },
  { value: 2, key: "Shipped" },
  { value: 3, key: "Completed" },
  { value: 4, key: "Canceled" },
];

const normalizeStatusNumber = (status: number | string) => {
  if (typeof status === "number") {
    return status;
  }

  const numeric = Number(status);

  if (!Number.isNaN(numeric)) {
    return numeric;
  }

  const found = statusOptions.find(
    (item) => item.key.toLowerCase() === status.toLowerCase(),
  );

  return found?.value ?? 0;
};

const OrderManager = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const statusLabelMap: Record<string, string> = {
    Pending: t("orders.pending"),
    Paid: t("admin.paid"),
    Shipped: t("orders.shipped"),
    Completed: t("admin.completed"),
    Canceled: t("admin.canceled"),
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const result = await getOrders();
      setOrders(result);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(getErrorMessage(error, t("admin.failedLoadOrders")));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const numericStatus = Number(newStatus);

    try {
      await updateOrderStatus(orderId, numericStatus);
      await fetchOrders();
      toast.success(t("admin.orderStatusUpdated", { id: orderId }));
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(getErrorMessage(error, t("admin.failedUpdateStatus")));
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      await fetchOrders();
      toast.success(t("admin.orderDeleted", { id: orderId }));
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(getErrorMessage(error, t("admin.failedDeleteOrder")));
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  return (
    <div className={styles.manager}>
      <h2>{t("admin.orderManagement")}</h2>

      {loading && (
        <p className={styles.managerSubtitle}>{t("common.loading")}</p>
      )}

      <div className={styles.tableWrap}>
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
                      value={normalizeStatusNumber(order.status)}
                      onChange={(event) =>
                        handleStatusChange(order.id, event.target.value)
                      }
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {statusLabelMap[status.key] ?? status.key}
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
                <td colSpan={3} className={styles.emptyState}>
                  {loading ? t("common.loading") : t("admin.noOrders")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManager;
