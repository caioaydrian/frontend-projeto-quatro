import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "../../contexts/useAuth";
import { useCart } from "../../contexts/useCart";
import { UserMenu } from "../UserMenu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.siteHeader}>
      <NavLink
        className={styles.brand}
        to="/#home"
        aria-label="Dark Coffee Shop home"
        onClick={closeMenu}
      >
        <span className={styles.brandMark} aria-hidden="true">
          D
        </span>
        <span className={styles.brandName}>
          DARK<span>COFFEE SHOP</span>
        </span>
      </NavLink>

      <button
        className={styles.menuToggle}
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
      </button>

      <nav
        className={`${styles.siteNav} ${menuOpen ? styles.isOpen : ""}`}
        aria-label="Main navigation"
      >
        <NavLink to="/#home" onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/#story" onClick={closeMenu}>
          Our Story
        </NavLink>
        <NavLink
          to="/menu"
          className={({ isActive }) =>
            `${styles.menuNavLink} ${isActive ? styles.activeLink : ""}`
          }
          onClick={closeMenu}
        >
          <span>The Menu</span>
          {totalItems > 0 && (
            <span className={styles.bagBadge} title={`${totalItems} items in bag`}>
              {totalItems}
            </span>
          )}
        </NavLink>
        <NavLink to="/#visit" onClick={closeMenu}>
          Find Us
        </NavLink>

        {isAuthenticated ? (
          <UserMenu onAction={closeMenu} />
        ) : (
          <>
            <NavLink to="/login" onClick={closeMenu}>
              Sign In
            </NavLink>
            <NavLink className={styles.navCta} to="/register" onClick={closeMenu}>
              Register <span aria-hidden="true">↗</span>
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
