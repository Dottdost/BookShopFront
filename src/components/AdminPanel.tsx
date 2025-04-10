import React, { useEffect, useState } from "react";
import axios from "axios";
import { Book } from "../types";
import BookForm from "../components/BookForm";
import "../styles/AdminPanel.module.css";
const AdminPanel = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchBooks = async () => {
    const response = await axios.get("https://localhost:44308/api/books");
    setBooks(response.data);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`https://localhost:44308/api/books/${id}`);
    fetchBooks();
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <BookForm book={selectedBook} onSaved={fetchBooks} />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Author</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.price}</td>
              <td>
                <div className="action-buttons">
                  <button className="edit" onClick={() => setSelectedBook(b)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(b.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
