import { useEffect, useState } from "react";
import { AdminTitle } from "../../components/AdminTitle";
import { AdminCard } from "../../components/AdminCard";
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

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const data = await listUsers();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreate(data: CreateUserInput) {
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      const response = await createUser(data);
      setMessage(response.message || "User created successfully.");
      setEditingItem(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(data: UpdateUserInput) {
    if (!editingItem) return;
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      const response = await updateUser(editingItem.id, data);
      setMessage(response.message || "User updated successfully.");
      setEditingItem(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(data: CreateUserInput | UpdateUserInput) {
    if (editingItem) {
      await handleUpdate(data as UpdateUserInput);
    } else {
      await handleCreate(data as CreateUserInput);
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

      await loadUsers();
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
          <UsersList
            items={items}
            currentUserId={currentUser?.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
            disabled={isSubmitting}
          />
        )}
      </AdminCard>
    </>
  );
}

export default Users;
