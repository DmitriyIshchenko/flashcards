import { useState } from "react";
import "./AddSetForm.scss";
import { useRef } from "react";

export default function AddSetForm() {
  return (
    <form>
      {Array.from({ length: 5 }).map((item, index) => (
        <TermInput number={index + 1} key={index + 1} />
      ))}
    </form>
  );
}

function TermInput({ number }) {
  const textAreaRef = useRef(null);
  const [description, setDescription] = useState("");

  const handleChange = (e) => {
    setDescription(e.target.value);

    // auto grow textarea
    textAreaRef.current.style.height = "auto";
    const { scrollHeight } = textAreaRef.current;
    textAreaRef.current.style.height = scrollHeight + "px";
  };

  return (
    <div className="word">
      <header className="word__header">
        <span className="word__number">{number}</span>
        <button type="button" className="word__delete-btn">
          &times;
        </button>
      </header>

      <div className="word__content">
        <input
          className="word__input word__input--term"
          type="text"
          placeholder="Term"
        />

        <textarea
          className="word__input word__input--description"
          name=""
          id=""
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
