import { useEffect, useState } from "react";
import { AdminTitle } from "../../components/AdminTitle";
import { AdminCard } from "../../components/AdminCard";
import { Pagination } from "../../components/Pagination";
import type { Drink, DrinkInput } from "../../types/drink";
import type { Category } from "../../types/category";
import {
  createDrink,
  deleteDrink,
  listDrinks,
  updateDrink,
} from "../../services/drinks";
import { listCategories } from "../../services/categories";
import { DrinksForm } from "./components/DrinksForm";
import { DrinksList } from "./components/DrinksList";
import styles from "./Drinks.module.css";

export function Drinks() {
  const [items, setItems] = useState<Drink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingItem, setEditingItem] = useState<Drink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  async function loadDrinks(currentPage: number) {
    try {
      setLoading(true);
      setError("");
      const response = await listDrinks(currentPage, 10);
      setItems(response.data);
      setPage(response.page);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drinks.");
    } finally {
      setLoading(false);
    }
  }

  async function loadAllCategories() {
    try {
      // Fetch categories for the select input
      const response = await listCategories(1, 100);
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }

  useEffect(() => {
    loadAllCategories();
  }, []);

  useEffect(() => {
    loadDrinks(page);
  }, [page]);

  async function handleCreate(data: DrinkInput) {
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      const response = await createDrink(data);
      setMessage(response.message || "Drink created successfully.");
      setEditingItem(null);
      if (page === 1) {
        await loadDrinks(1);
      } else {
        setPage(1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create drink.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(data: DrinkInput) {
    if (!editingItem) return;
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      const response = await updateDrink(editingItem.id, data);
      setMessage(response.message || "Drink updated successfully.");
      setEditingItem(null);
      await loadDrinks(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update drink.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(data: DrinkInput) {
    if (editingItem) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  }

  function handleEdit(item: Drink) {
    setEditingItem(item);
    setError("");
    setMessage("");
  }

  function handleCancel() {
    setEditingItem(null);
  }

  async function handleDelete(item: Drink) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the drink "${item.name}"?`
    );
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      const response = await deleteDrink(item.id);
      setMessage(response.message || "Drink deleted successfully.");

      if (editingItem?.id === item.id) {
        setEditingItem(null);
      }

      const nextPage = items.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await loadDrinks(page);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete drink.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AdminTitle
        eyebrow="ADMIN · DRINKS"
        title="Drinks"
        description="Manage the drinks shown on the public menu."
      />

      <AdminCard
        title="Drink management"
        description="Create, update, and remove drinks, prices, and stock."
      >
        <DrinksForm
          editingItem={editingItem}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />

        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p className={styles.stateText}>Loading drinks...</p>
        ) : items.length === 0 ? (
          <p className={styles.stateText}>No drinks found.</p>
        ) : (
          <>
            <DrinksList
              items={items}
              onEdit={handleEdit}
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

export default Drinks;
