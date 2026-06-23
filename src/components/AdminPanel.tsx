import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiBookOpen, FiMessageCircle, FiShoppingCart, FiTag, FiUsers } from "react-icons/fi";
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
        <button className={activeTab === "books" ? styles.active : ""} onClick={() => setActiveTab("books")}>
          <FiBookOpen />
          <span>{t("admin.books")}</span>
        </button>
        <button className={activeTab === "users" ? styles.active : ""} onClick={() => setActiveTab("users")}>
          <FiUsers />
          <span>{t("admin.users")}</span>
        </button>
        <button className={activeTab === "orders" ? styles.active : ""} onClick={() => setActiveTab("orders")}>
          <FiShoppingCart />
          <span>{t("admin.orders")}</span>
        </button>
        <button className={activeTab === "PromoCodeManager" ? styles.active : ""} onClick={() => setActiveTab("PromoCodeManager")}>
          <FiTag />
          <span>{t("admin.promos")}</span>
        </button>
        <button className={activeTab === "supportChats" ? styles.active : ""} onClick={() => setActiveTab("supportChats")}>
          <FiMessageCircle />
          <span>{t("admin.supportChats")}</span>
        </button>
      </div>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default AdminPanel;
