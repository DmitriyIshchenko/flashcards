import "./DecksList.scss";
import Button from "../Buttons/Button";
import Card from "../Card/Card";

export default function DecksList({ decks }) {
  return (
    <div className="decks">
      <ul className="decks-list">
        {decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </ul>
      <Button round type="button" className="decks__add-btn">
        +
      </Button>
    </div>
  );
}

function DeckCard({ deck }) {
  const { title, terms } = deck;
  return (
    <Card className="deck" listItem>
      <h3 className="deck__title">🗂️ {title}</h3>
      <span className="deck__tag">
        {terms.length} term{terms.length === 1 ? "" : "s"}
      </span>

      {/* dropdown */}
      <button className="deck__btn">&#8230;</button>
    </Card>
  );
}
