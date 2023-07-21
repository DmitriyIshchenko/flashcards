import Spinner from "../UI/Spinner/Spinner";

import styles from "./Loader.module.css";

function Loader({ message = "", type, className = "" }) {
  const spinnerProps =
    type === "definition"
      ? {
          strokeWidth: "4px",
          size: "2.5rem",
        }
      : {};

  return (
    <div className={`${styles.loader} ${styles[type]} ${className}`}>
      <Spinner {...spinnerProps} />
      <p>{message}</p>
    </div>
  );
}

export default Loader;
