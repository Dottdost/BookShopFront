import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../styles/Manager.module.css";

type Genre = {
  id: number;
  name: string;
  parentGenreId?: number | null;
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

  return [];
}

export default function GenreManager() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadGenres = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/api/genres/all`);
      const list = unwrapArray<Genre>(response.data);

      setGenres(list);
    } catch (error) {
      console.error("Error loading genres:", error);
      toast.error("Failed to load genres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  const createGenre = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      toast.error("Genre name is required");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/genres`, {
        name: cleanName,
      });

      toast.success("Genre created");
      setName("");
      await loadGenres();
    } catch (error) {
      console.error("Error creating genre:", error);
      toast.error("Failed to create genre");
    }
  };

  const deleteGenre = async (id: number) => {
    const confirmed = window.confirm("Delete this genre?");

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/api/genres/${id}`);

      toast.success("Genre deleted");
      await loadGenres();
    } catch (error) {
      console.error("Error deleting genre:", error);
      toast.error("Failed to delete genre");
    }
  };

  return (
    <div className={styles.manager}>
      <div className={styles.managerHeader}>
        <div>
          <h2>Genres</h2>
          <p className={styles.managerSubtitle}>
            Create and manage book genres used in the book form.
          </p>
        </div>
      </div>

      <form onSubmit={createGenre} className={styles.form}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Genre name"
        />

        <button type="submit" className={styles.submitBtn}>
          Add Genre
        </button>
      </form>

      {loading ? (
        <p className={styles.emptyState}>Loading genres...</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Parent Genre ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {genres.length > 0 ? (
                genres.map((genre) => (
                  <tr key={genre.id}>
                    <td>{genre.name}</td>
                    <td>{genre.parentGenreId ?? "—"}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => deleteGenre(genre.id)}
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
