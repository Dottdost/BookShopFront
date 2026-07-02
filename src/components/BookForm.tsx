import { useEffect, useState } from "react";
import axios from "axios";
import { Book } from "../types/book";
import { useTranslation } from "react-i18next";
import styles from "../styles/Manager.module.css";

interface Props {
  book: Book | null;
  onSaved: () => void;
}

type Option = {
  id: number;
  name: string;
};

const API_URL =
  "http://cheshireshelfapp-env.eba-pzcyg6yq.eu-north-1.elasticbeanstalk.com";

function unwrapArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.$values)) return data.$values;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.$values)) return data.data.$values;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.items?.$values)) return data.items.$values;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data?.items?.$values)) return data.data.items.$values;

  return [];
}

function normalizeOption(item: any): Option {
  return {
    id: Number(item.id ?? item.Id ?? 0),
    name: String(item.name ?? item.Name ?? ""),
  };
}

const BookForm = ({ book, onSaved }: Props) => {
  const { t } = useTranslation();

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

  const [genres, setGenres] = useState<Option[]>([]);
  const [publishers, setPublishers] = useState<Option[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (book) {
      setForm({
        ...book,
        imageFile: undefined,
        genreId: book.genreId ? String(book.genreId) : undefined,
        publisherId: book.publisherId ? String(book.publisherId) : undefined,
      });
    } else {
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
    }

    fetchGenres();
    fetchPublishers();
  }, [book]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/genres/all`);
      const list = unwrapArray<any>(response.data)
        .map(normalizeOption)
        .filter((item) => item.id && item.name);

      setGenres(list);
    } catch (error) {
      console.error("Error fetching genres", error);
    }
  };

  const fetchPublishers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/publishers`);
      const list = unwrapArray<any>(response.data)
        .map(normalizeOption)
        .filter((item) => item.id && item.name);

      setPublishers(list);
    } catch (error) {
      console.error("Error fetching publishers", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value || undefined,
    }));
  };

  const resetForm = () => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() && !form.id) return;
    if (!form.author.trim() && !form.id) return;

    try {
      setSaving(true);

      if (form.id) {
        await axios.patch(`${API_URL}/api/books/${form.id}/stock`, {
          stock: form.stock,
        });

        await axios.patch(`${API_URL}/api/books/${form.id}/price`, {
          price: form.price,
        });
      } else {
        const formData = new FormData();

        formData.append("Title", form.title.trim());
        formData.append("Author", form.author.trim());
        formData.append("Price", String(form.price));
        formData.append("Stock", String(form.stock));
        formData.append("Description", form.description || "");
        formData.append("GenreId", form.genreId ? String(form.genreId) : "");
        formData.append(
          "PublisherId",
          form.publisherId ? String(form.publisherId) : "",
        );

        if (form.imageFile) {
          formData.append("Image", form.imageFile);
        }

        await axios.post(`${API_URL}/api/books`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      onSaved();
      resetForm();
    } catch (error) {
      console.error("Error submitting book:", error);
    } finally {
      setSaving(false);
    }
  };

  const selectedFileText = form.imageFile
    ? t("bookForm.selectedFile", { name: form.imageFile.name })
    : t("bookForm.chooseCover");

  return (
    <form onSubmit={handleSubmit} className={styles.formCard}>
      <h3 className={styles.formTitle}>
        {form.id ? t("bookForm.updatePriceStock") : t("bookForm.addBook")}
      </h3>

      <div className={styles.formGrid}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder={t("bookForm.bookTitle")}
          className={styles.input}
          disabled={!!form.id}
        />

        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder={t("common.author")}
          className={styles.input}
          disabled={!!form.id}
        />

        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          placeholder={t("common.price")}
          className={styles.input}
        />

        <input
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          placeholder={t("details.stock")}
          className={styles.input}
        />

        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder={t("details.description")}
          className={`${styles.input} ${styles.fullField}`}
          disabled={!!form.id}
        />

        <select
          name="genreId"
          value={form.genreId || ""}
          onChange={handleChange}
          className={styles.input}
          disabled={!!form.id}
        >
          <option value="">{t("bookForm.selectGenre")}</option>
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
          className={styles.input}
          disabled={!!form.id}
        >
          <option value="">{t("bookForm.selectPublisher")}</option>
          {publishers.map((publisher) => (
            <option key={publisher.id} value={publisher.id}>
              {publisher.name}
            </option>
          ))}
        </select>

        {!form.id && (
          <div className={styles.fullField}>
            <label htmlFor="image-upload" className={styles.fileButton}>
              {selectedFileText}
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
        )}

        <div className={styles.actionsRow}>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving
              ? "Saving..."
              : form.id
                ? t("bookForm.updatePriceStock")
                : t("bookForm.addBook")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BookForm;
