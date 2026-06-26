import styles from "./DishCard.module.css";

export default function DishCard({ dish, onToggle, loading }) {
  return (
    <div className={`${styles.card} ${dish.isPublished ? styles.published : styles.unpublished}`}>
      <div className={styles.imageWrap}>
        <img
          src={dish.imageUrl}
          alt={dish.dishName}
          className={styles.image}
          onError={(e) => {
            e.target.src = `https://placehold.co/400x260/1a1a1a/888?text=${encodeURIComponent(dish.dishName)}`;
          }}
        />
        <span className={`${styles.badge} ${dish.isPublished ? styles.badgePublished : styles.badgeUnpublished}`}>
          {dish.isPublished ? "Published" : "Unpublished"}
        </span>
      </div>

      <div className={styles.body}>
        <p className={styles.id}>DISH #{dish.dishId}</p>
        <h2 className={styles.name}>{dish.dishName}</h2>

        <button
          className={`${styles.btn} ${dish.isPublished ? styles.btnUnpublish : styles.btnPublish}`}
          onClick={() => onToggle(dish.dishId)}
          disabled={loading}
        >
          {loading ? (
            <span className={styles.spinner} />
          ) : dish.isPublished ? (
            "Unpublish"
          ) : (
            "Publish"
          )}
        </button>
      </div>
    </div>
  );
}
