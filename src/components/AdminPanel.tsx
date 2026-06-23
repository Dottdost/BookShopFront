import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../styles/AdminPanel.module.css";
import BookManager from "./BookManager";
import UserManager from "./UserManager";
import OrderManager from "./OrderManager";
import PromoCodeManager from "./PromoCodeManager";
import SupportChatsPage from "../pages/SupportChatsPage";

const AdminPanel = () => {
  const { t } = useTranslation();
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
      case "supportChats":
        return <SupportChatsPage embedded />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <h3>{t("admin.title")}</h3>
        <button
          className={activeTab === "books" ? styles.active : ""}
          onClick={() => setActiveTab("books")}
        >
          📚 {t("admin.books")}
        </button>
        <button
          className={activeTab === "users" ? styles.active : ""}
          onClick={() => setActiveTab("users")}
        >
          👤 {t("admin.users")}
        </button>
        <button
          className={activeTab === "orders" ? styles.active : ""}
          onClick={() => setActiveTab("orders")}
        >
          🛒 {t("admin.orders")}
        </button>
        <button
          className={activeTab === "PromoCodeManager" ? styles.active : ""}
          onClick={() => setActiveTab("PromoCodeManager")}
        >
          🎟️ {t("admin.promos")}
        </button>
        <button
          className={activeTab === "supportChats" ? styles.active : ""}
          onClick={() => setActiveTab("supportChats")}
        >
          💬 Support Chats
        </button>
      </div>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default AdminPanel;
