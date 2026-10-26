import { useState } from "react";
import { NavLink } from "react-router-dom";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <NavLink className="brand" to="#home" aria-label="Dark Coffee Shop home" onClick={closeMenu}>
        <span className="brand-mark" aria-hidden="true">
          D
        </span>
        <span className="brand-name">
          DARK<span>COFFEE SHOP</span>
        </span>
      </NavLink>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
      </button>

      <nav className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Main navigation">
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
        <NavLink className="nav-cta" to="#menu" onClick={closeMenu}>
          Explore the menu <span aria-hidden="true">↗</span>
        </NavLink>
      </nav>
    </header>
  );
}
