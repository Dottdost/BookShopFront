import React, { useState, useEffect } from "react";
import axios from "axios";
import { Book } from "../types/book";

interface Props {
  book: Book | null;
  onSaved: () => void;
}

const BookForm = ({ book, onSaved }: Props) => {
  const [form, setForm] = useState<Book>({
    id: 0,
    title: "",
    author: "",
    price: 0,
    stock: 0,
    description: "",
    imageUrl: "",
    genreName: "",
    publisherName: "",
  });

  useEffect(() => {
    if (book) setForm(book);
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      await axios.put(`https://localhost:44308/api/books/${form.id}`, form);
    } else {
      await axios.post("https://localhost:44308/api/books", form);
    }
    onSaved();
    setForm({
      id: 0,
      title: "",
      author: "",
      price: 0,
      stock: 0,
      description: "",
      imageUrl: "",
      genreName: "",
      publisherName: "",
    });
  };

  const buttonStyle = {
    backgroundColor: "#6A5ACD",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#8A2BE2",
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="author"
        value={form.author}
        onChange={handleChange}
        placeholder="Author"
      />
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
      />
      <input
        name="stock"
        type="number"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock"
      />
      <input
        name="imageUrl"
        value={form.imageUrl}
        onChange={handleChange}
        placeholder="URL image"
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        name="genreName"
        value={form.genreName}
        onChange={handleChange}
        placeholder="Genre"
      />
      <input
        name="publisherName"
        value={form.publisherName}
        onChange={handleChange}
        placeholder="Publisher"
      />
      <button
        type="submit"
        style={buttonStyle}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor =
            buttonHoverStyle.backgroundColor)
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)
        }
      >
        {form.id ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default BookForm;
