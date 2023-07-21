import Card from "../UI/Card/Card";

import styles from "./FlashCard.module.css";

export default function FlashCard({ data, isFlipped, onFlip }) {
  const { term, description, image } = data;

  const descriptionSide = (
    <>
      <p className={styles.description}>{description}</p>
      {image?.small && <img className={styles.image} src={image.small} />}
    </>
  );

  const termSide = <p className={styles.term}>{term}</p>;

  return (
    <Card className={styles.flashcard} onClick={onFlip}>
      <h3 className={styles.title}>{isFlipped ? "Description" : "Term"}</h3>
      <div className={styles.content}>
        {isFlipped ? descriptionSide : termSide}
      </div>
      <span className={styles.hint}>Click to flip</span>
    </Card>
  );
}
