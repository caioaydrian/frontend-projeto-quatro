import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { cleanCPF, formatCPF, validateEmail } from "../../../utils/validation";
import type { User } from "../../../types/user";
import type { CreateUserInput, UpdateUserInput } from "../../../services/users";
import styles from "./UsersForm.module.css";

interface UsersFormProps {
  editingItem: User | null;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface FieldErrors {
  name?: string;
  email?: string;
  cpf?: string;
  password?: string;
  confirmPassword?: string;
}

export function UsersForm({ editingItem, onSubmit, onCancel, isSubmitting }: UsersFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    confirmPassword: "",
    role: "client",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        email: editingItem.email,
        cpf: formatCPF(editingItem.cpf),
        password: "",
        confirmPassword: "",
        role: editingItem.role || "client",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        cpf: "",
        password: "",
        confirmPassword: "",
        role: "client",
      });
    }
    setFieldErrors({});
  }, [editingItem]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cpf" ? formatCPF(value) : value,
    }));
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validateForm(): boolean {
    const errors: FieldErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const rawCpf = cleanCPF(formData.cpf);

    if (!trimmedName) {
      errors.name = "Full name is required.";
    }

    if (!trimmedEmail) {
      errors.email = "Email is required.";
    } else if (!validateEmail(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!rawCpf) {
      errors.cpf = "CPF is required.";
    } else if (rawCpf.length !== 11) {
      errors.cpf = "CPF must contain 11 digits.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must have at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const rawCpf = cleanCPF(formData.cpf);

    if (editingItem) {
      await onSubmit({
        name: trimmedName,
        email: trimmedEmail,
        cpf: rawCpf,
        password: formData.password,
        role: formData.role,
      });
    } else {
      const success = await onSubmit({
        name: trimmedName,
        email: trimmedEmail,
        cpf: rawCpf,
        password: formData.password,
        role: formData.role,
      });

      if (success) {
        setFormData({
          name: "",
          email: "",
          cpf: "",
          password: "",
          confirmPassword: "",
          role: "client",
        });
        setFieldErrors({});
      }
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
            error={fieldErrors.name}
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
            error={fieldErrors.email}
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
            error={fieldErrors.cpf}
          />
        </div>

        <div className={styles.field}>
          <Input
            label="Password *"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            error={fieldErrors.password}
          />
        </div>

        <div className={styles.field}>
          <Input
            label="Confirm Password *"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isSubmitting}
            error={fieldErrors.confirmPassword}
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
