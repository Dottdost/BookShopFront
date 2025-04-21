import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Manager.module.css";

interface Review {
  id: string;
  userName: string;
  comment: string;
}

const ReviewManager = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("https://localhost:44308/api/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await axios.delete(
        `https://localhost:44308/api/v1/Admin/DeleteComment/${reviewId}`
      );
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className={styles.manager}>
      <h2>Review Management</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.userName}</td>
              <td>{review.comment}</td>
              <td>
                <button
                  className={styles.delete}
                  onClick={() => handleDelete(review.id)}
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

export default ReviewManager;
