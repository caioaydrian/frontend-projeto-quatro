import { Button } from "../../../components/Button";
import type { Category } from "../../../types/category";
import styles from "./CategoriesList.module.css";

interface CategoriesListProps {
  items: Category[];
  onEdit: (item: Category) => void;
  onDelete: (item: Category) => void;
  disabled?: boolean;
}

export function CategoriesList({ items, onEdit, onDelete, disabled = false }: CategoriesListProps) {
  return (
    <div className={styles.list}>
      {items.map((category) => (
        <div key={category.id} className={styles.item}>
          <div className={styles.info}>
            <span className={styles.name}>{category.name}</span>
            <span className={styles.meta}>ID: {category.id}</span>
          </div>
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onEdit(category)}
              disabled={disabled}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onDelete(category)}
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

export default CategoriesList;
