import { useState } from "react";
import styles from "../styles/AdminPanel.module.css";
import BookManager from "./BookManager";
import UserManager from "./UserManager";
import OrderManager from "./OrderManager";
import ReviewManager from "./ReviewManager";
import PreorderManager from "./PreorderManager";

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
      case "reviews":
        return <ReviewManager />;
      case "preorders":
        return <PreorderManager />;
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
          className={activeTab === "reviews" ? styles.active : ""}
          onClick={() => setActiveTab("reviews")}
        >
          💬 Reviews
        </button>
        <button
          className={activeTab === "preorders" ? styles.active : ""}
          onClick={() => setActiveTab("preorders")}
        >
          ⏳ Preorders
        </button>
      </div>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default AdminPanel;
