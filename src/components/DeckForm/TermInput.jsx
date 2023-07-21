import { useEffect, useRef, useState } from "react";
import { TbWorldSearch } from "react-icons/tb";
import { BsFillTrashFill } from "react-icons/bs";

import FieldImageMenu from "./FieldImageMenu";
import Button from "../UI/Buttons/Button";
import Card from "../UI/Card/Card";
import Spinner from "../UI/Spinner/Spinner";

import { WORDS_API_URL, WORDS_API_KEY } from "../../helpers/config";
import { formatDescription } from "../../helpers/formatDescription";

import "./TermInput.scss";

export default function TermInput({ field, fieldIndex, isOnlyItem, dispatch }) {
  const { term, id } = field;
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);

  async function handleFetchWord() {
    if (!term) return;
    setIsDescriptionLoading(true);

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
      setIsDescriptionLoading(false);
    } catch (err) {
      console.error(err);
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

      <FieldContent
        field={field}
        dispatch={dispatch}
        isDescriptionLoading={isDescriptionLoading}
      />

      <FieldImageMenu field={field} dispatch={dispatch} />
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
        type="button"
        category="search"
        title="Get description from Merriam-Webster"
        onClick={handleFetchWord}
      >
        <TbWorldSearch />
      </Button>
      <Button
        type="button"
        category="delete"
        onClick={() => dispatch({ type: "fields/delete", payload: field.id })}
        disabled={isOnlyItem}
      >
        <BsFillTrashFill />
      </Button>
    </header>
  );
}

function FieldContent({ field, isDescriptionLoading, dispatch }) {
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

      <div className="word__description">
        <div
          className="word__description-text"
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
        {isDescriptionLoading && (
          <div className="word__description-loader">
            <Spinner />
            <span>Fetching description...</span>
          </div>
        )}
      </div>
    </div>
  );
}
