import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/validation";
import { getToken, saveToken } from "../../utils/auth";
import { API_BASE_URL } from "../../utils/api";
import styles from "./Login.module.css";

interface LocationState {
  registered?: boolean;
  email?: string;
  message?: string;
}

interface FieldErrors {
  email?: string;
  password?: string;
}

export function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as LocationState) || {};

  const [email, setEmail] = useState(state.email || "");
  const [password, setPassword] = useState("");
  const [infoMessage, setInfoMessage] = useState<string | null>(state.message || null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (getToken()) {
    return <Navigate to="/admin" replace />;
  }

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setInfoMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg =
          data?.error || data?.message || "Unable to sign in right now. Please try again.";
        setApiError(errorMsg);
        setIsSubmitting(false);
        return;
      }

      if (!data?.token) {
        setApiError("Unexpected response from the server. Please try again.");
        setIsSubmitting(false);
        return;
      }

      saveToken(data.token);
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Login request error:", err);
      setApiError("Unable to connect to the server. Please verify the backend is running.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" /> WELCOME BACK · SIGN IN
          </p>
          <h1 className={styles.title}>
            Find your <em>retreat.</em>
          </h1>
          <p className={styles.subtitle}>
            Sign in to manage your orders, favorites, and preferences.
          </p>
        </div>

        {infoMessage && (
          <div className={styles.alertSuccess} role="status">
            <span aria-hidden="true">✓</span>
            <span>{infoMessage}</span>
          </div>
        )}

        {apiError && (
          <div className={styles.alertError} role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{apiError}</span>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                if (apiError) setApiError(null);
                if (infoMessage) setInfoMessage(null);
              }}
              disabled={isSubmitting}
            />
            {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              className={`${styles.input} ${fieldErrors.password ? styles.inputError : ""}`}
              placeholder="Your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password)
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                if (apiError) setApiError(null);
              }}
              disabled={isSubmitting}
            />
            {fieldErrors.password && (
              <span className={styles.fieldError}>{fieldErrors.password}</span>
            )}
          </div>

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In ↗"}
          </button>
        </form>

        <div className={styles.footerLinks}>
          <span>Don&apos;t have an account yet?</span>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
