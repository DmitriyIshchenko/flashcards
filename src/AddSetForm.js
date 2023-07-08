import { useState } from "react";
import "./AddSetForm.scss";
import { useRef } from "react";

export default function AddSetForm() {
  const [inputFields, setInputFields] = useState([
    { term: "milk", description: "" },
  ]);

  function handleFormChange(index, e) {
    const data = [...inputFields];

    data[index][e.target.name] = e.target.value;

    setInputFields(data);
  }

  function handleAddField() {
    const newField = { term: "", description: "" };

    setInputFields((currentFields) => [...currentFields, newField]);
  }

  return (
    <form className="form">
      {inputFields.map((field, index) => (
        <TermInput
          key={index}
          index={index}
          field={field}
          onFormChange={handleFormChange}
        />
      ))}

      <button className="form__add-btn" type="button" onClick={handleAddField}>
        +
      </button>
    </form>
  );
}

function TermInput({ index, field, onFormChange }) {
  const textAreaRef = useRef(null);
  const { term, description } = field;
  const handleChange = (e) => {
    onFormChange(index, e);

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
        <button type="button" className="word__delete-btn">
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
