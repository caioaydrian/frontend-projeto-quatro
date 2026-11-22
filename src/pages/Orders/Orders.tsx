import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { listSales } from "../../services/sales";
import type { Sale } from "../../types/sale";
import styles from "./Orders.module.css";

const PAGE_SIZE = 10;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BRL",
});

function formatDate(date?: string) {
  if (!date) return "Date unavailable";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function getStatusClass(status: string) {
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
}

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        setLoading(true);
        setError("");
        const response = await listSales(page, PAGE_SIZE);
        if (!isMounted) return;
        setOrders(response.data);
        setTotalPages(response.totalPages);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load your orders.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [page]);

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span aria-hidden="true" />
            <span>Account</span>
          </div>
          <h1 className={styles.title}>
            My <em>Orders</em>
          </h1>
          <p className={styles.subtitle}>
            Check the drinks you ordered, the amounts paid and when each order was placed.
          </p>
        </header>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className={styles.stateText}>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p className={styles.stateText}>You have no orders yet.</p>
        ) : (
          <>
            <div className={styles.list}>
              {orders.map((order) => (
                <article key={order.id} className={styles.order}>
                  <div className={styles.orderHeader}>
                    <div>
                      <h2 className={styles.orderTitle}>Order #{order.id}</h2>
                      <p className={styles.orderDate}>Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`${styles.status} ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <ul className={styles.items}>
                      {order.items.map((item) => (
                        <li key={item.id} className={styles.item}>
                          <span>
                            {item.quantity}x {item.drink?.name ?? `Drink #${item.drinkId}`}
                          </span>
                          <span className={styles.itemPrice}>
                            {currencyFormatter.format(Number(item.unitPrice) * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className={styles.total}>
                    <span>Total</span>
                    <strong>{currencyFormatter.format(Number(order.totalPrice))}</strong>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() => setPage((current) => current - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() => setPage((current) => current + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        <p className={styles.note}>Orders are read-only and cannot be deleted from this page.</p>
      </div>
    </div>
  );
}

export default Orders;
