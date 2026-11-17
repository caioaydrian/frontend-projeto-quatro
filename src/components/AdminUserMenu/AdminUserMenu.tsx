import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminUserMenu.module.css";
import { useAuth } from "../../contexts/useAuth";

interface AdminUserMenuProps {
  onAction?: () => void;
}

export function AdminUserMenu({ onAction }: AdminUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) {
    return null;
  }

  const handleSignOut = () => {
    setIsOpen(false);
    onAction?.();
    logout();
    navigate("/login", { replace: true });
  };

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <span className={styles.avatar} aria-hidden="true">
          {userInitial}
        </span>
        <span className={styles.userName}>{user.name}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <div className={styles.dropdownUserName}>{user.name}</div>
            <div className={styles.dropdownUserEmail}>{user.email}</div>
          </div>
          <div className={styles.dropdownDivider} />
          <button
            type="button"
            className={styles.signOutBtn}
            role="menuitem"
            onClick={handleSignOut}
          >
            <svg
              className={styles.signOutIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminUserMenu;
