import type { ReactNode } from "react";
import styles from "./AdminCard.module.css";

interface AdminCardProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function AdminCard({ title, description, children }: AdminCardProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardDescription}>{description}</p>
      {children}
    </div>
  );
}

export default AdminCard;
