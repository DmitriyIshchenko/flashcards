import { useEffect, useRef, useState } from "react";
import Button from "../UI/Buttons/Button";
import Card from "../UI/Card/Card";
import { BiSolidImageAdd } from "react-icons/bi";
import { TbWorldSearch } from "react-icons/tb";
import { BsFillTrashFill } from "react-icons/bs";

import "./TermInput.scss";
import {
  WORDS_API_URL,
  WORDS_API_KEY,
  IMAGES_API_URL,
  IMAGES_API_KEY,
} from "../../helpers/config";

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

export default function TermInput({ field, fieldIndex, isOnlyItem, dispatch }) {
  const [loadedImages, setLoadedImages] = useState([]);
  const [areImagesLoading, setAreImagesLoading] = useState(false);
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);

  const { term, id } = field;

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

  async function handleFetchWord() {
    if (!term) return;

    try {
      const res = await fetch(`${WORDS_API_URL}${term}?key=${WORDS_API_KEY}`);
      const data = await res.json();

      const description = data.find((entry) => entry.def);
      const result = formatDescription(description, term);

      dispatch({
        type: "fields/update",
        payload: {
          field: "description",
          value: result,
          id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Card className="word" listItem>
      <FieldHeader
        field={field}
        fieldIndex={fieldIndex}
        handleFetchWord={handleFetchWord}
        isOnlyItem={isOnlyItem}
        dispatch={dispatch}
      />

      <FieldContent field={field} dispatch={dispatch}>
        <FieldImage
          field={field}
          handleFetchImages={handleFetchImages}
          dispatch={dispatch}
        />
      </FieldContent>

      <FieldImageMenu
        field={field}
        isImageMenuOpen={isImageMenuOpen}
        setIsImageMenuOpen={setIsImageMenuOpen}
        areImagesLoading={areImagesLoading}
        loadedImages={loadedImages}
        dispatch={dispatch}
      />
    </Card>
  );
}

function FieldHeader({
  field,
  fieldIndex,
  handleFetchWord,
  isOnlyItem,
  dispatch,
}) {
  return (
    <header className="word__header">
      <span className="word__number">{fieldIndex + 1}</span>
      <Button
        round
        type="button"
        title="Get description from Merriam-Webster"
        className="word__search-btn"
        onClick={handleFetchWord}
      >
        <TbWorldSearch />
      </Button>
      <Button
        round
        type="button"
        className="word__delete-btn"
        onClick={() => dispatch({ type: "fields/delete", payload: field.id })}
        disabled={isOnlyItem}
      >
        <BsFillTrashFill />
      </Button>
    </header>
  );
}

function FieldContent({ field, dispatch, children }) {
  const { term, description, id } = field;
  const descriptionRef = useRef(null);

  useEffect(() => {
    // manually update contenteditable div
    descriptionRef.current.textContent = description;
  }, [description, descriptionRef]);

  return (
    <div className="word__content">
      <input
        className="word__term"
        name="term"
        type="text"
        placeholder="Term"
        value={term}
        onChange={(e) =>
          dispatch({
            type: "fields/update",
            payload: {
              field: e.target.name,
              value: e.target.value,
              id,
            },
          })
        }
        required
      />

      <div
        className="word__description"
        contentEditable="true"
        onInput={(e) =>
          dispatch({
            type: "fields/update",
            payload: {
              field: "description",
              value: e.target.textContent,
              id,
            },
          })
        }
        suppressContentEditableWarning={true}
        ref={descriptionRef}
        data-placeholder="Description"
      ></div>

      {children}
    </div>
  );
}

function FieldImage({ field, dispatch, handleFetchImages }) {
  const { term, image, id } = field;
  return (
    <div className="word__image">
      {image ? (
        <>
          <Button
            round
            type="button"
            className="word__img-delete-btn"
            onClick={() =>
              dispatch({
                type: "fields/update",
                payload: {
                  field: "image",
                  value: null,
                  id,
                },
              })
            }
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
          <BiSolidImageAdd size={"4rem"} />
          <span>Image</span>
        </button>
      )}
    </div>
  );
}

function FieldImageMenu({
  field,

  isImageMenuOpen,
  setIsImageMenuOpen,
  areImagesLoading,
  loadedImages,
  dispatch,
}) {
  const { term, id } = field;
  return (
    <>
      {isImageMenuOpen && (
        <div className="word__images-menu">
          {areImagesLoading ? (
            <p className="word__images-menu-loader">Loading...</p>
          ) : (
            loadedImages.map((imageURLs, i) => (
              <img
                src={imageURLs.small}
                alt={term}
                key={i}
                onClick={() => {
                  dispatch({
                    type: "fields/update",
                    payload: {
                      field: "image",
                      value: imageURLs,
                      id,
                    },
                  });
                  setIsImageMenuOpen(false);
                }}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}
