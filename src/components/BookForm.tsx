import React, { useState, useEffect } from "react";
import axios from "axios";
import { Book } from "../types/book";

interface Props {
  book: Book | null;
  onSaved: () => void;
}

const BookForm = ({ book, onSaved }: Props) => {
  const [form, setForm] = useState<Book & { imageFile?: File }>({
    id: 0,
    title: "",
    author: "",
    price: 0,
    stock: 0,
    description: "",
    genreId: undefined,
    publisherId: undefined,
    imageFile: undefined,
  });

  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [publishers, setPublishers] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    if (book) {
      setForm({
        ...book,
        imageFile: undefined,
      });
    }
    fetchGenres();
    fetchPublishers();
  }, [book]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        "https://localhost:44308/api/genres/all"
      );
      const values = response.data?.$values;
      if (Array.isArray(values)) setGenres(values);
    } catch (error) {
      console.error("Error fetching genres", error);
    }
  };

  const fetchPublishers = async () => {
    try {
      const response = await axios.get(
        "https://localhost:44308/api/v1/publishers"
      );
      const values = response.data?.$values;
      if (Array.isArray(values)) setPublishers(values);
    } catch (error) {
      console.error("Error fetching publishers", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (form.id) {
        // Если есть новый файл, используем FormData (PUT с файлом)
        if (form.imageFile) {
          const formData = new FormData();
          formData.append("Title", form.title);
          formData.append("Author", form.author);
          formData.append("Price", String(form.price));
          formData.append("Stock", String(form.stock));
          formData.append("Description", form.description);
          formData.append("GenreId", form.genreId ? String(form.genreId) : "");
          formData.append(
            "PublisherId",
            form.publisherId ? String(form.publisherId) : ""
          );
          formData.append("ImageFile", form.imageFile);

          await axios.put(
            `https://localhost:44308/api/books/${form.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          // Если файла нет, отправляем JSON без imageFile
          await axios.put(`https://localhost:44308/api/books/${form.id}`, {
            title: form.title,
            author: form.author,
            price: form.price,
            stock: form.stock,
            description: form.description,
            genreId: form.genreId ?? null,
            publisherId: form.publisherId ?? null,
            // НЕ отправляем imageFile, чтобы не ломать сервер
          });
        }
      } else {
        // Создание книги (POST) с файлом
        const formData = new FormData();
        formData.append("Title", form.title);
        formData.append("Author", form.author);
        formData.append("Price", String(form.price));
        formData.append("Stock", String(form.stock));
        formData.append("Description", form.description);
        formData.append("GenreId", form.genreId ? String(form.genreId) : "");
        formData.append(
          "PublisherId",
          form.publisherId ? String(form.publisherId) : ""
        );
        if (form.imageFile) {
          formData.append("ImageFile", form.imageFile);
        }

        await axios.post("https://localhost:44308/api/books", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      onSaved();
      setForm({
        id: 0,
        title: "",
        author: "",
        price: 0,
        stock: 0,
        description: "",
        genreId: undefined,
        publisherId: undefined,
        imageFile: undefined,
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    marginBottom: "12px",
    width: "100%",
    borderRadius: "11px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#6A5ACD",
    color: "white",
    padding: "10px",
    fontSize: "16px",
    border: "none",
    borderRadius: "80px",
    cursor: "pointer",
    transition: "0.3s ease",
    width: "100%",
  };

  const formContainer: React.CSSProperties = {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "40px",
    border: "1px solid #ddd",
    borderRadius: "50px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  };

  return (
    <form onSubmit={handleSubmit} style={formContainer}>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Book Title"
        style={inputStyle}
      />
      <input
        name="author"
        value={form.author}
        onChange={handleChange}
        placeholder="Author"
        style={inputStyle}
      />
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        style={inputStyle}
      />
      <input
        name="stock"
        type="number"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock"
        style={inputStyle}
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        style={inputStyle}
      />

      <select
        name="genreId"
        value={form.genreId || ""}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="">Select Genre</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <select
        name="publisherId"
        value={form.publisherId || ""}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="">Select Publisher</option>
        {publishers.map((publisher) => (
          <option key={publisher.id} value={publisher.id}>
            {publisher.name}
          </option>
        ))}
      </select>

      <div style={{ marginBottom: "12px" }}>
        <label
          htmlFor="image-upload"
          style={{
            ...buttonStyle,
            backgroundColor: "#f0f0f0",
            color: "#333",
            display: "inline-block",
            width: "auto",
          }}
        >
          {form.imageFile
            ? `Selected: ${form.imageFile.name}`
            : "Choose Cover Image"}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setForm((prev) => ({
                ...prev,
                imageFile: file,
              }));
            }
          }}
          style={{ display: "none" }}
        />
      </div>

      <button type="submit" style={buttonStyle}>
        {form.id ? "Update Book" : "Add Book"}
      </button>
    </form>
  );
};

export default BookForm;
