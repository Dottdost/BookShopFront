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

const PAGE_SIZE = 10;

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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const statusLabelMap: Record<string, string> = {
    Pending: t("orders.pending"),
    Paid: t("admin.paid"),
    Shipped: t("orders.shipped"),
    Completed: t("admin.completed"),
    Canceled: t("admin.canceled"),
  };

  const fetchOrders = async (currentPage = page) => {
    try {
      setLoading(true);

      const result = await getOrders(currentPage, PAGE_SIZE);

      setOrders(result.items);
      setPage(result.page);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
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
      await fetchOrders(page);

      toast.success(t("admin.orderStatusUpdated", { id: orderId }));
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(getErrorMessage(error, t("admin.failedUpdateStatus")));
    }
  };

  const handleDelete = async (orderId: string) => {
    const confirmed = window.confirm(`Delete order "${orderId}"?`);

    if (!confirmed) return;

    try {
      await deleteOrder(orderId);

      const nextPage =
        orders.length === 1 && page > 1 ? Math.max(1, page - 1) : page;

      await fetchOrders(nextPage);

      toast.success(t("admin.orderDeleted", { id: orderId }));
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(getErrorMessage(error, t("admin.failedDeleteOrder")));
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    let start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i += 1) {
      buttons.push(
        <button
          key={i}
          type="button"
          onClick={() => setPage(i)}
          disabled={i === page}
          className={i === page ? styles.activePage : ""}
        >
          {i}
        </button>,
      );
    }

    return buttons;
  };

  useEffect(() => {
    void fetchOrders(page);
  }, [page]);

  return (
    <div className={styles.manager}>
      <h2>{t("admin.orderManagement")}</h2>

      <p className={styles.managerSubtitle}>
        Total orders: {totalCount}
        {loading ? ` • ${t("common.loading")}` : ""}
      </p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("admin.id")}</th>
              <th>{t("common.status")}</th>
              <th>Total</th>
              <th>Date</th>
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
                    $
                    {(
                      order.finalPrice ??
                      order.totalPrice ??
                      order.originalPrice ??
                      0
                    ).toFixed(2)}
                  </td>

                  <td>
                    {order.orderDate || order.createdAt
                      ? new Date(
                          order.orderDate ?? order.createdAt ?? "",
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <button
                      className={styles.deleteBtn}
                      type="button"
                      onClick={() => handleDelete(order.id)}
                    >
                      {t("common.delete")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  {loading ? t("common.loading") : t("admin.noOrders")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1 || loading}
          >
            {t("common.prev")}
          </button>

          {renderPageButtons()}

          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            disabled={page === totalPages || loading}
          >
            {t("common.next")}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
