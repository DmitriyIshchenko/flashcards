import { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeftShort, BsPlus } from "react-icons/bs";

import TermInput from "./TermInput";
import Button from "../UI/Buttons/Button";
import SpinnerFullPage from "../UI/Spinner/SpinnerFullPage";
import { usePrevious } from "../../hooks/usePrevious";
import { useDecks } from "../../contexts/DecksContext";

import "./DeckForm.scss";

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
    case "fields/update":
      const updatedFields = [...state.fields];
      const { field, value, id } = action.payload;
      updatedFields.find((field) => field.id === id)[field] = value;

      return { ...state, fields: updatedFields };
    default:
      throw new Error("Unknown action type");
  }
}

export default function DeckForm() {
  const { decks, isLoading, createDeck, updateDeck } = useDecks();
  const { deckId } = useParams();
  const deckToEdit = decks.find((deck) => deck.id === deckId);
  const navigate = useNavigate();

  const initialState = {
    title: deckToEdit?.title || "",
    description: deckToEdit?.description || "",
    fields: deckToEdit?.terms || [getEmptyField()],
  };

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

    if (!deckToEdit) {
      const id = await createDeck(newDeck);
      navigate(`/app/decks/${id}`);
    } else updateDeck(newDeck, deckId);
  }

  useEffect(() => {
    if (fields.length <= prevFields?.length || deckToEdit) return;

    window.scrollTo(0, document.body.scrollHeight);
  }, [fields, prevFields, deckToEdit]);

  if (isLoading) return <SpinnerFullPage />;

  return (
    <form
      className={`form ${isLoading ? "loading" : ""}`}
      onSubmit={handleSubmit}
    >
      <FormHeader title={title} description={description} dispatch={dispatch}>
        <FormControls deckToEdit={deckToEdit} canSave={canSave} />
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
        {deckToEdit ? "Save" : "Create"}
      </Button>

      <Button
        round
        className="form__add-btn"
        type="button"
        onClick={() => dispatch({ type: "fields/add" })}
      >
        <BsPlus />
      </Button>
    </form>
  );
}

function FormHeader({ children }) {
  return <header className="form__header">{children}</header>;
}

function FormControls({ deckToEdit, canSave }) {
  const navigate = useNavigate();
  return (
    <div className="form__controls">
      {deckToEdit && (
        <Button
          round
          className="form__back-btn"
          onClick={() => navigate(`/app/decks/${deckToEdit.id}`)}
        >
          <BsArrowLeftShort />
        </Button>
      )}
      <h2 className="form__title">
        {deckToEdit ? "Back to deck" : "Create a flashcard deck"}
      </h2>
      <Button
        type="submit"
        className="form__submit-btn form__submit-btn--top"
        disabled={!canSave}
      >
        {deckToEdit ? "Save" : "Create"}
      </Button>
    </div>
  );
}

function FormInfo({ title, description, dispatch }) {
  return (
    <div className="form__info">
      <label htmlFor="title" className="form__label">
        Title
        <input
          type="text"
          id="title"
          className="form__input"
          placeholder="Enter a title"
          value={title}
          onChange={(e) =>
            dispatch({ type: "setTitle", payload: e.target.value })
          }
          required
        />
      </label>

      <label htmlFor="description" className="form__label">
        Description
        <input
          type="text"
          id="description"
          className="form__input"
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
  return <ol className="form__set">{children}</ol>;
}
