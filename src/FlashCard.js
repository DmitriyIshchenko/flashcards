import "./FlashCard.scss";

export default function FlashCard({ data, isFlipped, onFlip }) {
  const { term, description } = data;

  return (
    <article className="flashcard" onClick={onFlip}>
      <h3 className="flashcard__title">{isFlipped ? "Description" : "Term"}</h3>
      <p
        className={`flashcard__content flashcard__content--${
          isFlipped ? "description" : "term"
        }`}
      >
        {isFlipped ? description : term}
      </p>

      <span className="flashcard__hint">Click to flip</span>
    </article>
  );
}
