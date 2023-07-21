import "./Message.scss";

import styles from "./Message.module.css";

function Message({ message, isError }) {
  return (
    <p className={styles.message}>
      <span>{isError ? "❌" : "👋"}</span>
      <span>{message}</span>
    </p>
  );
}

export default Message;
