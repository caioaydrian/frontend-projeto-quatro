export function Footer() {
  return (
    <footer className="site-footer">
      <a className="brand footer-brand" href="#home">
        <span className="brand-mark" aria-hidden="true">
          D
        </span>
        <span className="brand-name">
          DARK<span>COFFEE SHOP</span>
        </span>
      </a>
      <p>Take it slow. Stay a little.</p>
      <span className="copyright">© {new Date().getFullYear()} DARK COFFEE SHOP</span>
    </footer>
  );
}
