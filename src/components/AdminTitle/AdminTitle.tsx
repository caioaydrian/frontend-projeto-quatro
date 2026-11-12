import type { ReactNode } from "react";
import styles from "./AdminTitle.module.css";

interface AdminTitleProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
}

export function AdminTitle({ eyebrow, title, description }: AdminTitleProps) {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>
        <span aria-hidden="true" /> {eyebrow}
      </p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </header>
  );
}

export default AdminTitle;
