import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Manager.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PromoCode = {
  id: string;
  code: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
};

const PromoCodeManager = () => {
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
        console.error("Ожидался массив промокодов, но получено:", res.data);
      }
    } catch (error) {
      console.error("Ошибка при загрузке промокодов:", error);
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

      toast.success("Промокод создан.");
      setNewCode("");
      setDiscount(0);
      setExpiryDate("");
      fetchPromoCodes();
    } catch (err) {
      console.error("Ошибка при создании промокода:", err);
      toast.error("Ошибка при создании промокода.");
    }
  };

  const deactivatePromoCode = async (code: string) => {
    try {
      await axios.post(
        `https://localhost:44308/api/v1/PromoCode/Deactivate?code=${code}`,
        null,
        axiosConfig
      );
      toast.success("Промокод деактивирован.");
      fetchPromoCodes();
    } catch (err) {
      console.error("Ошибка при деактивации:", err);
      toast.error("Ошибка при деактивации промокода.");
    }
  };

  const deletePromoCode = async (code: string) => {
    try {
      await axios.delete(
        `https://localhost:44308/api/v1/PromoCode/Delete?code=${code}`,
        axiosConfig
      );
      toast.success("Промокод удален.");
      fetchPromoCodes();
    } catch (err) {
      console.error("Ошибка при удалении промокода:", err);
      toast.error("Ошибка при удалении промокода.");
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  return (
    <div className={styles.manager}>
      <h2>Promo Code Management</h2>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="Code"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
        />
        <input
          type="number"
          placeholder="Discount (%)"
          value={discount}
          onChange={(e) => setDiscount(parseFloat(e.target.value))}
        />
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <button className={styles.editBtn} onClick={createPromoCode}>
          Create Promo Code
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Expiry</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promoCodes.length > 0 ? (
            promoCodes.map((p) => (
              <tr key={p.id}>
                <td>{p.code}</td>
                <td>{p.discount}%</td>
                <td>{new Date(p.expiryDate).toLocaleDateString()}</td>
                <td>{p.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    className={styles.editBtn}
                    onClick={() => deactivatePromoCode(p.code)}
                  >
                    Deactivate
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deletePromoCode(p.code)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No promo codes available</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default PromoCodeManager;
