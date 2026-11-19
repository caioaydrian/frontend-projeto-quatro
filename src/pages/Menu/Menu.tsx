import { useEffect, useMemo, useState } from "react";
import { listDrinks } from "../../services/drinks";
import { listCategories } from "../../services/categories";
import type { Drink } from "../../types/drink";
import type { Category } from "../../types/category";
import { MenuCard } from "./components/MenuCard";
import { OrderBag } from "./components/OrderBag";
import { useCart } from "../../contexts/useCart";
import styles from "./Menu.module.css";

export function Menu() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, totalPrice, setIsBagOpen } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [drinksRes, catsRes] = await Promise.all([
          listDrinks(1, 100),
          listCategories(1, 100),
        ]);

        setDrinks(drinksRes.data || []);
        setCategories(catsRes.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load menu data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredDrinks = useMemo(() => {
    return drinks.filter((drink) => {
      const matchesCategory =
        selectedCategoryId === null || drink.categoryId === selectedCategoryId;

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        drink.name.toLowerCase().includes(query) ||
        drink.category?.name.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [drinks, selectedCategoryId, searchQuery]);

  return (
    <div className={styles.menuPage}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>
          <span /> CRAFTED WITH CARE
        </p>
        <h1 className={styles.title}>
          The <em>Menu.</em>
        </h1>
        <p className={styles.subtitle}>
          Browse our drinks catalog, customize your order bag, and pick up at the counter.
        </p>
      </header>

      <section className={styles.filterBar}>
        <div className={styles.filterControlsRow}>
          <div className={styles.categoryList} role="tablist" aria-label="Drink categories">
            <button
              type="button"
              className={`${styles.categoryButton} ${
                selectedCategoryId === null ? styles.activeCategory : ""
              }`}
              onClick={() => setSelectedCategoryId(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.categoryButton} ${
                  selectedCategoryId === cat.id ? styles.activeCategory : ""
                }`}
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className={styles.searchInputWrap}>
            <span className={styles.searchIcon} aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search drinks"
            />
          </div>
        </div>

        <div className={styles.resultsMeta}>
          <span>
            Showing {filteredDrinks.length} {filteredDrinks.length === 1 ? "drink" : "drinks"}
          </span>
          {searchQuery && <span>Filtering by &ldquo;{searchQuery}&rdquo;</span>}
        </div>
      </section>

      <div className={styles.layout}>
        <section className={styles.catalogSection} aria-label="Drinks catalog">
          {loading ? (
            <div className={styles.loadingState}>
              <span className={styles.loadingSpinner} aria-hidden="true" />
              <p>Loading menu...</p>
            </div>
          ) : error ? (
            <div className={styles.emptyResults}>
              <h3>Error loading menu</h3>
              <p>{error}</p>
            </div>
          ) : filteredDrinks.length === 0 ? (
            <div className={styles.emptyResults}>
              <h3>No drinks found</h3>
              <p>There are no drinks matching your search criteria.</p>
              <button
                type="button"
                className={styles.resetFiltersButton}
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSearchQuery("");
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredDrinks.map((drink) => (
                <MenuCard key={drink.id} drink={drink} />
              ))}
            </div>
          )}
        </section>

        <OrderBag />
      </div>

      {totalItems > 0 && (
        <div className={styles.mobileFloatingBar}>
          <button
            type="button"
            className={styles.mobileBagButton}
            onClick={() => setIsBagOpen(true)}
            aria-label="Open order bag"
          >
            <span className={styles.mobileBagBadge}>{totalItems}</span>
            <span>View Order Bag</span>
            <span className={styles.mobileBagPrice}>${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
export default Menu;
