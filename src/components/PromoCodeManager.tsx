import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Manager.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

type PromoCode = {
  id: string;
  code: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
};

const PromoCodeManager = () => {
  const { t } = useTranslation();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [newCode, setNewCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");

  const token = localStorage.getItem("accessToken");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchPromoCodes = async () => {
    try {
      const res = await axios.get(
        "https://localhost:44308/api/v1/PromoCode/get-all",
        axiosConfig
      );
      if (res.data && Array.isArray(res.data.$values)) {
        setPromoCodes(res.data.$values);
      } else {
        console.error("Unexpected promo code response:", res.data);
      }
    } catch (error) {
      console.error("Error loading promo codes:", error);
    }
  };

  const createPromoCode = async () => {
    try {
      const dto = {
        code: newCode,
        discount,
        expiryDate,
      };

      await axios.post(
        "https://localhost:44308/api/v1/PromoCode/Create",
        dto,
        axiosConfig
      );

      toast.success(t("admin.promoCreated"));
      setNewCode("");
      setDiscount(0);
      setExpiryDate("");
      fetchPromoCodes();
    } catch (error: unknown) {
      console.error("Error creating promocode:", error);
      toast.error(t("admin.promoCreateError"));
    }
  };

  const deactivatePromoCode = async (code: string) => {
    try {
      await axios.post(
        `https://localhost:44308/api/v1/PromoCode/Deactivate?code=${code}`,
        null,
        axiosConfig
      );
      toast.success(t("admin.promoDeactivated"));
      fetchPromoCodes();
    } catch (error: unknown) {
      console.error("Error deactivating promocode:", error);
      toast.error(t("admin.promoDeactivateError"));
    }
  };

  const activatePromoCode = async (code: string) => {
    try {
      await axios.post(
        `https://localhost:44308/api/v1/PromoCode/Activate?code=${code}`,
        null,
        axiosConfig
      );
      toast.success(t("admin.promoActivated"));
      fetchPromoCodes();
    } catch (error: unknown) {
      console.error("Error activating promocode:", error);
      toast.error(t("admin.promoActivateError"));
    }
  };

  const deletePromoCode = async (code: string) => {
    try {
      await axios.delete(
        `https://localhost:44308/api/v1/PromoCode/Delete?code=${code}`,
        axiosConfig
      );
      toast.success(t("admin.promoRemoved"));
      fetchPromoCodes();
    } catch (error: unknown) {
      console.error("Error deleting promocode:", error);
      toast.error(t("admin.promoDeleteError"));
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  return (
    <div className={styles.manager}>
      <h2>{t("admin.promoManagement")}</h2>

      <div className={styles.form}>
        <input
          type="text"
          placeholder={t("admin.code")}
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
        />
        <input
          type="number"
          placeholder={`${t("admin.discount")} (%)`}
          value={discount}
          onChange={(e) => setDiscount(parseFloat(e.target.value))}
        />
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <button className={styles.editBtn} onClick={createPromoCode}>
          {t("admin.createPromo")}
        </button>
      </div>

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
            promoCodes.map((p) => (
              <tr key={p.id}>
                <td>{p.code}</td>
                <td>{p.discount}%</td>
                <td>{new Date(p.expiryDate).toLocaleDateString()}</td>
                <td>{p.isActive ? t("admin.active") : t("admin.inactive")}</td>
                <td>
                  <button
                    className={styles.editBtn}
                    onClick={() => deactivatePromoCode(p.code)}
                  >
                    {t("admin.deactivate")}
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() => activatePromoCode(p.code)}
                  >
                    {t("admin.activate")}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deletePromoCode(p.code)}
                  >
                    {t("common.delete")}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>{t("admin.noPromoCodes")}</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default PromoCodeManager;
