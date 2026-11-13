import styles from "./Pagination.module.css";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
}

export function Pagination({ currentPage, totalPages, onPageChange, totalItems }: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= safeTotalPages;

  return (
    <nav className={styles.container} aria-label="Paginação">
      <div className={styles.info}>
        {totalItems !== undefined ? (
          <span>
            Total: <span className={styles.highlight}>{totalItems}</span>{" "}
            {totalItems === 1 ? "registro" : "registros"}
          </span>
        ) : (
          <span>
            Página <span className={styles.highlight}>{currentPage}</span> de{" "}
            <span className={styles.highlight}>{safeTotalPages}</span>
          </span>
        )}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.button}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          aria-label="Página anterior"
        >
          ← Anterior
        </button>

        <span className={styles.pageIndicator}>
          {currentPage} / {safeTotalPages}
        </span>

        <button
          type="button"
          className={styles.button}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          aria-label="Próxima página"
        >
          Próxima →
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
