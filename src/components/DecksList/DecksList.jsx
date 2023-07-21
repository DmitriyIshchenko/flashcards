import { Link } from "react-router-dom";
import { BsThreeDots, BsPlus } from "react-icons/bs";
import { PiCardsDuotone } from "react-icons/pi";

import Button from "../UI/Buttons/Button";
import LinkButton from "../UI/Buttons/LinkButton";
import Card from "../UI/Card/Card";
import Dropdown from "../UI/Dropdown/Dropdown";
import SpinnerFullPage from "../UI/Spinner/SpinnerFullPage";
import Message from "../UI/Message/Message";

import { useDecks } from "../../contexts/DecksContext";

import styles from "./DecksList.module.css";
import dropdown from "../UI/Dropdown/Dropdown.module.css";

export default function DecksList() {
  const { decks, isLoading, error } = useDecks();

  if (isLoading) return <SpinnerFullPage />;
  if (error && !decks.length) return <Message isError message={error} />;

  return (
    <div>
      {decks.length ? (
        <ul className={styles.list}>
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
    <Card className={styles.deck} listItem>
      <Link to={`${id}`}>
        <h3 className={styles.title}>
          <PiCardsDuotone size={"2.5rem"} /> <span>{title}</span>
        </h3>
      </Link>
      <span className={styles.tag}>
        {terms.length} term{terms.length === 1 ? "" : "s"}
      </span>

      <Dropdown
        className={styles.dropdown}
        renderTrigger={(onClick) => (
          <Button type="button" category="menu" onClick={onClick}>
            <BsThreeDots />
          </Button>
        )}
        menu={[
          <Link
            to={`/app/form/${id}`}
            className={dropdown.option}
            key="edit-link"
          >
            Edit
          </Link>,
          <button
            className={`${dropdown.option} ${dropdown.delete}`}
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
