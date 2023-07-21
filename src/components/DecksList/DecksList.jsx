import { Link } from "react-router-dom";
import { BsThreeDots, BsPlus } from "react-icons/bs";
import { PiCardsDuotone } from "react-icons/pi";

import Button from "../UI/Buttons/Button";
import Card from "../UI/Card/Card";
import Dropdown from "../UI/Dropdown/Dropdown";
import SpinnerFullPage from "../UI/Spinner/SpinnerFullPage";
import Message from "../UI/Message/Message";

import { useDecks } from "../../contexts/DecksContext";

import "./DecksList.scss";
import LinkButton from "../UI/Buttons/LinkButton";
export default function DecksList() {
  const { decks, isLoading, error } = useDecks();

  if (isLoading) return <SpinnerFullPage />;
  if (error && !decks.length) return <Message isError message={error} />;

  return (
    <div className="decks">
      {decks.length ? (
        <ul className="decks-list">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </ul>
      ) : (
        <Message message="Start learning by creating your first deck of flashcards!" />
      )}
      <LinkButton to="/app/form" className="decks__add-btn" category="add">
        <BsPlus />
      </LinkButton>
    </div>
  );
}

function DeckCard({ deck }) {
  const { title, terms, id } = deck;
  const { deleteDeck } = useDecks();
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
          <Button type="button" category="menu" onClick={onClick}>
            <BsThreeDots />
          </Button>
        )}
        menu={[
          <Link
            to={`/app/form/${id}`}
            className="dropdown__btn"
            key="edit-link"
          >
            Edit
          </Link>,
          <button
            className="dropdown__btn dropdown__btn--delete"
            onClick={() => deleteDeck(id)}
            key="delete-btn"
          >
            Delete
          </button>,
        ]}
      />
    </Card>
  );
}
