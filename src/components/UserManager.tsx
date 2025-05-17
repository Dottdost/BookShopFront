import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Manager.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        // Получаем роли с учётом возможных вариантов
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
      console.error("Ошибка при загрузке пользователей:", err);
      toast.error("Error loading users.");
    }
  };

  const deleteUser = async (userName: string) => {
    try {
      await axios.delete(
        `https://localhost:44308/api/v1/Admin/delete-user-by-name/${userName}`,
        axiosConfig
      );
      await fetchUsers();
      toast.success("Пользователь удален.");
    } catch (err) {
      console.error("Ошибка при удалении пользователя:", err);
      toast.error("Error deleting user.");
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
      toast.success("Роль админа назначена.");
    } catch (err) {
      console.error("Ошибка при назначении роли админа:", err);
      toast.error("Error assigning admin role.");
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
      toast.success("Роль админа удалена.");
    } catch (err) {
      console.error("Ошибка при удалении роли админа:", err);
      toast.error("Error while deleting admin role.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.manager}>
      <h2>User Management</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.userName}>
                <td>{u.email}</td>
                <td>{u.roles.length > 0 ? u.roles.join(", ") : "No roles"}</td>
                <td>
                  <button
                    className={styles.editBtn}
                    onClick={() => assignAdmin(u.userName)}
                  >
                    Make Admin
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() => removeAdmin(u.userName)}
                  >
                    Remove Admin
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteUser(u.userName)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No users available</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default UserManager;
