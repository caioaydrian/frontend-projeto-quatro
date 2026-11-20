import { useRef, useState } from "react";
import { useCart } from "../../../contexts/useCart";
import type { CompletedOrder, OrderMode } from "../../../types/order";
import { DEFAULT_DRINK_IMAGE } from "../../../utils/constants";
import { OrderTicket } from "./OrderTicket";
import styles from "./OrderBag.module.css";

export function OrderBag() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    isBagOpen,
    setIsBagOpen,
  } = useCart();

  const [orderMode, setOrderMode] = useState<OrderMode>("dine-in");
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const orderCounter = useRef(0);

  const handleCheckout = () => {
    if (items.length === 0) return;

    orderCounter.current += 1;
    setCompletedOrder({
      number: String(orderCounter.current).padStart(3, "0"),
      mode: orderMode,
      items: items.map((item) => ({ ...item })),
      total: totalPrice,
      createdAt: new Date().toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    });
    clearCart();
  };

  const closeDrawer = () => setIsBagOpen(false);

  return (
    <>
      <div
        className={`${styles.mobileDrawerOverlay} ${isBagOpen ? styles.drawerOpen : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        className={`${styles.bagContainer} ${isBagOpen ? styles.drawerOpen : ""}`}
        aria-label="Order bag"
      >
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h2>Order Bag</h2>
            <span className={styles.badge}>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            type="button"
            className={styles.closeMobileButton}
            onClick={closeDrawer}
            aria-label="Close bag drawer"
          >
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <strong>{completedOrder ? "Order placed" : "Your bag is empty"}</strong>
            <p>
              {completedOrder
                ? "Your order ticket is ready below."
                : "Select drinks from the menu to add to your order."}
            </p>
          </div>
        ) : (
          <div className={styles.itemsContainer}>
            {items.map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <img
                  src={item.imageUrl || DEFAULT_DRINK_IMAGE}
                  alt={item.name}
                  className={styles.itemThumb}
                  loading="lazy"
                />
                <div className={styles.itemContent}>
                  <div className={styles.itemTop}>
                    <span className={styles.itemName}>{item.name}</span>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      ×
                    </button>
                  </div>

                  {item.categoryName && (
                    <span className={styles.itemCategory}>{item.categoryName}</span>
                  )}

                  <div className={styles.itemBottom}>
                    <div className={styles.qtyControls}>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className={styles.footer}>
          {completedOrder ? (
            <OrderTicket order={completedOrder} onNewOrder={() => setCompletedOrder(null)} />
          ) : (
            <>
              <fieldset className={styles.modeSelector}>
                <legend className={styles.modeLegend}>Order type</legend>
                <div className={styles.modeOptions}>
                  <label
                    className={`${styles.modeOption} ${
                      orderMode === "dine-in" ? styles.modeOptionActive : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderMode"
                      value="dine-in"
                      checked={orderMode === "dine-in"}
                      onChange={() => setOrderMode("dine-in")}
                    />
                    Dine in
                  </label>
                  <label
                    className={`${styles.modeOption} ${
                      orderMode === "take-out" ? styles.modeOptionActive : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderMode"
                      value="take-out"
                      checked={orderMode === "take-out"}
                      onChange={() => setOrderMode("take-out")}
                    />
                    Take out
                  </label>
                </div>
              </fieldset>

              <div className={styles.totalRow}>
                <span>Total:</span>
                <span className={styles.totalAmount}>${totalPrice.toFixed(2)}</span>
              </div>

              <button
                type="button"
                className={styles.checkoutBtn}
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Finalize Order
              </button>

              {items.length > 0 && (
                <button type="button" className={styles.clearBtn} onClick={clearCart}>
                  Clear bag
                </button>
              )}
            </>
          )}
        </footer>
      </aside>
    </>
  );
}
