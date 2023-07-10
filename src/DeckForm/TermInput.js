import { useRef, useState } from "react";

import "./TermInput.scss";

const IMAGES_API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_API_KEY = "zoLLYgXpGBOsvFhqJes-gEEiwH5P8qdDnP-z4MxHkaM";

export function TermInput({
  index,
  field,
  onFieldChange,
  onDeleteField,
  isOnlyItem,
}) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);

  const textAreaRef = useRef(null);
  const { term, description, image } = field;

  function handleChange(key, value) {
    onFieldChange(key, value, index);

    if (key !== "description") return;

    // auto grow textarea
    textAreaRef.current.style.height = "auto";
    const { scrollHeight } = textAreaRef.current;
    textAreaRef.current.style.height = scrollHeight + "px";
  }

  async function handleFetch(e) {
    if (!term) return;

    try {
      setIsLoading(true);
      setIsImageMenuOpen(true);
      const res = await fetch(
        `${IMAGES_API_URL}?client_id=${IMAGES_API_KEY}&page=1&per_page=5&query=${term}`
      );
      const data = await res.json();

      setIsLoading(false);
      setImages(data.results.map((image) => image.urls.small));
    } catch (err) {
      console.log(err);
    }
  }

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
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          required
        />

        <textarea
          className="word__input word__input--description"
          name="description"
          rows={1}
          ref={textAreaRef}
          placeholder="Description"
          value={description}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          required
        ></textarea>

        <div className="word__image">
          {image ? (
            <>
              <button
                type="button"
                className="word__img-delete-btn"
                onClick={() => handleChange("image", "")}
              >
                &times;
              </button>
              <img src={image} alt={term} />
            </>
          ) : (
            <button
              onClick={handleFetch}
              type="button"
              className="word__img-add-btn"
            >
              <span>Find Image</span>
            </button>
          )}
        </div>
      </div>

      {isImageMenuOpen && (
        <div className="word__images-menu">
          {isLoading ? (
            <p className="word__images-menu-loader">Loading...</p>
          ) : (
            images.map((imageURL, index) => (
              <img
                src={imageURL}
                alt={term}
                key={index}
                onClick={() => {
                  handleChange("image", imageURL);
                  setIsImageMenuOpen(false);
                }}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
