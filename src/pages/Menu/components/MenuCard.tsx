import type { Drink } from "../../../types/drink";
import { useCart } from "../../../contexts/useCart";
import styles from "./MenuCard.module.css";

interface MenuCardProps {
  drink: Drink;
}

export function MenuCard({ drink }: MenuCardProps) {
  const { addItem, items } = useCart();
  const inBagItem = items.find((item) => item.id === drink.id);
  const inBagQty = inBagItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem({
      id: drink.id,
      name: drink.name,
      price: Number(drink.price),
      categoryName: drink.category?.name,
    });
  };

  const isOutOfStock = drink.stock <= 0;

  return (
    <article className={styles.card}>
      <div>
        <div className={styles.topRow}>
          <span className={styles.categoryTag}>
            {drink.category?.name || "Drink"}
          </span>
          {inBagQty > 0 && (
            <span className={styles.inBagBadge}>{inBagQty} in bag</span>
          )}
        </div>

        <h3 className={styles.name}>{drink.name}</h3>
        <p className={styles.stock}>
          {isOutOfStock ? "Out of stock" : `${drink.stock} in stock`}
        </p>
      </div>

      <div className={styles.footer}>
        <span className={styles.price}>${Number(drink.price).toFixed(2)}</span>
        <button
          type="button"
          className={styles.addButton}
          onClick={handleAdd}
          disabled={isOutOfStock}
          aria-label={`Add ${drink.name} to order`}
        >
          <span>+</span>
          <span>{inBagQty > 0 ? "Add another" : "Add to order"}</span>
        </button>
      </div>
    </article>
  );
}
