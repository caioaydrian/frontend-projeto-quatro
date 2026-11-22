import { useEffect, useState } from "react";
import { AdminTitle } from "../../components/AdminTitle";
import { AdminCard } from "../../components/AdminCard";
import { Pagination } from "../../components/Pagination";
import { listSales, updateSaleStatus, deleteSale } from "../../services/sales";
import type { Sale } from "../../types/sale";
import { SalesList } from "./components/SalesList";
import styles from "./Sales.module.css";

export function Sales() {
  const [items, setItems] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  async function loadSales(currentPage: number) {
    try {
      setLoading(true);
      setError("");
      const response = await listSales(currentPage, 10);
      setItems(response.data);
      setPage(response.page);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sales.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSales(page);
  }, [page]);

  async function handleStatusChange(sale: Sale, newStatus: string) {
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      await updateSaleStatus(sale.id, newStatus);
      setMessage(`Sale #${sale.id} status updated to "${newStatus}".`);
      await loadSales(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update sale status.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(sale: Sale) {
    const confirmed = window.confirm(
      `Delete Sale #${sale.id} for "${sale.user?.name ?? "User #" + sale.userId}"? This will restore stock.`
    );
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      await deleteSale(sale.id);
      setMessage(`Sale #${sale.id} deleted successfully and stock restored.`);
      const nextPage = items.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await loadSales(page);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete sale.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AdminTitle
        eyebrow="ADMIN · SALES"
        title="Sales"
        description="Monitor, manage orders and update delivery status."
      />

      <AdminCard
        title="All sales"
        description={`${total} sale${total !== 1 ? "s" : ""} placed by customers.`}
      >
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p className={styles.stateText}>Loading sales...</p>
        ) : items.length === 0 ? (
          <p className={styles.stateText}>No sales found.</p>
        ) : (
          <>
            <SalesList
              items={items}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              disabled={isSubmitting}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              onPageChange={setPage}
            />
          </>
        )}
      </AdminCard>
    </>
  );
}

export default Sales;
