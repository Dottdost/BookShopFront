import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../styles/Manager.module.css";

type Genre = {
  id: number;
  name: string;
  parentGenreId: number | null;
  parentName: string | null;
  subGenres: Genre[];
};

type GenreForm = {
  name: string;
  isSub: boolean;
  parentGenreId: number | null;
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

function getToken() {
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token ?? ""}`,
  };
}

function extractError(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) return data;
    if (isRecord(data) && typeof data.message === "string") return data.message;
    if (isRecord(data) && typeof data.title === "string") return data.title;

    return error.message || fallback;
  }

  if (error instanceof Error) return error.message;

  return fallback;
}

function normalizeGenre(item: unknown): Genre | null {
  if (!isRecord(item)) return null;

  const id = Number(item.id ?? item.Id ?? 0);
  const name = String(
    item.name ?? item.genreName ?? item.Name ?? item.GenreName ?? "",
  ).trim();

  const rawParentGenreId = item.parentGenreId ?? item.ParentGenreId;

  const parentGenreId =
    rawParentGenreId === null || rawParentGenreId === undefined
      ? null
      : Number(rawParentGenreId);

  const parentNameRaw = item.parentName ?? item.ParentName;

  const parentName =
    parentNameRaw === null || parentNameRaw === undefined
      ? null
      : String(parentNameRaw);

  if (!id || !name) return null;

  return {
    id,
    name,
    parentGenreId,
    parentName,
    subGenres: [],
  };
}

function buildGenreTree(data: unknown): Genre[] {
  const flatGenres = unwrapArray<unknown>(data)
    .map(normalizeGenre)
    .filter((genre): genre is Genre => genre !== null);

  const byId = new Map<number, Genre>();

  flatGenres.forEach((genre) => {
    byId.set(genre.id, {
      ...genre,
      subGenres: [],
    });
  });

  const parents: Genre[] = [];

  byId.forEach((genre) => {
    if (genre.parentGenreId && byId.has(genre.parentGenreId)) {
      const parent = byId.get(genre.parentGenreId);

      if (parent) {
        parent.subGenres.push(genre);
      }
    } else {
      parents.push(genre);
    }
  });

  return parents;
}

export default function GenreManager() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [form, setForm] = useState<GenreForm>({
    name: "",
    isSub: false,
    parentGenreId: null,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const parentGenres = useMemo(() => genres, [genres]);

  const selectedParent = parentGenres.find(
    (genre) => genre.id === form.parentGenreId,
  );

  const loadGenres = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/api/genres/all`, {
        headers: {
          Accept: "text/plain",
        },
      });

      setGenres(buildGenreTree(response.data));
    } catch (error: unknown) {
      console.error("Error loading genres:", error);
      toast.error(extractError(error, "Failed to load genres"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGenres();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      isSub: false,
      parentGenreId: null,
    });
  };

  const createGenre = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      toast.error("Enter genre name");
      return;
    }

    if (form.isSub && !form.parentGenreId) {
      toast.error("Choose parent genre");
      return;
    }

    try {
      setSaving(true);

      if (form.isSub) {
        await axios.post(
          `${API_URL}/api/genres/createSub`,
          {
            name,
            parentGenreId: form.parentGenreId,
          },
          {
            headers: authHeaders(),
          },
        );

        toast.success("Sub-genre created");
      } else {
        await axios.post(
          `${API_URL}/api/genres/createParent`,
          {
            name,
          },
          {
            headers: authHeaders(),
          },
        );

        toast.success("Genre created");
      }

      resetForm();
      await loadGenres();
    } catch (error: unknown) {
      console.error("Error creating genre:", error);
      toast.error(extractError(error, "Failed to create genre"));
    } finally {
      setSaving(false);
    }
  };

  const deleteParentGenre = async (genre: Genre) => {
    const confirmed = window.confirm(
      `Delete "${genre.name}"? If it has sub-genres, backend may reject it.`,
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/api/genres/delete/${genre.id}`, {
        headers: authHeaders(),
      });

      toast.success("Genre deleted");
      await loadGenres();
    } catch (error: unknown) {
      console.error("Error deleting genre:", error);
      toast.error(extractError(error, "Failed to delete genre"));
    }
  };

  const deleteSubGenre = async (genre: Genre) => {
    const confirmed = window.confirm(`Delete sub-genre "${genre.name}"?`);

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/api/genres/deleteSub/${encodeURIComponent(genre.name)}`,
        {
          headers: authHeaders(),
        },
      );

      toast.success("Sub-genre deleted");
      await loadGenres();
    } catch (error: unknown) {
      console.error("Error deleting sub-genre:", error);
      toast.error(extractError(error, "Failed to delete sub-genre"));
    }
  };

  return (
    <div className={styles.manager}>
      <div className={styles.managerHeader}>
        <div>
          <h2>Genres</h2>

          <p className={styles.managerSubtitle}>
            Create parent genres and sub-genres used in the book catalog.
          </p>
        </div>
      </div>

      <form onSubmit={createGenre} className={styles.form}>
        <input
          value={form.name}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              name: event.target.value,
            }))
          }
          placeholder={form.isSub ? "Sub-genre name" : "Genre name"}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "inherit",
            fontWeight: 600,
          }}
        >
          <input
            type="checkbox"
            checked={form.isSub}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                isSub: event.target.checked,
                parentGenreId: event.target.checked ? prev.parentGenreId : null,
              }))
            }
          />
          Create as sub-genre
        </label>

        {form.isSub && (
          <select
            value={form.parentGenreId ?? ""}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                parentGenreId: event.target.value
                  ? Number(event.target.value)
                  : null,
              }))
            }
          >
            <option value="">Choose parent genre</option>

            {parentGenres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        )}

        <button type="submit" className={styles.submitBtn} disabled={saving}>
          {saving ? "Saving..." : form.isSub ? "Add Sub-genre" : "Add Genre"}
        </button>

        {form.isSub && selectedParent && (
          <p className={styles.managerSubtitle}>
            Parent genre: {selectedParent.name}
          </p>
        )}
      </form>

      {loading ? (
        <p className={styles.emptyState}>Loading genres...</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Genre</th>
                <th>Sub-genres</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {genres.length > 0 ? (
                genres.map((genre) => (
                  <tr key={genre.id}>
                    <td>{genre.name}</td>

                    <td>
                      {genre.subGenres.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                          }}
                        >
                          {genre.subGenres.map((subGenre) => (
                            <span
                              key={subGenre.id}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: "rgba(167, 139, 250, 0.16)",
                              }}
                            >
                              {subGenre.name}

                              <button
                                type="button"
                                onClick={() => deleteSubGenre(subGenre)}
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  color: "#f87171",
                                  cursor: "pointer",
                                  fontWeight: 800,
                                }}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => deleteParentGenre(genre)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className={styles.emptyState}>
                    No genres found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
