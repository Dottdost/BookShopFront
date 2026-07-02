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

type ApiArrayResponse<T> = {
  $values?: T[];
  data?: T[] | { $values?: T[] };
  items?: T[] | { $values?: T[] };
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://cheshireshelfapp-env.eba-pzcyg6yq.eu-north-1.elasticbeanstalk.com";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unwrapArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];

  if (!isRecord(data)) return [];

  const response = data as ApiArrayResponse<T>;

  if (Array.isArray(response.$values)) return response.$values;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.items)) return response.items;

  if (isRecord(response.data) && Array.isArray(response.data.$values)) {
    return response.data.$values as T[];
  }

  if (isRecord(response.items) && Array.isArray(response.items.$values)) {
    return response.items.$values as T[];
  }

  return [];
}

function normalizeOption(item: unknown): Option | null {
  if (!isRecord(item)) return null;

  const id = Number(item.id ?? item.Id ?? 0);
  const name = String(item.name ?? item.Name ?? "").trim();

  if (!id || !name) return null;

  return { id, name };
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

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/genres/all`, {
        headers: {
          Accept: "text/plain",
        },
      });

      const list = unwrapArray<unknown>(response.data)
        .map(normalizeOption)
        .filter((item): item is Option => item !== null);

      setGenres(list);
    } catch (error: unknown) {
      console.error("Error fetching genres:", error);
      setGenres([]);
    }
  };

  const fetchPublishers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/publishers`, {
        headers: {
          Accept: "text/plain",
        },
      });

      const list = unwrapArray<unknown>(response.data)
        .map(normalizeOption)
        .filter((item): item is Option => item !== null);

      setPublishers(list);
    } catch (error: unknown) {
      console.error("Error fetching publishers:", error);
      setPublishers([]);
    }
  };

  useEffect(() => {
    if (book) {
      setForm({
        ...book,
        genreId: book.genreId ? String(book.genreId) : undefined,
        publisherId: book.publisherId ? String(book.publisherId) : undefined,
        imageFile: undefined,
      });
    } else {
      resetForm();
    }

    void fetchGenres();
    void fetchPublishers();
  }, [book]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value || undefined,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.id && !form.title.trim()) return;
    if (!form.id && !form.author.trim()) return;

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
    } catch (error: unknown) {
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
          className={styles.input}
          disabled={!!form.id}
        >
          <option value="">Select Publisher</option>
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
              onChange={(event) => {
                const file = event.target.files?.[0];

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
