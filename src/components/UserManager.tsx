import { useEffect, useState } from "react";
import styles from "../styles/Manager.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import {
  AdminUser,
  assignAdminByName,
  deleteUser,
  getErrorMessage,
  getUsers,
  removeAdminByName,
} from "../services/adminApi";
import PrettyConfirm from "./ui/PrettyConfirm";

const PAGE_SIZE = 10;

const UserManager = () => {
  const { t } = useTranslation();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = async (currentPage = page) => {
    try {
      setLoading(true);

      const result = await getUsers(currentPage, PAGE_SIZE);

      console.log("USERS PAGED RESULT:", result);

      setUsers(result.items);
      setPage(result.page);
      setTotalPages(Math.max(1, result.totalPages));
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error(getErrorMessage(error, t("admin.usersLoadError")));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    const confirmed = PrettyConfirm;

    if (!confirmed) return;

    try {
      await deleteUser(user);

      const nextPage =
        users.length === 1 && page > 1 ? Math.max(1, page - 1) : page;

      await fetchUsers(nextPage);

      toast.success(t("admin.userDeleted"));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(getErrorMessage(error, t("admin.deleteUserError")));
    }
  };

  const handleAssignAdmin = async (user: AdminUser) => {
    try {
      await assignAdminByName(user.userName);
      await fetchUsers(page);

      toast.success(t("admin.adminAssigned"));
    } catch (error) {
      console.error("Error assigning admin role:", error);
      toast.error(getErrorMessage(error, t("admin.assignAdminError")));
    }
  };

  const handleRemoveAdmin = async (user: AdminUser) => {
    try {
      await removeAdminByName(user.userName);
      await fetchUsers(page);

      toast.success(t("admin.adminRemoved"));
    } catch (error) {
      console.error("Error removing admin role:", error);
      toast.error(getErrorMessage(error, t("admin.removeAdminError")));
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
    void fetchUsers(page);
  }, [page]);

  return (
    <div className={styles.manager}>
      <h2>{t("admin.userManagement")}</h2>

      <p className={styles.managerSubtitle}>
        Total users: {totalCount} • Page {page} of {totalPages}
        {loading ? ` • ${t("common.loading")}` : ""}
      </p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("auth.username")}</th>
              <th>{t("auth.email")}</th>
              <th>{t("admin.roles")}</th>
              <th>{t("common.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  <td>{user.userName}</td>

                  <td>{user.email}</td>

                  <td>
                    {user.roles.length > 0
                      ? user.roles.join(", ")
                      : t("admin.noRoles")}
                  </td>

                  <td>
                    <button
                      className={styles.editBtn}
                      type="button"
                      onClick={() => handleAssignAdmin(user)}
                    >
                      {t("admin.makeAdmin")}
                    </button>

                    <button
                      className={styles.editBtn}
                      type="button"
                      onClick={() => handleRemoveAdmin(user)}
                    >
                      {t("admin.removeAdmin")}
                    </button>

                    <button
                      className={styles.deleteBtn}
                      type="button"
                      onClick={() => handleDeleteUser(user)}
                    >
                      {t("common.delete")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  {loading ? t("common.loading") : t("admin.noUsers")}
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

export default UserManager;
