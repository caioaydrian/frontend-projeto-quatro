import { Button } from "../../../components/Button";
import type { Drink } from "../../../types/drink";
import styles from "./DrinksList.module.css";

interface DrinksListProps {
  items: Drink[];
  onEdit: (item: Drink) => void;
  onDelete: (item: Drink) => void;
  disabled?: boolean;
}

export function DrinksList({ items, onEdit, onDelete, disabled = false }: DrinksListProps) {
  return (
    <div className={styles.list}>
      {items.map((drink) => (
        <div key={drink.id} className={styles.item}>
          <div className={styles.info}>
            <strong className={styles.name}>{drink.name}</strong>
            <div className={styles.meta}>
              <span>ID: {drink.id}</span>
              <span>Category: {drink.category?.name || drink.categoryId}</span>
              <span>Price: ${Number(drink.price).toFixed(2)}</span>
              <span>Stock: {drink.stock}</span>
            </div>
          </div>
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onEdit(drink)}
              disabled={disabled}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onDelete(drink)}
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

export default DrinksList;
