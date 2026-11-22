import { Button } from "../../../components/Button";
import type { Sale } from "../../../types/sale";
import styles from "./SalesList.module.css";

interface SalesListProps {
  items: Sale[];
  onStatusChange: (sale: Sale, newStatus: string) => void;
  onDelete: (sale: Sale) => void;
  disabled?: boolean;
}

export function SalesList({ items, onStatusChange, onDelete, disabled = false }: SalesListProps) {
  const getBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return styles.statusPending;
      case "ready":
        return styles.statusReady;
      case "completed":
        return styles.statusCompleted;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return "";
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleString("pt-BR");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.list}>
      {items.map((sale) => (
        <div key={sale.id} className={styles.item}>
          <div className={styles.info}>
            <div className={styles.topRow}>
              <span className={styles.saleId}>Sale #{sale.id}</span>
              <span className={styles.totalPrice}>
                {Number(sale.totalPrice).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              <span className={`${styles.statusBadge} ${getBadgeClass(sale.status)}`}>
                {sale.status}
              </span>
            </div>

            <div className={styles.meta}>
              Customer: <strong>{sale.user?.name ?? `User #${sale.userId}`}</strong>
              {sale.user?.email && ` (${sale.user.email})`}
              {sale.createdAt && ` · ${formatDate(sale.createdAt)}`}
            </div>

            {sale.items && sale.items.length > 0 && (
              <div className={styles.itemsList}>
                {sale.items.map((item) => (
                  <span key={item.id} className={styles.itemPill}>
                    {item.quantity}x {item.drink?.name ?? `Drink #${item.drinkId}`} (
                    {Number(item.unitPrice).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                    )
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <select
              className={styles.statusSelect}
              value={sale.status}
              onChange={(e) => onStatusChange(sale, e.target.value)}
              disabled={disabled}
              aria-label={`Change status of sale #${sale.id}`}
            >
              <option value="pending">Pending</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onDelete(sale)}
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

export default SalesList;
