import { Link } from "react-router-dom";
import { AdminTitle } from "../../components/AdminTitle";
import styles from "./Dashboard.module.css";

const sections = [
  {
    to: "/admin/users",
    title: "Users",
    description: "Create, review, and remove the accounts that can access the shop.",
  },
  {
    to: "/admin/drinks",
    title: "Drinks",
    description: "Keep the drink menu, prices, and availability up to date.",
  },
  {
    to: "/admin/categories",
    title: "Categories",
    description: "Organize the menu into categories so it stays easy to browse.",
  },
];

export function Dashboard() {
  return (
    <>
      <AdminTitle
        eyebrow="ADMIN DASHBOARD"
        title={
          <>
            Welcome to the <em>console.</em>
          </>
        }
        description="Manage the people and the menu behind the counter from one place."
      />

      <div className={styles.grid}>
        {sections.map((section) => (
          <Link key={section.to} className={styles.card} to={section.to}>
            <h2 className={styles.cardTitle}>{section.title}</h2>
            <p className={styles.cardDescription}>{section.description}</p>
            <span className={styles.cardAction}>
              Open {section.title.toLowerCase()} <span aria-hidden="true">↗</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

export default Dashboard;
