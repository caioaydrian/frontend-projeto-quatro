import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminTitle } from "../../components/AdminTitle";
import { listUsers } from "../../services/users";
import { listDrinks } from "../../services/drinks";
import { listCategories } from "../../services/categories";
import { listSales } from "../../services/sales";
import { listReviews } from "../../services/ratings";
import styles from "./Dashboard.module.css";

interface StatCounts {
  users: number | null;
  drinks: number | null;
  categories: number | null;
  sales: number | null;
  reviews: number | null;
}

export function Dashboard() {
  const [counts, setCounts] = useState<StatCounts>({
    users: null,
    drinks: null,
    categories: null,
    sales: null,
    reviews: null,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [usersRes, drinksRes, catsRes, salesRes, reviewsRes] = await Promise.allSettled([
          listUsers(1, 1),
          listDrinks(1, 1),
          listCategories(1, 1),
          listSales(1, 1),
          listReviews(1, 1),
        ]);

        setCounts({
          users: usersRes.status === "fulfilled" ? usersRes.value.total : null,
          drinks: drinksRes.status === "fulfilled" ? drinksRes.value.total : null,
          categories: catsRes.status === "fulfilled" ? catsRes.value.total : null,
          sales: salesRes.status === "fulfilled" ? salesRes.value.total : null,
          reviews: reviewsRes.status === "fulfilled" ? reviewsRes.value.total : null,
        });
      } catch (error) {
        void error;
      }
    }

    loadStats();
  }, []);

  const sections = [
    {
      to: "/admin/sales",
      title: "Sales",
      count: counts.sales,
      description: "Track live customer orders, update order status, and review receipts.",
    },
    {
      to: "/admin/drinks",
      title: "Drinks",
      count: counts.drinks,
      description: "Keep the coffee and pastry menu, prices, and stock levels up to date.",
    },
    {
      to: "/admin/categories",
      title: "Categories",
      count: counts.categories,
      description: "Organize drinks into distinct sections to keep the catalog easy to explore.",
    },
    {
      to: "/admin/reviews",
      title: "Reviews",
      count: counts.reviews,
      description: "Monitor customer ratings and moderate feedback across all drinks.",
    },
    {
      to: "/admin/users",
      title: "Users",
      count: counts.users,
      description: "Manage accounts, client registrations, roles, and administrative access.",
    },
  ];

  return (
    <>
      <AdminTitle
        eyebrow="ADMIN DASHBOARD"
        title={
          <>
            Welcome to the <em>console.</em>
          </>
        }
        description="Real-time control over orders, menu, customer feedback, and team accounts."
      />

      <div className={styles.grid}>
        {sections.map((section) => (
          <Link key={section.to} className={styles.card} to={section.to}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{section.title}</h2>
              {section.count !== null && <span className={styles.badge}>{section.count}</span>}
            </div>
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
