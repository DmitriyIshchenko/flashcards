import { useState } from "react";
import { BiSolidImageAdd } from "react-icons/bi";

import Button from "../UI/Buttons/Button";
import Loader from "./Loader/";

import { IMAGES_API_URL, IMAGES_API_KEY } from "../../helpers/config";

import styles from "./FieldImageMenu.module.css";

export default function FieldImageMenu({ field, dispatch }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { term } = field;

  async function handleFetchImages() {
    if (!term) return;

    try {
      setIsLoading(true);
      setIsMenuOpen(true);
      const res = await fetch(
        `${IMAGES_API_URL}?client_id=${IMAGES_API_KEY}&page=1&per_page=5&query=${term}`
      );
      const data = await res.json();

      setIsLoading(false);
      setImages(data.results.map((image) => image.urls));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <FieldImage
        field={field}
        dispatch={dispatch}
        isMenuOpen={isMenuOpen}
        handleFetchImages={handleFetchImages}
      />

      <FieldImageOutput
        field={field}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isLoading={isLoading}
        images={images}
        dispatch={dispatch}
      />
    </>
  );
}
function FieldImage({ field, dispatch, handleFetchImages, isMenuOpen }) {
  const { term, image, id } = field;
  return (
    <div className={styles.imageBox}>
      {image ? (
        <>
          <Button
            type="button"
            category="delete-image"
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
          className={styles.addBtn}
          disabled={isMenuOpen}
        >
          <BiSolidImageAdd size={"4rem"} />
          <span>Image</span>
        </button>
      )}
    </div>
  );
}
function FieldImageOutput({
  field,
  isMenuOpen,
  setIsMenuOpen,
  isLoading,
  images,
  dispatch,
}) {
  const { term, id } = field;
  if (!isMenuOpen) return null;

  return (
    <div className={styles.output}>
      {isLoading ? (
        <Loader
          type="image"
          message="Loading images..."
          className={styles.loader}
        />
      ) : (
        images.map((imageURLs, i) => (
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
              setIsMenuOpen(false);
            }}
          />
        ))
      )}
    </div>
  );
}
