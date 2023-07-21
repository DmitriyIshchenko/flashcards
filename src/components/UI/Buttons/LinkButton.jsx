import { Link } from "react-router-dom";
import styles from "./Button.module.css";

function LinkButton({ to, category, className = "", children }) {
  return (
    <Link to={to} className={`${styles.btn} ${styles[category]} ${className}`}>
      {children}
    </Link>
  );
}

export default LinkButton;
