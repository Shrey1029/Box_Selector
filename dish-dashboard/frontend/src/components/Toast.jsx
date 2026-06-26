import { useEffect } from "react";
import styles from "./Toast.module.css";

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span>{type === "success" ? "✓" : "⚡"}</span>
      {message}
    </div>
  );
}
