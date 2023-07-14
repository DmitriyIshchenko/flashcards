import "./DecksList.scss";
import Button from "../Buttons/Button";
import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";

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

      {/* <button className="deck__btn">&#8230;</button> */}
      <Dropdown
        className="deck__dropdown"
        renderTrigger={(onClick) => (
          <Button round className="dropdown__trigger" onClick={onClick}>
            ...
          </Button>
        )}
        menu={[
          <a href="/edit" className="dropdown__btn">
            Edit
          </a>,
          <button className="dropdown__btn dropdown__btn--delete">
            Delete
          </button>,
        ]}
      />
    </Card>
  );
}
