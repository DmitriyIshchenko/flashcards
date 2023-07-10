import { useRef } from "react";

import "./TermInput.scss";

export function TermInput({
  index,
  field,
  onFieldChange,
  onDeleteField,
  isOnlyItem,
}) {
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
