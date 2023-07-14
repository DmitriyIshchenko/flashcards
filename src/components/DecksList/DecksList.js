import "./DecksList.scss";
import Button from "../UI/Buttons/Button";
import Card from "../UI/Card/Card";
import Dropdown from "../UI/Dropdown/Dropdown";
import { BsThreeDots, BsPlus } from "react-icons/bs";
import { PiCardsDuotone } from "react-icons/pi";

export default function DecksList({ decks }) {
  return (
    <div className="decks">
      <ul className="decks-list">
        {decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </ul>
      <Button round type="button" className="decks__add-btn">
        <BsPlus />
      </Button>
    </div>
  );
}

function DeckCard({ deck }) {
  const { title, terms } = deck;
  return (
    <Card className="deck" listItem>
      <h3 className="deck__title">
        <PiCardsDuotone size={"2.5rem"} /> <span>{title}</span>
      </h3>
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
