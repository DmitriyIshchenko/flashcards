import { useState, useEffect, useRef } from "react";
import "./DeckForm.scss";

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default function DeckForm({ onSaveDeck, deckToEdit }) {
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

  function handleFieldChange(index, e) {
    const data = [...termInputFields];

    data[index][e.target.name] = e.target.value;

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
    if (termInputFields.length <= prevTermInputFields?.length) return;

    window.scrollTo(0, document.body.scrollHeight);
  }, [termInputFields, prevTermInputFields]);

  return (
    <form className="form" onSubmit={handleSubmit}>
      <header className="form__header">
        <div className="form__controls">
          {deckToEdit && <button className="form__back-btn">&larr;</button>}
          <h2 className="form__title">
            {deckToEdit ? "Back to deck" : "Create a flashcard deck"}
          </h2>
          <button
            type="submit"
            className="form__submit-btn form__submit-btn--top"
            disabled={!canSave}
          >
            {deckToEdit ? "Save" : "Create"}
          </button>
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

      <fieldset className="form__set">
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
      </fieldset>

      <button
        type="submit"
        className="form__submit-btn form__submit-btn--bottom"
        disabled={!canSave}
      >
        {deckToEdit ? "Save" : "Create"}
      </button>
      <button className="form__add-btn" type="button" onClick={handleAddField}>
        +
      </button>
    </form>
  );
}

function TermInput({ index, field, onFieldChange, onDeleteField, isOnlyItem }) {
  const textAreaRef = useRef(null);
  const { term, description } = field;
  const handleChange = (e) => {
    onFieldChange(index, e);

    if (e.target.name !== "description") return;

    // auto grow textarea
    textAreaRef.current.style.height = "auto";
    const { scrollHeight } = textAreaRef.current;
    textAreaRef.current.style.height = scrollHeight + "px";
  };

  return (
    <div className="word">
      <header className="word__header">
        <span className="word__number">{index + 1}</span>
        <button
          type="button"
          className="word__delete-btn"
          onClick={() => onDeleteField(index)}
          disabled={isOnlyItem}
        >
          &times;
        </button>
      </header>

      <div className="word__content">
        <input
          className="word__input word__input--term"
          name="term"
          type="text"
          placeholder="Term"
          value={term}
          onChange={handleChange}
          required
        />

        <textarea
          className="word__input word__input--description"
          name="description"
          rows={1}
          ref={textAreaRef}
          placeholder="Description"
          value={description}
          onChange={handleChange}
          required
        ></textarea>
      </div>
    </div>
  );
}
