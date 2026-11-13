import { useEffect, useState } from "react";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import type { Drink, DrinkInput } from "../../../types/drink";
import type { Category } from "../../../types/category";
import styles from "./DrinksForm.module.css";

interface DrinksFormProps {
  editingItem: Drink | null;
  categories: Category[];
  onSubmit: (data: DrinkInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function DrinksForm({
  editingItem,
  categories,
  onSubmit,
  onCancel,
  isSubmitting,
}: DrinksFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setPrice(String(editingItem.price));
      setStock(String(editingItem.stock));
      setCategoryId(String(editingItem.categoryId));
    } else {
      setName("");
      setPrice("");
      setStock("");
      setCategoryId("");
    }
    setErrors({});
  }, [editingItem]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
      newErrors.name = "Drink name is required.";
    }

    const parsedPrice = Number(price);
    if (!price || isNaN(parsedPrice) || parsedPrice < 0) {
      newErrors.price = "Price must be a valid non-negative number.";
    }

    const parsedStock = Number(stock);
    if (!stock || isNaN(parsedStock) || parsedStock < 0 || !Number.isInteger(parsedStock)) {
      newErrors.stock = "Stock must be a valid non-negative integer.";
    }

    const parsedCategoryId = Number(categoryId);
    if (!categoryId || isNaN(parsedCategoryId)) {
      newErrors.categoryId = "Category is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmit({
      name: trimmedName,
      price: parsedPrice,
      stock: parsedStock,
      categoryId: parsedCategoryId,
    });

    if (!editingItem) {
      setName("");
      setPrice("");
      setStock("");
      setCategoryId("");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldsGrid}>
        <div>
          <Input
            label="Name"
            placeholder="e.g. Espresso"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            error={errors.name}
            required
          />
        </div>

        <div>
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 4.50"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={isSubmitting}
            error={errors.price}
            required
          />
        </div>

        <div>
          <Input
            label="Stock"
            type="number"
            step="1"
            min="0"
            placeholder="e.g. 100"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            disabled={isSubmitting}
            error={errors.stock}
            required
          />
        </div>

        <div className={styles.selectGroup}>
          <label htmlFor="drink-category" className={styles.label}>
            Category <span className={styles.required}>*</span>
          </label>
          <select
            id="drink-category"
            className={`${styles.select} ${errors.categoryId ? styles.selectError : ""}`}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <span className={styles.error} role="alert">
              {errors.categoryId}
            </span>
          )}
        </div>
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

export default DrinksForm;
