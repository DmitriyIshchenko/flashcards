import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { TermInput } from "./TermInput";
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
  }

  useEffect(() => {
    if (termInputFields.length <= prevTermInputFields?.length || deckToEdit)
      return;

    window.scrollTo(0, document.body.scrollHeight);
  }, [termInputFields, prevTermInputFields, deckToEdit]);

  return (
    <form className="form" onSubmit={handleSubmit}>
      <header className="form__header">
        <div className="form__controls">
          {deckToEdit && (
            <Button
              round
              className="form__back-btn"
              onClick={() => navigate(-1)}
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
      </header>

      <ol className="form__set">
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
      </ol>

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
