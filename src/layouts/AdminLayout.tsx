import { Outlet, ScrollRestoration } from "react-router-dom";
import { AdminHeader } from "../components/AdminHeader";
import styles from "./AdminLayout.module.css";

export function AdminLayout() {
  return (
    <div className={styles.adminLayout}>
      <ScrollRestoration />
      <AdminHeader />

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
