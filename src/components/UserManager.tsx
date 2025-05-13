import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Manager.module.css";

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
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://localhost:44308/api/v1/Admin/get-all-users",
        axiosConfig
      );

      if (res.data && Array.isArray(res.data.$values)) {
        setUsers(res.data.$values);
      } else {
        console.error(
          "Ожидался массив пользователей в $values, но получено:",
          res.data
        );
      }
    } catch (err) {
      console.error("Ошибка при загрузке пользователей:", err);
    }
  };

  const deleteUser = async (userName: string) => {
    try {
      await axios.delete(
        `https://localhost:44308/api/v1/Admin/delete-user-by-name/${userName}`,
        axiosConfig
      );
      fetchUsers();
    } catch (err) {
      console.error("Ошибка при удалении пользователя:", err);
    }
  };

  const assignAdmin = async (userName: string) => {
    try {
      await axios.post(
        `https://localhost:44308/api/v1/Admin/assign-admin-role-by-name/${userName}`,
        null,
        axiosConfig
      );
      fetchUsers();
    } catch (err) {
      console.error("Ошибка при назначении роли админа:", err);
    }
  };

  const removeAdmin = async (userName: string) => {
    try {
      await axios.post(
        `https://localhost:44308/api/v1/Admin/remove-admin-role-by-name/${userName}`,
        null,
        axiosConfig
      );
      fetchUsers();
    } catch (err) {
      console.error("Ошибка при удалении роли админа:", err);
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
                <td>
                  {Array.isArray(u.roles) ? u.roles.join(", ") : "No roles"}
                </td>
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
    </div>
  );
};

export default UserManager;
