import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { cleanCPF, formatCPF, validateEmail } from "../../../utils/validation";
import type { User } from "../../../types/user";
import type { CreateUserInput, UpdateUserInput } from "../../../services/users";
import styles from "./UsersForm.module.css";

interface UsersFormProps {
  editingItem: User | null;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function UsersForm({
  editingItem,
  onSubmit,
  onCancel,
  isSubmitting,
}: UsersFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    role: "client",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        email: editingItem.email,
        cpf: formatCPF(editingItem.cpf),
        password: "",
        role: editingItem.role || "client",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        cpf: "",
        password: "",
        role: "client",
      });
    }
    setFormError("");
  }, [editingItem]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cpf" ? formatCPF(value) : value,
    }));
    if (formError) setFormError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const rawCpf = cleanCPF(formData.cpf);

    if (!trimmedName) {
      setFormError("Name is required.");
      return;
    }

    if (!editingItem) {
      const trimmedEmail = formData.email.trim();
      if (!trimmedEmail) {
        setFormError("Email is required.");
        return;
      }
      if (!validateEmail(trimmedEmail)) {
        setFormError("Please enter a valid email address.");
        return;
      }
    }

    if (!rawCpf || rawCpf.length !== 11) {
      setFormError("CPF must contain 11 digits.");
      return;
    }

    if (!formData.password) {
      setFormError("Password is required.");
      return;
    }

    if (formData.password.length < 8) {
      setFormError("Password must have at least 8 characters.");
      return;
    }

    setFormError("");

    if (editingItem) {
      await onSubmit({
        name: trimmedName,
        cpf: rawCpf,
        password: formData.password,
        role: formData.role,
      });
    } else {
      await onSubmit({
        name: trimmedName,
        email: formData.email.trim().toLowerCase(),
        cpf: rawCpf,
        password: formData.password,
        role: formData.role,
      });
    }

    if (!editingItem) {
      setFormData({
        name: "",
        email: "",
        cpf: "",
        password: "",
        role: "client",
      });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <div className={styles.field}>
          <Input
            label="Full Name *"
            name="name"
            placeholder="e.g. Jane Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <Input
            label="Email *"
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting || Boolean(editingItem)}
          />
          {editingItem && (
            <span className={styles.hint}>Email cannot be changed once created.</span>
          )}
        </div>

        <div className={styles.field}>
          <Input
            label="CPF *"
            name="cpf"
            placeholder="000.000.000-00"
            maxLength={14}
            value={formData.cpf}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <Input
            label="Password *"
            name="password"
            type="password"
            placeholder={editingItem ? "New or current password" : "At least 8 characters"}
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="user-role-select">
            Role *
          </label>
          <select
            id="user-role-select"
            className={styles.select}
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {formError && <p style={{ color: "#d97b7b", fontSize: "13px" }}>{formError}</p>}

      <div className={styles.actions}>
        <Button type="submit" isLoading={isSubmitting}>
          {editingItem ? "Save changes" : "Create user"}
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

export default UsersForm;
