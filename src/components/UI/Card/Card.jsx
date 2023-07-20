import styles from "./Card.module.css";

export default function Card({
  className = "",
  listItem = false,
  onClick,
  children,
}) {
  if (listItem)
    return (
      <li className={`${styles.card} ${className}`} onClick={onClick}>
        {children}
      </li>
    );

  return (
    <article className={`${styles.card} ${className}`} onClick={onClick}>
      {children}
    </article>
  );
}
