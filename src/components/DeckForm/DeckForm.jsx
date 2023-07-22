import { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeftShort, BsPlus } from "react-icons/bs";

import TermInput from "./TermInput";
import Button from "../UI/Buttons/Button";
import SpinnerFullPage from "../UI/Spinner/SpinnerFullPage";
import PageNotFound from "../../pages/PageNotFound";
import { usePrevious } from "../../hooks/usePrevious";
import { useDecks } from "../../contexts/DecksContext";

import styles from "./DeckForm.module.css";

function getEmptyField() {
  return { term: "", description: "", image: null, id: crypto.randomUUID() };
}

function reducer(state, action) {
  switch (action.type) {
    case "setTitle":
      return { ...state, title: action.payload };
    case "setDescription":
      return { ...state, description: action.payload };
    case "fields/add":
      return {
        ...state,
        fields: [...state.fields, getEmptyField()],
      };
    case "fields/delete":
      return {
        ...state,
        fields: state.fields.filter((field) => field.id !== action.payload),
      };
    case "fields/update": {
      const updatedFields = [...state.fields];
      const { field, value, id } = action.payload;
      updatedFields.find((field) => field.id === id)[field] = value;

      return { ...state, fields: updatedFields };
    }
    case "deck/loaded": {
      const { title, description, terms } = action.payload;
      return { ...state, title, description, fields: terms };
    }
    default:
      throw new Error("Unknown action type");
  }
}

const initialState = {
  title: "",
  description: "",
  fields: [getEmptyField()],
};

export default function DeckForm() {
  const { deckId } = useParams();
  const { currentDeck, isLoading, error, createDeck, updateDeck, getDeck } =
    useDecks();
  const navigate = useNavigate();

  const [{ title, description, fields }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const prevFields = usePrevious(fields);

  // no empty descriptions
  const canSave =
    title &&
    description &&
    Object.values(fields)
      .map((field) => field.description)
      .every((description) => description);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!canSave) return;

    const newDeck = {
      title,
      description,
      terms: fields,
    };

    if (!currentDeck) {
      const id = await createDeck(newDeck);
      navigate(`/app/decks/${id}`);
    } else updateDeck(newDeck, deckId);
  }

  useEffect(() => {
    if (!deckId) return;
    if (currentDeck)
      return dispatch({ type: "deck/loaded", payload: currentDeck });

    getDeck(deckId);
  }, [deckId, currentDeck]);

  useEffect(() => {
    if (fields.length <= prevFields?.length || currentDeck) return;

    window.scrollTo(0, document.body.scrollHeight);
  }, [fields, prevFields, currentDeck]);

  if (error) return <PageNotFound />;
  if (isLoading) return <SpinnerFullPage />;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <FormHeader title={title} description={description} dispatch={dispatch}>
        <FormControls deckId={deckId} canSave={canSave} />
        <FormInfo title={title} description={description} dispatch={dispatch} />
      </FormHeader>
      <FormFields>
        {fields.map((field, index) => (
          <TermInput
            key={field.id}
            field={field}
            fieldIndex={index}
            dispatch={dispatch}
            isOnlyItem={fields.length === 1}
          />
        ))}
      </FormFields>
      <Button
        type="submit"
        className="form__submit-btn form__submit-btn--bottom"
        disabled={!canSave}
      >
        {deckId ? "Save" : "Create"}
      </Button>
      <Button
        type="button"
        category="add"
        onClick={() => dispatch({ type: "fields/add" })}
      >
        <BsPlus />
      </Button>
    </form>
  );
}

function FormHeader({ children }) {
  return <header className={styles.header}>{children}</header>;
}

function FormControls({ deckId, canSave }) {
  const navigate = useNavigate();
  return (
    <div className={styles.controls}>
      {deckId && (
        <Button
          type="button"
          category="back"
          onClick={() => navigate(`/app/decks/${deckId}`)}
        >
          <BsArrowLeftShort />
        </Button>
      )}
      <h2 className={styles.title}>
        {deckId ? "Back to deck" : "Create a flashcard deck"}
      </h2>
      <Button type="submit" disabled={!canSave}>
        {deckId ? "Save" : "Create"}
      </Button>
    </div>
  );
}

function FormInfo({ title, description, dispatch }) {
  return (
    <div className={styles.info}>
      <label htmlFor="title" className={styles.label}>
        Title
        <input
          type="text"
          id="title"
          className={styles.deckTitle}
          placeholder="Enter a title"
          value={title}
          onChange={(e) =>
            dispatch({ type: "setTitle", payload: e.target.value })
          }
          required
        />
      </label>

      <label htmlFor="description" className={styles.label}>
        Description
        <input
          type="text"
          id="description"
          className={styles.deckDescription}
          placeholder="Complete a description"
          value={description}
          onChange={(e) =>
            dispatch({ type: "setDescription", payload: e.target.value })
          }
          required
        />
      </label>
    </div>
  );
}

function FormFields({ children }) {
  return <ol className={styles.fields}>{children}</ol>;
}
