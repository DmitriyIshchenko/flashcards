import { useState, useEffect, useRef } from "react";
import "./AddSetForm.scss";

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default function AddSetForm() {
  const [inputFields, setInputFields] = useState([
    { term: "", description: "", id: crypto.randomUUID() },
  ]);
  const prevInputFields = usePrevious(inputFields);

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

  useEffect(() => {
    if (inputFields.length <= prevInputFields?.length) return;

    window.scrollTo(0, document.body.scrollHeight);
  }, [inputFields, prevInputFields]);

  return (
    <form className="form">
      {inputFields.map((field, index) => (
        <TermInput
          key={field.id}
          index={index}
          field={field}
          onFieldChange={handleFieldChange}
          onDeleteField={handleDeleteField}
        />
      ))}

      <button className="form__add-btn" type="button" onClick={handleAddField}>
        +
      </button>
    </form>
  );
}

function TermInput({ index, field, onFieldChange, onDeleteField }) {
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
        />

        <textarea
          className="word__input word__input--description"
          name="description"
          rows={1}
          ref={textAreaRef}
          placeholder="Description"
          value={description}
          onChange={handleChange}
        ></textarea>
      </div>
    </div>
  );
}
