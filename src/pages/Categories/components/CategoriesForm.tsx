import { useEffect, useState } from "react";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import type { Category } from "../../../types/category";
import type { CategoryInput } from "../../../services/categories";
import styles from "./CategoriesForm.module.css";

interface CategoriesFormProps {
  editingItem: Category | null;
  onSubmit: (data: CategoryInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function CategoriesForm({
  editingItem,
  onSubmit,
  onCancel,
  isSubmitting,
}: CategoriesFormProps) {
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setName(editingItem ? editingItem.name : "");
    setFormError("");
  }, [editingItem]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setFormError("Category name is required.");
      return;
    }

    setFormError("");
    await onSubmit({ name: trimmedName });

    if (!editingItem) {
      setName("");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <Input
          label={editingItem ? "Edit category name" : "New category name"}
          placeholder="e.g. Soft Drinks"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          error={formError}
        />
      </div>
      <div className={styles.actions}>
        <Button type="submit" isLoading={isSubmitting}>
          {editingItem ? "Save changes" : "Create"}
        </Button>
        {editingItem && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default CategoriesForm;
