import { useState } from "react";
import styles from "../styles/AdminPanel.module.css";
import BookManager from "./BookManager";
import UserManager from "./UserManager";
import OrderManager from "./OrderManager";
import PromoCodeManager from "./PromoCodeManager";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("books");

  const renderContent = () => {
    switch (activeTab) {
      case "books":
        return <BookManager />;
      case "users":
        return <UserManager />;
      case "orders":
        return <OrderManager />;
      case "PromoCodeManager":
        return <PromoCodeManager />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <h3>Admin Panel</h3>
        <button
          className={activeTab === "books" ? styles.active : ""}
          onClick={() => setActiveTab("books")}
        >
          📚 Books
        </button>
        <button
          className={activeTab === "users" ? styles.active : ""}
          onClick={() => setActiveTab("users")}
        >
          👤 Users
        </button>
        <button
          className={activeTab === "orders" ? styles.active : ""}
          onClick={() => setActiveTab("orders")}
        >
          🛒 Orders
        </button>
        <button
          className={activeTab === "PromoCodeManager" ? styles.active : ""}
          onClick={() => setActiveTab("PromoCodeManager")}
        >
          🎟️PromManager
        </button>
      </div>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default AdminPanel;
