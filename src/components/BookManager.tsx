import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Book } from "../types";
import BookForm from "../components/BookForm";
import styles from "../styles/Manager.module.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 10;

const BookManager = () => {
  const { t } = useTranslation();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchBooks = useCallback(async () => {
    try {
      const response = await axios.get("https://localhost:44308/api/books", {
        params: {
          page,
          pageSize: PAGE_SIZE,
          search: searchTerm,
        },
      });

      const data = response.data;
      if (Array.isArray(data.items)) {
        setBooks(data.items);
        setTotalCount(data.totalCount);
      } else if (Array.isArray(data.$values)) {
        setBooks(data.$values);
        setTotalCount(data.$values.length);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error(t("admin.failedFetchBooks"));
    }
  }, [page, searchTerm, t]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://localhost:44308/api/books/${id}`);
      toast.success(t("admin.bookDeleted"));
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error(t("admin.failedDeleteBook"));
    }
  };

  const handleSavedBook = () => {
    fetchBooks();
    setSelectedBook(null);
    toast.success(t("admin.bookSaved"));
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          disabled={i === page}
          className={i === page ? styles.activePage : ""}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className={styles.manager}>
      <h2>{t("admin.bookManagement")}</h2>

      <BookForm book={selectedBook} onSaved={handleSavedBook} />

      <input
        type="text"
        placeholder={t("admin.searchTitle")}
        value={searchTerm}
        onChange={handleSearchChange}
        className={styles.searchInput}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t("common.title")}</th>
            <th>{t("common.author")}</th>
            <th>{t("common.price")}</th>
            <th>{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>${b.price.toFixed(2)}</td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => setSelectedBook(b)}
                >
                  {t("common.edit")}
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(b.id)}
                >
                  {t("common.delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          {t("common.prev")}
        </button>

        {renderPageButtons()}

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={books.length < PAGE_SIZE}
        >
          {t("common.next")}
        </button>
      </div>
    </div>
  );
};

export default BookManager;
