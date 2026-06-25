import { useEffect, useState } from "react";
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

const PromoCodeManager = () => {
  const { t } = useTranslation();

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [newCode, setNewCode] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);

      const result = await getPromoCodes();
      setPromoCodes(result);
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
    try {
      await deletePromoCodeRequest(code);
      toast.success(t("admin.promoRemoved"));
      await fetchPromoCodes();
    } catch (error) {
      console.error("Error deleting promocode:", error);
      toast.error(getErrorMessage(error, t("admin.promoDeleteError")));
    }
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

        <button className={styles.editBtn} onClick={createPromoCode}>
          {t("admin.createPromo")}
        </button>
      </div>

      {loading && (
        <p className={styles.managerSubtitle}>{t("common.loading")}</p>
      )}

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
            {promoCodes.length > 0 ? (
              promoCodes.map((promo) => (
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
                      onClick={() => deactivatePromoCode(promo.code)}
                    >
                      {t("admin.deactivate")}
                    </button>

                    <button
                      className={styles.editBtn}
                      onClick={() => activatePromoCode(promo.code)}
                    >
                      {t("admin.activate")}
                    </button>

                    <button
                      className={styles.deleteBtn}
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

      <ToastContainer />
    </div>
  );
};

export default PromoCodeManager;
