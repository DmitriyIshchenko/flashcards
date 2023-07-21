import styles from "./Spinner.module.css";

function Spinner({ strokeWidth = "8px", size = "6rem" }) {
  return (
    <div className={styles.spinnerContainer}>
      <div
        style={{
          width: size,
          WebkitMask: `radial-gradient(farthest-side, #0000 calc(100% - ${strokeWidth}), #000 0)`,
        }}
        className={styles.spinner}
      ></div>
    </div>
  );
}

export default Spinner;
