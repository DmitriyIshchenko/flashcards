import "./DecksList.scss";
import Button from "../UI/Buttons/Button";
import Card from "../UI/Card/Card";
import Dropdown from "../UI/Dropdown/Dropdown";
import { BsThreeDots, BsPlus } from "react-icons/bs";
import { PiCardsDuotone } from "react-icons/pi";
import { Link } from "react-router-dom";

export default function DecksList({ decks, onDeleteDeck }) {
  return (
    <div className="decks">
      <ul className="decks-list">
        {decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} onDeleteDeck={onDeleteDeck} />
        ))}
      </ul>
      <Link to="new" className="decks__add-btn">
        <BsPlus />
      </Link>
    </div>
  );
}

function DeckCard({ deck, onDeleteDeck }) {
  const { title, terms, id } = deck;
  return (
    <Card className="deck" listItem>
      <Link to={`${id}`}>
        <h3 className="deck__title">
          <PiCardsDuotone size={"2.5rem"} /> <span>{title}</span>
        </h3>
      </Link>
      <span className="deck__tag">
        {terms.length} term{terms.length === 1 ? "" : "s"}
      </span>

      <Dropdown
        className="deck__dropdown"
        renderTrigger={(onClick) => (
          <Button round className="dropdown__trigger" onClick={onClick}>
            <BsThreeDots />
          </Button>
        )}
        menu={[
          <Link to={`edit/${id}`} className="dropdown__btn">
            Edit
          </Link>,
          <button
            className="dropdown__btn dropdown__btn--delete"
            onClick={() => onDeleteDeck(id)}
          >
            Delete
          </button>,
        ]}
      />
    </Card>
  );
}
