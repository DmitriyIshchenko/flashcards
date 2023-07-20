import Card from "../UI/Card/Card";

import styles from "./FlashCard.module.css";

export default function FlashCard({ data, isFlipped, onFlip }) {
  const { term, description } = data;

  return (
    <Card className={styles.flashcard} onClick={onFlip}>
      <h3 className={styles.title}>{isFlipped ? "Description" : "Term"}</h3>
      <p className={isFlipped ? styles.description : styles.term}>
        {isFlipped ? description : term}
      </p>

      <span className={styles.hint}>Click to flip</span>
    </Card>
  );
}
