import "./DecksList.scss";

export default function DecksList({ decks }) {
  return (
    <div className="decks">
      <ul className="decks-list">
        {decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </ul>
      <button className="decks__add-btn" type="button">
        +
      </button>
    </div>
  );
}

function DeckCard({ deck }) {
  const { title, terms } = deck;
  return (
    <li className="deck">
      <h3 className="deck__title">🗂️ {title}</h3>
      <span className="deck__tag">
        {terms.length} term{terms.length === 1 ? "" : "s"}
      </span>

      <button className="deck__btn">&#8230;</button>
    </li>
  );
}
