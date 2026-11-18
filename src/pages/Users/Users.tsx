import { useEffect, useState } from "react";
import { AdminTitle } from "../../components/AdminTitle";
import { AdminCard } from "../../components/AdminCard";
import { Pagination } from "../../components/Pagination";
import { useAuth } from "../../contexts/useAuth";
import type { User } from "../../types/user";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
  type CreateUserInput,
  type UpdateUserInput,
} from "../../services/users";
import { UsersForm } from "./components/UsersForm";
import { UsersList } from "./components/UsersList";
import styles from "./Users.module.css";

export function Users() {
  const { user: currentUser } = useAuth();
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingItem, setEditingItem] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  async function loadUsers(currentPage: number) {
    try {
      setLoading(true);
      setError("");
      const response = await listUsers(currentPage, 10);
      setItems(response.data || []);
      setPage(response.page || 1);
      setTotalPages(response.totalPages || 1);
      setTotal(response.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers(page);
  }, [page]);

  async function handleCreate(data: CreateUserInput): Promise<boolean> {
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      const response = await createUser(data);
      setMessage(response.message || "User created successfully.");
      setEditingItem(null);
      if (page === 1) {
        await loadUsers(1);
      } else {
        setPage(1);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(data: UpdateUserInput): Promise<boolean> {
    if (!editingItem) return false;
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      const response = await updateUser(editingItem.id, data);
      setMessage(response.message || "User updated successfully.");
      setEditingItem(null);
      await loadUsers(page);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(data: CreateUserInput | UpdateUserInput): Promise<boolean> {
    if (editingItem) {
      return await handleUpdate(data as UpdateUserInput);
    } else {
      return await handleCreate(data as CreateUserInput);
    }
  }

  function handleEdit(item: User) {
    setEditingItem(item);
    setError("");
    setMessage("");
  }

  function handleCancel() {
    setEditingItem(null);
  }

  async function handleDelete(item: User) {
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${item.name}"?`
    );
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      const response = await deleteUser(item.id);
      setMessage(response.message || "User deleted successfully.");

      if (editingItem?.id === item.id) {
        setEditingItem(null);
      }

      const nextPage = items.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await loadUsers(page);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AdminTitle
        eyebrow="ADMIN · USERS"
        title="Users"
        description="Create, review, and remove the accounts that can access the shop."
      />

      <AdminCard
        title="User management"
        description="Register new accounts or maintain existing users, roles, and credentials."
      >
        <UsersForm
          editingItem={editingItem}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />

        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p className={styles.stateText}>Loading users...</p>
        ) : items.length === 0 ? (
          <p className={styles.stateText}>No users found.</p>
        ) : (
          <>
            <UsersList
              items={items}
              currentUserId={currentUser?.id}
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

export default Users;
