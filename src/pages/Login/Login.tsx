import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Login.module.css";

interface LocationState {
  registered?: boolean;
  email?: string;
  message?: string;
}

export function Login() {
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const [email, setEmail] = useState(state.email || "");
  const [password, setPassword] = useState("");
  const [infoMessage, setInfoMessage] = useState<string | null>(state.message || null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Sign-in functionality will be implemented in the next sprint!");
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

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              className={styles.input}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (infoMessage) setInfoMessage(null);
              }}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              className={styles.input}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign In ↗
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
