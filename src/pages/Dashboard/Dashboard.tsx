import { Link, useNavigate } from "react-router-dom";
import { clearToken } from "../../utils/auth";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardCard}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" /> MEMBERS ONLY · YOUR ACCOUNT
          </p>
          <h1 className={styles.title}>
            Welcome to your <em>corner.</em>
          </h1>
          <p className={styles.subtitle}>
            You are signed in. Your orders, favorites, and preferences live here.
          </p>
        </div>

        <div className={styles.actions}>
          <Link className={styles.primaryButton} to="/">
            Back to the shop ↗
          </Link>
          <button className={styles.secondaryButton} type="button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
