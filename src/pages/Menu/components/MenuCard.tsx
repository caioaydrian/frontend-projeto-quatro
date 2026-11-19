import type { Drink } from "../../../types/drink";
import { useCart } from "../../../contexts/useCart";
import { DEFAULT_DRINK_IMAGE } from "../../../utils/constants";
import styles from "./MenuCard.module.css";

interface MenuCardProps {
  drink: Drink;
}

export function MenuCard({ drink }: MenuCardProps) {
  const { addItem, items } = useCart();
  const inBagItem = items.find((item) => item.id === drink.id);
  const inBagQty = inBagItem?.quantity ?? 0;
  const imageSrc = drink.imageUrl || DEFAULT_DRINK_IMAGE;

  const handleAdd = () => {
    addItem({
      id: drink.id,
      name: drink.name,
      price: Number(drink.price),
      categoryName: drink.category?.name,
      imageUrl: drink.imageUrl,
    });
  };

  const isOutOfStock = drink.stock <= 0;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={imageSrc}
          alt={drink.name}
          className={styles.image}
          loading="lazy"
        />
        {inBagQty > 0 && (
          <span className={styles.inBagBadge}>{inBagQty} in bag</span>
        )}
      </div>

      <div className={styles.cardBody}>
        <div>
          <span className={styles.categoryTag}>
            {drink.category?.name || "Drink"}
          </span>
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
      </div>
    </article>
  );
}
