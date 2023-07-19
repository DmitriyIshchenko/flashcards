import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TermInput from "./TermInput";
import Button from "../UI/Buttons/Button";
import { BsArrowLeftShort, BsPlus } from "react-icons/bs";
import { usePrevious } from "../../hooks/usePrevious";

import "./DeckForm.scss";

export default function DeckForm({ decks, onSaveDeck }) {
  const { deckId } = useParams();
  const deckToEdit = decks.find((deck) => deck.id === deckId);
  const navigate = useNavigate();

  const [title, setTitle] = useState(() => deckToEdit?.title || "");
  const [description, setDescription] = useState(
    () => deckToEdit?.description || ""
  );
  const [termInputFields, setTermInputFields] = useState(() => {
    return (
      deckToEdit?.terms || [
        { term: "", description: "", id: crypto.randomUUID() },
      ]
    );
  });
  const prevTermInputFields = usePrevious(termInputFields);

  const canSave = !!(
    title &&
    description &&
    Object.values(termInputFields[0]).every((value) => value)
  );

  function handleFieldChange(key, value, index) {
    const data = [...termInputFields];

    data[index][key] = value;

    setTermInputFields(data);
  }

  function handleAddField() {
    const newField = { term: "", description: "", id: crypto.randomUUID() };

    setTermInputFields((currentFields) => [...currentFields, newField]);
  }

  function handleDeleteField(index) {
    const data = [...termInputFields];
    data.splice(index, 1);
    setTermInputFields(data);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newDeck = {
      id: deckToEdit?.id || crypto.randomUUID(),
      title,
      description,
      terms: termInputFields,
    };

    onSaveDeck(newDeck);
    navigate(deckId ? `/app/decks/${deckId}` : "/app/decks");
  }

  useEffect(() => {
    if (termInputFields.length <= prevTermInputFields?.length || deckToEdit)
      return;

    window.scrollTo(0, document.body.scrollHeight);
  }, [termInputFields, prevTermInputFields, deckToEdit]);

  return (
    <form className="form" onSubmit={handleSubmit}>
      <FormHeader
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      >
        <FormControls deckId={deckId} canSave={canSave} />
        <FormInfo
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
        />
      </FormHeader>

      <FormFields>
        {termInputFields.map((field, index) => (
          <TermInput
            key={field.id}
            index={index}
            field={field}
            onFieldChange={handleFieldChange}
            onDeleteField={handleDeleteField}
            isOnlyItem={termInputFields.length === 1}
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
        onClick={handleAddField}
      >
        <BsPlus />
      </Button>
    </form>
  );
}

function FormHeader({ children }) {
  return <header className="form__header">{children}</header>;
}

function FormControls({ deckId, canSave }) {
  const navigate = useNavigate();
  return (
    <div className="form__controls">
      {deckId && (
        <Button round className="form__back-btn" onClick={() => navigate(-1)}>
          <BsArrowLeftShort />
        </Button>
      )}
      <h2 className="form__title">
        {deckId ? "Back to deck" : "Create a flashcard deck"}
      </h2>
      <Button
        type="submit"
        className="form__submit-btn form__submit-btn--top"
        disabled={!canSave}
      >
        {deckId ? "Save" : "Create"}
      </Button>
    </div>
  );
}

function FormInfo({ title, setTitle, description, setDescription }) {
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
          onChange={(e) => setTitle(e.target.value)}
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
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
    </div>
  );
}

function FormFields({ children }) {
  return <ol className="form__set">{children}</ol>;
}
