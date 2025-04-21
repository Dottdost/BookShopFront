import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/AdminPanel.module.css";

type User = {
  id: string;
  email: string;
  roles: string[];
};

const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://localhost:44308/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке пользователей:", err);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(
        `https://localhost:44308/api/v1/Admin/DeleteUser/${userId}`
      );
      fetchUsers();
    } catch (err) {
      console.error("Ошибка при удалении:", err);
    }
  };

  const assignAdmin = async (userId: string) => {
    try {
      await axios.post(
        `https://localhost:44308/api/v1/Admin/AssignAdmin/${userId}`
      );
      fetchUsers();
    } catch (err) {
      console.error("Ошибка при назначении роли админа:", err);
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      await axios.delete(
        `https://localhost:44308/api/v1/Admin/RemoveAdmin/${userId}`
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
    <div>
      <h3>Users</h3>
      <table className={styles.booksTable}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.roles.join(", ")}</td>
              <td>
                <button onClick={() => assignAdmin(u.id)}>Make Admin</button>
                <button onClick={() => removeAdmin(u.id)}>Remove Admin</button>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
