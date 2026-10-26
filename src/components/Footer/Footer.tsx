import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <a className={styles.brand} href="#home">
        <span className={styles.brandMark} aria-hidden="true">
          D
        </span>
        <span className={styles.brandName}>
          DARK<span>COFFEE SHOP</span>
        </span>
      </a>
      <p className={styles.tagline}>Take it slow. Stay a little.</p>
      <span className={styles.copyright}>© {new Date().getFullYear()} DARK COFFEE SHOP</span>
    </footer>
  );
}
