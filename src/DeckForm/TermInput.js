import { useEffect, useRef, useState } from "react";
import Button from "../Buttons/Button";

import "./TermInput.scss";

const IMAGES_API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_API_KEY = "zoLLYgXpGBOsvFhqJes-gEEiwH5P8qdDnP-z4MxHkaM";

const WORDS_API_URL =
  "https://dictionaryapi.com/api/v3/references/learners/json/";
const WORDS_API_KEY = "662bbdcb-bbc5-4cb9-beb1-710821e95385";

function formatDescription(data, term) {
  if (!data) return "";

  const description = data.shortdef.join(";\n");
  const examples = data.def
    .map((def) => def.sseq)
    .flat(Infinity)
    .filter((item) => typeof item !== "string" && item.dt)
    .map((obj) => obj.dt)
    .flat(Infinity)
    .filter((item) => typeof item !== "string" && item.t)
    .map((obj) =>
      obj.t
        .replaceAll(/{.*}(.*){.*}/g, "$1")
        .replaceAll(term, "_".repeat(term.length))
    )
    .slice(0, 5)
    .join("\n");

  return `${description}${examples.length ? "\n".repeat(3) : ""}${examples}`;
}

export function TermInput({
  index,
  field,
  onFieldChange,
  onDeleteField,
  isOnlyItem,
}) {
  const [loadedImages, setLoadedImages] = useState([]);
  const [areImagesLoading, setAreImagesLoading] = useState(false);
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  const descriptionRef = useRef(null);

  const { term, description, image } = field;

  function handleChange(key, value) {
    onFieldChange(key, value, index);

    if (key !== "description") return;
  }

  async function handleFetchWord() {
    if (!term) return;

    try {
      const res = await fetch(`${WORDS_API_URL}${term}?key=${WORDS_API_KEY}`);
      const data = await res.json();

      const description = data.find((entry) => entry.def);
      const result = formatDescription(description, term);

      handleChange("description", result);
    } catch (err) {
      handleChange("description", "");
      console.log(err);
    }
  }

  async function handleFetchImages() {
    if (!term) return;

    try {
      setAreImagesLoading(true);
      setIsImageMenuOpen(true);
      const res = await fetch(
        `${IMAGES_API_URL}?client_id=${IMAGES_API_KEY}&page=1&per_page=5&query=${term}`
      );
      const data = await res.json();

      setAreImagesLoading(false);
      setLoadedImages(data.results.map((image) => image.urls));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    // manually update contenteditable div
    descriptionRef.current.textContent = description;
  }, [description, descriptionRef]);

  return (
    <li className="word">
      <header className="word__header">
        <span className="word__number">{index + 1}</span>
        <Button
          round
          type="button"
          title="Get description from Merriam-Webster"
          className="word__search-btn"
          onClick={handleFetchWord}
        >
          🔍️
        </Button>
        <Button
          round
          type="button"
          className="word__delete-btn"
          onClick={() => onDeleteField(index)}
          disabled={isOnlyItem}
        >
          &times;
        </Button>
      </header>

      <div className="word__content">
        <input
          className="word__term"
          name="term"
          type="text"
          placeholder="Term"
          value={term}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          required
        />

        <div
          className="word__description"
          contentEditable="true"
          name="q"
          onInput={(e) => handleChange("description", e.target.textContent)}
          suppressContentEditableWarning={true}
          ref={descriptionRef}
          data-placeholder="Description"
        ></div>

        <div className="word__image">
          {image ? (
            <>
              <Button
                round
                type="button"
                className="word__img-delete-btn"
                onClick={() => handleChange("image", "")}
              >
                &times;
              </Button>
              <img src={image.thumb} alt={term} />
            </>
          ) : (
            <button
              onClick={handleFetchImages}
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
          {areImagesLoading ? (
            <p className="word__images-menu-loader">Loading...</p>
          ) : (
            loadedImages.map((imageURLs, index) => (
              <img
                src={imageURLs.small}
                alt={term}
                key={index}
                onClick={() => {
                  handleChange("image", imageURLs);
                  setIsImageMenuOpen(false);
                }}
              />
            ))
          )}
        </div>
      )}
    </li>
  );
}
