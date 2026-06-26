import { useState, useEffect, useCallback } from "react";
import DishCard from "./components/DishCard";
import Toast from "./components/Toast";
import { useWebSocket } from "./hooks/useWebSocket";
import styles from "./App.module.css";

const API_BASE = "http://localhost:8000";

export default function App() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "published" | "unpublished"
  const [toast, setToast] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  // ── Fetch dishes on mount ───────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/dishes`)
      .then((r) => r.json())
      .then((data) => setDishes(data))
      .catch(() => showToast("Failed to load dishes", "info"))
      .finally(() => setLoading(false));
  }, []);

  // ── WebSocket: receive real-time updates ────────────────────────────────────
  const handleWsMessage = useCallback((msg) => {
    if (msg.type === "DISH_UPDATED") {
      setDishes((prev) =>
        prev.map((d) => (d.dishId === msg.dish.dishId ? msg.dish : d))
      );
      showToast(
        `"${msg.dish.dishName}" is now ${msg.dish.isPublished ? "published" : "unpublished"} (live update)`,
        "info"
      );
    }
  }, []);

  useWebSocket(handleWsMessage);

  // ── Toggle handler ──────────────────────────────────────────────────────────
  async function handleToggle(dishId) {
    setTogglingId(dishId);
    try {
      const res = await fetch(`${API_BASE}/dishes/${dishId}/toggle`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();

      // Optimistic update (WS will also broadcast but this is instant)
      setDishes((prev) =>
        prev.map((d) => (d.dishId === updated.dishId ? updated : d))
      );
      showToast(
        `"${updated.dishName}" ${updated.isPublished ? "published" : "unpublished"}`,
        "success"
      );
    } catch {
      showToast("Toggle failed. Try again.", "info");
    } finally {
      setTogglingId(null);
    }
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  // ── Filtered dishes ─────────────────────────────────────────────────────────
  const filtered = dishes.filter((d) => {
    if (filter === "published") return d.isPublished;
    if (filter === "unpublished") return !d.isPublished;
    return true;
  });

  const publishedCount = dishes.filter((d) => d.isPublished).length;
  const unpublishedCount = dishes.length - publishedCount;

  return (
    <div className={styles.layout}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <p className={styles.eyebrow}>Restaurant Management</p>
            <h1 className={styles.title}>Dish Dashboard</h1>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{dishes.length}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={`${styles.stat} ${styles.statGreen}`}>
              <span className={styles.statNum}>{publishedCount}</span>
              <span className={styles.statLabel}>Published</span>
            </div>
            <div className={`${styles.stat} ${styles.statRed}`}>
              <span className={styles.statNum}>{unpublishedCount}</span>
              <span className={styles.statLabel}>Unpublished</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Filters ── */}
      <div className={styles.controls}>
        <div className={styles.filters}>
          {["all", "published", "unpublished"].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className={styles.wsIndicator}>
          <span className={`${styles.wsDot} ${styles.wsLive}`} />
          <span>Live updates on</span>
        </div>
      </div>

      {/* ── Grid ── */}
      <main className={styles.main}>
        {loading ? (
          <div className={styles.center}>
            <div className={styles.bigSpinner} />
            <p className={styles.loadingText}>Loading dishes…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.center}>
            <p className={styles.empty}>No dishes match this filter.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((dish) => (
              <DishCard
                key={dish.dishId}
                dish={dish}
                onToggle={handleToggle}
                loading={togglingId === dish.dishId}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
