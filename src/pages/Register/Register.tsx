import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cleanCPF, formatCPF, validateEmail } from "../../utils/validation";
import styles from "./Register.module.css";

const API_URL = "http://localhost:3000/users";

interface FieldErrors {
  name?: string;
  email?: string;
  cpf?: string;
  password?: string;
  confirmPassword?: string;
}

export function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "cpf" ? formatCPF(value) : value,
    }));

    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    const cpfDigits = cleanCPF(formData.cpf);
    if (!cpfDigits) {
      errors.cpf = "CPF is required.";
    } else if (cpfDigits.length !== 11) {
      errors.cpf = "CPF must contain 11 digits.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          cpf: cleanCPF(formData.cpf),
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg =
          data?.error ||
          data?.message ||
          "An error occurred while creating your account. Please try again.";
        setApiError(errorMsg);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Account created successfully! Redirecting to sign in...");

      setTimeout(() => {
        navigate("/login", {
          state: {
            registered: true,
            email: formData.email.trim().toLowerCase(),
            message: "Account created successfully! Please sign in to continue.",
          },
        });
      }, 1500);
    } catch (err) {
      console.error("Registration request error:", err);
      setApiError("Unable to connect to the server. Please verify the backend is running.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" /> JOIN THE CLUB · NEW MEMBER
          </p>
          <h1 className={styles.title}>
            Create your <em>account.</em>
          </h1>
          <p className={styles.subtitle}>
            Join Dark Coffee Shop to experience something truly special.
          </p>
        </div>

        {apiError && (
          <div className={styles.alertError} role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{apiError}</span>
          </div>
        )}

        {successMessage && (
          <div className={styles.alertSuccess} role="status">
            <span aria-hidden="true">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={`${styles.input} ${fieldErrors.name ? styles.inputError : ""}`}
              placeholder="e.g. Clara Mendes"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting || Boolean(successMessage)}
            />
            {fieldErrors.name && <span className={styles.fieldError}>{fieldErrors.name}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting || Boolean(successMessage)}
            />
            {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="cpf">
              CPF *
            </label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              inputMode="numeric"
              maxLength={14}
              required
              className={`${styles.input} ${fieldErrors.cpf ? styles.inputError : ""}`}
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleChange}
              disabled={isSubmitting || Boolean(successMessage)}
            />
            {fieldErrors.cpf && <span className={styles.fieldError}>{fieldErrors.cpf}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="password">
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className={`${styles.input} ${fieldErrors.password ? styles.inputError : ""}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting || Boolean(successMessage)}
            />
            {fieldErrors.password && (
              <span className={styles.fieldError}>{fieldErrors.password}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="confirmPassword">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className={`${styles.input} ${fieldErrors.confirmPassword ? styles.inputError : ""}`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting || Boolean(successMessage)}
            />
            {fieldErrors.confirmPassword && (
              <span className={styles.fieldError}>{fieldErrors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || Boolean(successMessage)}
          >
            {isSubmitting ? "Creating account..." : "Register ↗"}
          </button>
        </form>

        <div className={styles.footerLinks}>
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
