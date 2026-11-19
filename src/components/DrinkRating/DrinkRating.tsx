import { useEffect, useState } from "react";
import { StarRating } from "../StarRating";
import { listReviews, createReview, updateReview, deleteReview } from "../../services/ratings";
import type { Review } from "../../types/rating";
import { useAuth } from "../../contexts/useAuth";
import styles from "./DrinkRating.module.css";

interface DrinkRatingProps {
  drinkId: number;
}

export function DrinkRating({ drinkId }: DrinkRatingProps) {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hovered, setHovered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await listReviews(1, 100, drinkId);
        if (!cancelled) setReviews(data.data || []);
      } catch {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [drinkId]);

  const userReview = user ? reviews.find((r) => r.userId === user.id) : null;
  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / count : 0;

  async function handleRate(stars: number) {
    if (!isAuthenticated || submitting) return;

    setSubmitting(true);
    try {
      if (userReview) {
        // UPDATE
        const updated = await updateReview(userReview.id, stars);
        setReviews((prev) => prev.map((r) => (r.id === updated.id ? { ...r, rating: updated.rating } : r)));
      } else {
        // CREATE
        const created = await createReview({ drinkId, rating: stars });
        setReviews((prev) => [...prev, created]);
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false);
      setHovered(0);
    }
  }

  async function handleDelete() {
    if (!userReview || submitting) return;

    setSubmitting(true);
    try {
      await deleteReview(userReview.id);
      setReviews((prev) => prev.filter((r) => r.id !== userReview.id));
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className={styles.placeholder} aria-hidden="true" />;

  const displayStars = userReview?.rating ?? 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <StarRating
          value={displayStars}
          interactive={isAuthenticated && !submitting}
          hovered={hovered}
          onChange={handleRate}
          onHover={setHovered}
          onLeave={() => setHovered(0)}
        />

        {count > 0 && (
          <span className={styles.meta}>
            {average.toFixed(1)} <span className={styles.count}>({count})</span>
          </span>
        )}
      </div>

      {!isAuthenticated && (
        <p className={styles.hint}>Sign in to rate this drink.</p>
      )}

      {isAuthenticated && userReview && (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={handleDelete}
          disabled={submitting}
        >
          Remove my rating
        </button>
      )}
    </div>
  );
}
