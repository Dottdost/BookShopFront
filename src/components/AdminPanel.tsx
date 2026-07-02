import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiBookOpen,
  FiBookmark,
  FiBriefcase,
  FiMessageCircle,
  FiShoppingCart,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import styles from "../styles/AdminPanel.module.css";
import BookManager from "./BookManager";
import UserManager from "./UserManager";
import OrderManager from "./OrderManager";
import PromoCodeManager from "./PromoCodeManager";
import GenreManager from "./GenreManager";
import PublisherManager from "./PublisherManager";
import SupportChatsPage from "../pages/SupportChatsPage";

type AdminTab =
  | "books"
  | "users"
  | "orders"
  | "promos"
  | "genres"
  | "publishers"
  | "supportChats";

const AdminPanel = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AdminTab>("books");

  const tabs = [
    {
      id: "books" as const,
      label: t("admin.books"),
      icon: <FiBookOpen />,
    },
    {
      id: "users" as const,
      label: t("admin.users"),
      icon: <FiUsers />,
    },
    {
      id: "orders" as const,
      label: t("admin.orders"),
      icon: <FiShoppingCart />,
    },
    {
      id: "promos" as const,
      label: t("admin.promos"),
      icon: <FiTag />,
    },
    {
      id: "genres" as const,
      label: "Genres",
      icon: <FiBookmark />,
    },
    {
      id: "publishers" as const,
      label: "Publishers",
      icon: <FiBriefcase />,
    },
    {
      id: "supportChats" as const,
      label: t("admin.supportChats"),
      icon: <FiMessageCircle />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "books":
        return <BookManager />;
      case "users":
        return <UserManager />;
      case "orders":
        return <OrderManager />;
      case "promos":
        return <PromoCodeManager />;
      case "genres":
        return <GenreManager />;
      case "publishers":
        return <PublisherManager />;
      case "supportChats":
        return <SupportChatsPage embedded />;
      default:
        return null;
    }
  };

  return (
    <main className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>{t("admin.title")}</h3>
          <p className={styles.sidebarSubtitle}>
            Manage books, users, orders, publishers, genres and support in one
            place.
          </p>
        </div>

        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? styles.active : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </aside>

      <section className={styles.content}>
        <div className={styles.contentShell}>{renderContent()}</div>
      </section>
    </main>
  );
};

export default AdminPanel;
