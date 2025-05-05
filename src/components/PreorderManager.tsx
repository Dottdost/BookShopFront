import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Manager.module.css";
import { PreOrder } from "../types/order";

const PreorderManager = () => {
  const [preorders, setPreorders] = useState<PreOrder[]>([]);

  const fetchPreorders = async () => {
    try {
      const response = await axios.get("https://localhost:44308/api/preorders");
      setPreorders(response.data);
    } catch (error) {
      console.error("Error fetching preorders:", error);
    }
  };

  useEffect(() => {
    fetchPreorders();
  }, []);

  return (
    <div className={styles.manager}>
      <h2>Preorder Management</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Book Title</th>
            <th>User</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {preorders.map((preorder) => (
            <tr key={preorder.id}>
              <td>{preorder.id}</td>
              <td>{preorder.title}</td>
              <td>{preorder.userName}</td>
              <td>{new Date(preorder.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreorderManager;
