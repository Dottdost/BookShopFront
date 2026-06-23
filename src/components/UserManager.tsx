import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Manager.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

type ApiUser = {
  userName: string;
  email: string;
  roles?: { $values: string[] } | string[] | null;
};

type ApiResponse = {
  $values: ApiUser[];
};

type User = {
  userName: string;
  email: string;
  roles: string[];
};

const UserManager = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);

  const token = localStorage.getItem("accessToken");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
    },
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get<ApiResponse>(
        "https://localhost:44308/api/v1/Admin/get-all-users",
        axiosConfig
      );

      const apiUsers = res.data?.$values ?? [];

      const normalizedUsers: User[] = apiUsers.map((u) => {
        let roles: string[] = [];

        if (u.roles) {
          if (Array.isArray(u.roles)) {
            roles = u.roles;
          } else if (
            typeof u.roles === "object" &&
            Array.isArray((u.roles as { $values: string[] }).$values)
          ) {
            roles = (u.roles as { $values: string[] }).$values;
          }
        }

        return {
          userName: u.userName,
          email: u.email,
          roles,
        };
      });

      setUsers(normalizedUsers);
    } catch (err) {
      console.error("Error loading users:", err);
      toast.error(t("admin.usersLoadError"));
    }
  };

  const deleteUser = async (userName: string) => {
    try {
      await axios.delete(
        `https://localhost:44308/api/v1/Admin/delete-user-by-name/${userName}`,
        axiosConfig
      );
      await fetchUsers();
      toast.success(t("admin.userDeleted"));
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(t("admin.deleteUserError"));
    }
  };

  const assignAdmin = async (userName: string) => {
    try {
      await axios.post(
        `https://localhost:44308/api/v1/Admin/assign-admin-role-by-name/${userName}`,
        null,
        axiosConfig
      );
      await fetchUsers();
      toast.success(t("admin.adminAssigned"));
    } catch (err) {
      console.error("Error assigning admin role:", err);
      toast.error(t("admin.assignAdminError"));
    }
  };

  const removeAdmin = async (userName: string) => {
    try {
      await axios.post(
        `https://localhost:44308/api/v1/Admin/remove-admin-role-by-name/${userName}`,
        null,
        axiosConfig
      );
      await fetchUsers();
      toast.success(t("admin.adminRemoved"));
    } catch (err) {
      console.error("Error removing admin role:", err);
      toast.error(t("admin.removeAdminError"));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.manager}>
      <h2>{t("admin.userManagement")}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t("auth.email")}</th>
            <th>{t("admin.roles")}</th>
            <th>{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.userName}>
                <td>{u.email}</td>
                <td>{u.roles.length > 0 ? u.roles.join(", ") : t("admin.noRoles")}</td>
                <td>
                  <button
                    className={styles.editBtn}
                    onClick={() => assignAdmin(u.userName)}
                  >
                    {t("admin.makeAdmin")}
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() => removeAdmin(u.userName)}
                  >
                    {t("admin.removeAdmin")}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteUser(u.userName)}
                  >
                    {t("common.delete")}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>{t("admin.noUsers")}</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default UserManager;
