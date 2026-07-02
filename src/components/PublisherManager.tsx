import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../styles/Manager.module.css";
import PrettyConfirm from "./ui/PrettyConfirm";

type Publisher = {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
};

type PublisherForm = {
  name: string;
  address: string;
  phoneNumber: string;
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

function normalizePublisher(item: unknown): Publisher | null {
  if (!isRecord(item)) return null;

  const id = Number(item.id ?? item.Id ?? 0);
  const name = String(item.name ?? item.Name ?? "").trim();
  const address = String(item.address ?? item.Address ?? "").trim();
  const phoneNumber = String(item.phoneNumber ?? item.PhoneNumber ?? "").trim();

  if (!id || !name) return null;

  return {
    id,
    name,
    address,
    phoneNumber,
  };
}

export default function PublisherManager() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(
    null,
  );

  const [form, setForm] = useState<PublisherForm>({
    name: "",
    address: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const loadPublishers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/api/v1/publishers`, {
        headers: {
          Accept: "text/plain",
        },
      });

      const list = unwrapArray<unknown>(response.data)
        .map(normalizePublisher)
        .filter((item): item is Publisher => item !== null);

      setPublishers(list);
    } catch (error: unknown) {
      console.error("Error loading publishers:", error);
      toast.error("Failed to load publishers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPublishers();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      address: "",
      phoneNumber: "",
    });

    setEditingPublisher(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEdit = (publisher: Publisher) => {
    setEditingPublisher(publisher);

    setForm({
      name: publisher.name,
      address: publisher.address,
      phoneNumber: publisher.phoneNumber,
    });
  };

  const savePublisher = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      address: form.address.trim(),
      phoneNumber: form.phoneNumber.trim(),
    };

    if (!payload.name || !payload.address || !payload.phoneNumber) {
      toast.error("Fill publisher name, address and phone number");
      return;
    }

    try {
      if (editingPublisher) {
        await axios.put(
          `${API_URL}/api/v1/publishers/${editingPublisher.id}`,
          payload,
        );

        toast.success("Publisher updated");
      } else {
        await axios.post(`${API_URL}/api/v1/publishers`, payload);

        toast.success("Publisher created");
      }

      resetForm();
      await loadPublishers();
    } catch (error: unknown) {
      console.error("Error saving publisher:", error);
      toast.error("Failed to save publisher");
    }
  };

  const deletePublisher = async (id: number) => {
    const confirmed = PrettyConfirm;

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/api/v1/publishers/${id}`);

      toast.success("Publisher deleted");
      await loadPublishers();
    } catch (error: unknown) {
      console.error("Error deleting publisher:", error);
      toast.error("Failed to delete publisher");
    }
  };

  return (
    <div className={styles.manager}>
      <div className={styles.managerHeader}>
        <div>
          <h2>Publishers</h2>
          <p className={styles.managerSubtitle}>
            Create and manage publishers used when adding books.
          </p>
        </div>
      </div>

      <form onSubmit={savePublisher} className={styles.form}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Publisher name"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
        />

        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone number"
        />

        <button type="submit" className={styles.submitBtn}>
          {editingPublisher ? "Update Publisher" : "Add Publisher"}
        </button>

        {editingPublisher && (
          <button
            type="button"
            className={styles.pageButton}
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p className={styles.emptyState}>Loading publishers...</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {publishers.length > 0 ? (
                publishers.map((publisher) => (
                  <tr key={publisher.id}>
                    <td>{publisher.name}</td>
                    <td>{publisher.address || "—"}</td>
                    <td>{publisher.phoneNumber || "—"}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => openEdit(publisher)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => deletePublisher(publisher.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={styles.emptyState}>
                    No publishers found
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
