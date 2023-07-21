import styles from "./Button.module.css";

export default function Button({
  type = "button",
  category = "",
  className = "",
  onClick,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[category] || ""} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
