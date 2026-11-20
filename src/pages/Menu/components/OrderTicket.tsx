import type { CompletedOrder } from "../../../types/order";
import styles from "./OrderTicket.module.css";

interface OrderTicketProps {
  order: CompletedOrder;
  onNewOrder: () => void;
}

export function OrderTicket({ order, onNewOrder }: OrderTicketProps) {
  const isDineIn = order.mode === "dine-in";

  return (
    <div className={styles.ticket}>
      <div className={styles.ticketHeader}>
        <div>
          <span className={styles.eyebrow}>Order confirmed</span>
          <h3>Order Ticket</h3>
        </div>
        <span className={styles.ticketNumber}>#{order.number}</span>
      </div>

      <div className={styles.modeBadge}>{isDineIn ? "Dine in" : "Take out"}</div>

      <p className={styles.instruction}>
        {isDineIn
          ? "Enjoy your drinks here. Show this ticket at the counter."
          : "Show this ticket at the counter to pick up your order."}
      </p>

      <div className={styles.divider} aria-hidden="true" />

      <ul className={styles.ticketItems}>
        {order.items.map((item) => (
          <li key={item.id} className={styles.ticketItem}>
            <span>
              {item.quantity} × {item.name}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className={styles.ticketTotal}>
        <span>Total</span>
        <strong>${order.total.toFixed(2)}</strong>
      </div>

      <div className={styles.ticketFooter}>
        <span>{order.createdAt}</span>
        <button type="button" onClick={onNewOrder}>
          New order
        </button>
      </div>
    </div>
  );
}
