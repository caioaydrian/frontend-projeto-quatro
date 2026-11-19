import styles from "./StarRating.module.css";

interface StarRatingProps {
  /** Current value (1–5). 0 = no rating. */
  value: number;
  /** If true, renders interactive clickable stars. */
  interactive?: boolean;
  /** Called with the clicked star value (1–5). */
  onChange?: (stars: number) => void;
  /** Hovered star value for interactive mode (controlled externally). */
  hovered?: number;
  onHover?: (stars: number) => void;
  onLeave?: () => void;
  size?: "sm" | "md";
}

export function StarRating({
  value,
  interactive = false,
  onChange,
  hovered,
  onHover,
  onLeave,
  size = "sm",
}: StarRatingProps) {
  const display = hovered || value;

  return (
    <span
      className={`${styles.stars} ${styles[size]}`}
      onMouseLeave={interactive ? onLeave : undefined}
      aria-label={`Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${styles.star} ${display >= star ? styles.filled : styles.empty}`}
          onClick={interactive ? () => onChange?.(star) : undefined}
          onMouseEnter={interactive ? () => onHover?.(star) : undefined}
          disabled={!interactive}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          tabIndex={interactive ? 0 : -1}
        >
          ★
        </button>
      ))}
    </span>
  );
}
