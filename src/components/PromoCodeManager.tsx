import { useEffect, useMemo, useState } from "react";
import styles from "../styles/Manager.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import {
  activatePromoCodeRequest,
  createPromoCodeRequest,
  deactivatePromoCodeRequest,
  deletePromoCodeRequest,
  getErrorMessage,
  getPromoCodes,
  PromoCode,
} from "../services/adminApi";

const PAGE_SIZE = 10;

const PromoCodeManager = () => {
  const { t } = useTranslation();

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [newCode, setNewCode] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const totalCount = promoCodes.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const currentPromoCodes = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;

    return promoCodes.slice(startIndex, startIndex + PAGE_SIZE);
  }, [promoCodes, page]);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);

      const result = await getPromoCodes();

      setPromoCodes(result);

      const nextTotalPages = Math.max(1, Math.ceil(result.length / PAGE_SIZE));

      if (page > nextTotalPages) {
        setPage(nextTotalPages);
      }
    } catch (error) {
      console.error("Error loading promo codes:", error);
      toast.error(getErrorMessage(error, t("admin.promoLoadError")));
    } finally {
      setLoading(false);
    }
  };

  const createPromoCode = async () => {
    if (!newCode.trim()) {
      toast.warn(t("admin.code"));
      return;
    }

    if (!expiryDate) {
      toast.warn(t("admin.expiry"));
      return;
    }

    try {
      await createPromoCodeRequest(newCode.trim(), discount, expiryDate);

      toast.success(t("admin.promoCreated"));
      setNewCode("");
      setDiscount(0);
      setExpiryDate("");
      setPage(1);

      await fetchPromoCodes();
    } catch (error) {
      console.error("Error creating promocode:", error);
      toast.error(getErrorMessage(error, t("admin.promoCreateError")));
    }
  };

  const deactivatePromoCode = async (code: string) => {
    try {
      await deactivatePromoCodeRequest(code);
      toast.success(t("admin.promoDeactivated"));
      await fetchPromoCodes();
    } catch (error) {
      console.error("Error deactivating promocode:", error);
      toast.error(getErrorMessage(error, t("admin.promoDeactivateError")));
    }
  };

  const activatePromoCode = async (code: string) => {
    try {
      await activatePromoCodeRequest(code);
      toast.success(t("admin.promoActivated"));
      await fetchPromoCodes();
    } catch (error) {
      console.error("Error activating promocode:", error);
      toast.error(getErrorMessage(error, t("admin.promoActivateError")));
    }
  };

  const deletePromoCode = async (code: string) => {
    const confirmed = window.confirm(`Delete promo code "${code}"?`);

    if (!confirmed) return;

    try {
      await deletePromoCodeRequest(code);
      toast.success(t("admin.promoRemoved"));

      const nextPage =
        currentPromoCodes.length === 1 && page > 1
          ? Math.max(1, page - 1)
          : page;

      setPage(nextPage);

      await fetchPromoCodes();
    } catch (error) {
      console.error("Error deleting promocode:", error);
      toast.error(getErrorMessage(error, t("admin.promoDeleteError")));
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
          disabled={i === page || loading}
          className={i === page ? styles.activePage : ""}
        >
          {i}
        </button>,
      );
    }

    return buttons;
  };

  useEffect(() => {
    void fetchPromoCodes();
  }, []);

  return (
    <div className={styles.manager}>
      <h2>{t("admin.promoManagement")}</h2>

      <div className={styles.form}>
        <input
          type="text"
          placeholder={t("admin.code")}
          value={newCode}
          onChange={(event) => setNewCode(event.target.value)}
        />

        <input
          type="number"
          placeholder={`${t("admin.discount")} (%)`}
          value={discount}
          onChange={(event) => setDiscount(Number(event.target.value))}
        />

        <input
          type="date"
          value={expiryDate}
          onChange={(event) => setExpiryDate(event.target.value)}
        />

        <button
          className={styles.editBtn}
          type="button"
          onClick={createPromoCode}
        >
          {t("admin.createPromo")}
        </button>
      </div>

      <p className={styles.managerSubtitle}>
        Total promo codes: {totalCount} • Page {page} of {totalPages}
        {loading ? ` • ${t("common.loading")}` : ""}
      </p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("admin.code")}</th>
              <th>{t("admin.discount")}</th>
              <th>{t("admin.expiry")}</th>
              <th>{t("common.status")}</th>
              <th>{t("common.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {currentPromoCodes.length > 0 ? (
              currentPromoCodes.map((promo) => (
                <tr key={promo.id || promo.code}>
                  <td>{promo.code}</td>
                  <td>{promo.discount}%</td>
                  <td>{new Date(promo.expiryDate).toLocaleDateString()}</td>
                  <td>
                    {promo.isActive ? t("admin.active") : t("admin.inactive")}
                  </td>
                  <td>
                    <button
                      className={styles.editBtn}
                      type="button"
                      onClick={() => deactivatePromoCode(promo.code)}
                    >
                      {t("admin.deactivate")}
                    </button>

                    <button
                      className={styles.editBtn}
                      type="button"
                      onClick={() => activatePromoCode(promo.code)}
                    >
                      {t("admin.activate")}
                    </button>

                    <button
                      className={styles.deleteBtn}
                      type="button"
                      onClick={() => deletePromoCode(promo.code)}
                    >
                      {t("common.delete")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  {loading ? t("common.loading") : t("admin.noPromoCodes")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

      <ToastContainer />
    </div>
  );
};

export default PromoCodeManager;
