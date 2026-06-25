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

const UserManager = () => {
  const { t } = useTranslation();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const result = await getUsers();
      setUsers(result);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error(getErrorMessage(error, t("admin.usersLoadError")));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    const confirmed = window.confirm(`Delete user "${user.userName}"?`);

    if (!confirmed) return;

    try {
      await deleteUser(user);
      await fetchUsers();

      toast.success(t("admin.userDeleted"));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(getErrorMessage(error, t("admin.deleteUserError")));
    }
  };

  const handleAssignAdmin = async (user: AdminUser) => {
    try {
      await assignAdminByName(user.userName);
      await fetchUsers();

      toast.success(t("admin.adminAssigned"));
    } catch (error) {
      console.error("Error assigning admin role:", error);
      toast.error(getErrorMessage(error, t("admin.assignAdminError")));
    }
  };

  const handleRemoveAdmin = async (user: AdminUser) => {
    try {
      await removeAdminByName(user.userName);
      await fetchUsers();

      toast.success(t("admin.adminRemoved"));
    } catch (error) {
      console.error("Error removing admin role:", error);
      toast.error(getErrorMessage(error, t("admin.removeAdminError")));
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  return (
    <div className={styles.manager}>
      <h2>{t("admin.userManagement")}</h2>

      {loading && (
        <p className={styles.managerSubtitle}>{t("common.loading")}</p>
      )}

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
                      onClick={() => handleAssignAdmin(user)}
                    >
                      {t("admin.makeAdmin")}
                    </button>

                    <button
                      className={styles.editBtn}
                      onClick={() => handleRemoveAdmin(user)}
                    >
                      {t("admin.removeAdmin")}
                    </button>

                    <button
                      className={styles.deleteBtn}
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

      <ToastContainer />
    </div>
  );
};

export default UserManager;
