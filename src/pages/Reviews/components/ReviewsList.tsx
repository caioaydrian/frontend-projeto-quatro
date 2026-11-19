import { Button } from "../../../components/Button";
import { StarRating } from "../../../components/StarRating";
import type { Review } from "../../../types/rating";
import styles from "./ReviewsList.module.css";

interface ReviewsListProps {
  items: Review[];
  onDelete: (item: Review) => void;
  disabled?: boolean;
}

export function ReviewsList({ items, onDelete, disabled = false }: ReviewsListProps) {
  return (
    <div className={styles.list}>
      {items.map((review) => (
        <div key={review.id} className={styles.item}>
          <div className={styles.info}>
            <div className={styles.topRow}>
              <StarRating value={review.rating} size="sm" />
              <span className={styles.drinkName}>{review.drink?.name ?? `Drink #${review.drinkId}`}</span>
            </div>
            <span className={styles.meta}>
              by <strong>{review.user?.name ?? `User #${review.userId}`}</strong>
              {review.comment && <> · &ldquo;{review.comment}&rdquo;</>}
            </span>
          </div>
          <div className={styles.actions}>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onDelete(review)}
              disabled={disabled}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewsList;
