import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.siteHeader}>
      <NavLink
        className={styles.brand}
        to="#home"
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
        <NavLink to="#home" onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="#story" onClick={closeMenu}>
          Our Story
        </NavLink>
        <NavLink to="#menu" onClick={closeMenu}>
          The Menu
        </NavLink>
        <NavLink to="#visit" onClick={closeMenu}>
          Find Us
        </NavLink>
        <NavLink className={styles.navCta} to="/register" onClick={closeMenu}>
          Register <span aria-hidden="true">↗</span>
        </NavLink>
      </nav>
    </header>
  );
}
