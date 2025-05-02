import { useEffect, useState } from "react";
import axios from "axios";
import { Book } from "../types";
import BookForm from "../components/BookForm";
import styles from "../styles/Manager.module.css";

const BookManager = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBooks = async () => {
    try {
      const response = await axios.get("https://localhost:44308/api/books");
      if (Array.isArray(response.data.$values)) {
        setBooks(response.data.$values);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://localhost:44308/api/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSavedBook = () => {
    fetchBooks();
    setSelectedBook(null); // Сброс формы
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.manager}>
      <h2>Book Management</h2>

      <BookForm book={selectedBook} onSaved={handleSavedBook} />

      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.price}</td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => setSelectedBook(b)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(b.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookManager;
