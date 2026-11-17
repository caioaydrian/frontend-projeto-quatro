import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./AdminHeader.module.css";
import { UserMenu } from "../UserMenu";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/users", label: "Users", end: false },
  { to: "/admin/drinks", label: "Drinks", end: false },
  { to: "/admin/categories", label: "Categories", end: false },
];

export function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.adminHeader}>
      <div className={styles.inner}>
        <Link className={styles.brand} to="/admin" onClick={closeMenu}>
          <span className={styles.brandMark} aria-hidden="true">
            D
          </span>
          <span className={styles.brandName}>
            DARK<span>ADMIN CONSOLE</span>
          </span>
        </Link>

        <button
          className={styles.menuToggle}
          type="button"
          aria-label={menuOpen ? "Close admin navigation menu" : "Open admin navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>

        <nav
          className={`${styles.nav} ${menuOpen ? styles.isOpen : ""}`}
          aria-label="Admin navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}

          <Link className={styles.siteLink} to="/" onClick={closeMenu}>
            View site ↗
          </Link>

          <UserMenu onAction={closeMenu} />
        </nav>
      </div>
    </header>
  );
}

export default AdminHeader;
