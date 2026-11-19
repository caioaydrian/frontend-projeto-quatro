import { useEffect, useState } from "react";
import { AdminTitle } from "../../components/AdminTitle";
import { AdminCard } from "../../components/AdminCard";
import { Pagination } from "../../components/Pagination";
import { listReviews, deleteReview } from "../../services/ratings";
import type { Review } from "../../types/rating";
import { ReviewsList } from "./components/ReviewsList";
import styles from "./Reviews.module.css";

export function Reviews() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  async function loadReviews(currentPage: number) {
    try {
      setLoading(true);
      setError("");
      const response = await listReviews(currentPage, 15);
      setItems(response.data);
      setPage(response.page);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews(page);
  }, [page]);

  async function handleDelete(item: Review) {
    const confirmed = window.confirm(
      `Delete the ${item.rating}-star review by "${item.user?.name ?? "this user"}" for "${item.drink?.name ?? "this drink"}"?`
    );
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      await deleteReview(item.id);
      setMessage("Review deleted successfully.");
      const nextPage = items.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await loadReviews(page);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AdminTitle
        eyebrow="ADMIN · REVIEWS"
        title="Reviews"
        description="Monitor and moderate all customer ratings across the menu."
      />

      <AdminCard
        title="All reviews"
        description={`${total} review${total !== 1 ? "s" : ""} submitted by customers.`}
      >
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p className={styles.stateText}>Loading reviews...</p>
        ) : items.length === 0 ? (
          <p className={styles.stateText}>No reviews found.</p>
        ) : (
          <>
            <ReviewsList
              items={items}
              onDelete={handleDelete}
              disabled={isSubmitting}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              onPageChange={setPage}
            />
          </>
        )}
      </AdminCard>
    </>
  );
}

export default Reviews;
