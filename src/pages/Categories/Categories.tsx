import { useEffect, useState } from "react";
import { AdminTitle } from "../../components/AdminTitle";
import { AdminCard } from "../../components/AdminCard";
import { Pagination } from "../../components/Pagination";
import type { Category } from "../../types/category";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
  type CategoryInput,
} from "../../services/categories";
import { CategoriesForm } from "./components/CategoriesForm";
import { CategoriesList } from "./components/CategoriesList";
import styles from "./Categories.module.css";

export function Categories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  async function loadCategories(currentPage: number) {
    try {
      setLoading(true);
      setError("");
      const response = await listCategories(currentPage, 10);
      setItems(response.data);
      setPage(response.page);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories(page);
  }, [page]);

  async function handleCreate(data: CategoryInput) {
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      const response = await createCategory(data);
      setMessage(response.message || "Category created successfully.");
      setEditingItem(null);
      if (page === 1) {
        await loadCategories(1);
      } else {
        setPage(1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(data: CategoryInput) {
    if (!editingItem) return;
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      const response = await updateCategory(editingItem.id, data);
      setMessage(response.message || "Category updated successfully.");
      setEditingItem(null);
      await loadCategories(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update category.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(data: CategoryInput) {
    if (editingItem) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  }

  function handleEdit(item: Category) {
    setEditingItem(item);
    setError("");
    setMessage("");
  }

  function handleCancel() {
    setEditingItem(null);
  }

  async function handleDelete(item: Category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the category "${item.name}"?`
    );
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      const response = await deleteCategory(item.id);
      setMessage(response.message || "Category deleted successfully.");

      if (editingItem?.id === item.id) {
        setEditingItem(null);
      }

      const nextPage = items.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await loadCategories(page);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AdminTitle
        eyebrow="ADMIN · CATEGORIES"
        title="Categories"
        description="Group drinks so the public menu stays easy to browse."
      />

      <AdminCard
        title="Category management"
        description="Create, update, and remove categories used by drinks."
      >
        <CategoriesForm
          editingItem={editingItem}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />

        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p className={styles.stateText}>Loading categories...</p>
        ) : items.length === 0 ? (
          <p className={styles.stateText}>No categories found.</p>
        ) : (
          <>
            <CategoriesList
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

export default Categories;
