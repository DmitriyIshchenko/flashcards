import { useState, useEffect, useRef } from "react";
import "./AddSetForm.scss";

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default function AddSetForm({ onSaveSet, setToEdit }) {
  const [title, setTitle] = useState(() => setToEdit?.title || "");
  const [description, setDescription] = useState(
    () => setToEdit?.description || ""
  );
  const [inputFields, setInputFields] = useState(() => {
    return (
      setToEdit?.terms || [
        { term: "", description: "", id: crypto.randomUUID() },
      ]
    );
  });
  const prevInputFields = usePrevious(inputFields);

  const canSave = !!(
    title &&
    description &&
    Object.values(inputFields[0]).every((value) => value)
  );

  function handleFieldChange(index, e) {
    const data = [...inputFields];

    data[index][e.target.name] = e.target.value;

    setInputFields(data);
  }

  function handleAddField() {
    const newField = { term: "", description: "", id: crypto.randomUUID() };

    setInputFields((currentFields) => [...currentFields, newField]);
  }

  function handleDeleteField(index) {
    const data = [...inputFields];
    data.splice(index, 1);
    setInputFields(data);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newSet = {
      id: setToEdit?.id || crypto.randomUUID(),
      title,
      description,
      terms: inputFields,
    };

    onSaveSet(newSet);
  }

  useEffect(() => {
    if (inputFields.length <= prevInputFields?.length) return;

    window.scrollTo(0, document.body.scrollHeight);
  }, [inputFields, prevInputFields]);

  return (
    <form className="form" onSubmit={handleSubmit}>
      <header className="form__header">
        <div className="form__controls">
          {setToEdit && <button className="form__back-btn">&larr;</button>}
          <h2 className="form__title">
            {setToEdit ? "Back to set" : "Create a flashcard set"}
          </h2>
          <button
            type="submit"
            className="form__submit-btn form__submit-btn--top"
            disabled={!canSave}
          >
            {setToEdit ? "Save" : "Create"}
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
        {inputFields.map((field, index) => (
          <TermInput
            key={field.id}
            index={index}
            field={field}
            onFieldChange={handleFieldChange}
            onDeleteField={handleDeleteField}
            isOnlyItem={inputFields.length === 1}
          />
        ))}
      </fieldset>

      <button
        type="submit"
        className="form__submit-btn form__submit-btn--bottom"
        disabled={!canSave}
      >
        {setToEdit ? "Save" : "Create"}
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
