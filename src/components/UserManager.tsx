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
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://localhost:44308/api/v1/Admin/get-all-users",
        {
          params: {
            page,
            pageSize,
          },
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке пользователей:", err);
    }
  };

  const deleteUser = async (userName: string) => {
    try {
      await axios.delete(
        `https://localhost:44308/api/v1/Admin/delete-user-by-name/${userName}`
      );
      fetchUsers();
    } catch (err) {
      console.error("Ошибка при удалении пользователя:", err);
    }
  };

  const assignAdmin = async (userName: string) => {
    try {
      await axios.post(
        `https://localhost:44308/api/v1/Admin/assign-admin-role-by-name/${userName}`
      );
      fetchUsers();
    } catch (err) {
      console.error("Ошибка при назначении роли админа:", err);
    }
  };

  const removeAdmin = async (userName: string) => {
    try {
      await axios.post(
        `https://localhost:44308/api/v1/Admin/remove-admin-role-by-name/${userName}`
      );
      fetchUsers();
    } catch (err) {
      console.error("Ошибка при удалении роли админа:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

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
            <tr key={u.userName}>
              <td>{u.email}</td>
              <td>{u.roles.join(", ")}</td>
              <td>
                <button onClick={() => assignAdmin(u.userName)}>
                  Make Admin
                </button>
                <button onClick={() => removeAdmin(u.userName)}>
                  Remove Admin
                </button>
                <button onClick={() => deleteUser(u.userName)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default UserManager;
