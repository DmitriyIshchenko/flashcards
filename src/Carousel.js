import "./Carousel.scss";
import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

export default function Carousel({ children }) {
  const [inProp, setInProp] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("");
  const nodeRef = useRef(null);

  function handleMove(e) {
    const { direction } = e.target.dataset;
    setInProp((v) => !v);
    setDirection(direction);
  }

  function handleUpdateIndex() {
    if (direction === "left") {
      setCurrentIndex((index) =>
        index === 0 ? children.length - 1 : index - 1
      );
    }

    if (direction === "right") {
      setCurrentIndex((index) =>
        index === children.length - 1 ? 0 : index + 1
      );
    }
  }

  return (
    <div className="carousel">
      <button
        className="carousel__btn"
        data-direction="left"
        onClick={handleMove}
      >
        &larr;
      </button>

      <div className="carousel__inner">
        <CSSTransition
          nodeRef={nodeRef}
          in={inProp}
          timeout={300}
          classNames={`move-${direction}`}
          onEntered={handleUpdateIndex}
          onExited={handleUpdateIndex}
        >
          <div className="carousel__content" ref={nodeRef}>
            <div className="carousel__item carousel__item--left">
              {children.at(currentIndex - 1)}
            </div>
            <div className="carousel__item carousel__item--center">
              {children.at(currentIndex)}
            </div>
            <div className="carousel__item carousel__item--right">
              {children.at(currentIndex + 1) || children.at(0)}
            </div>
          </div>
        </CSSTransition>
        <span className="carousel__info">
          {currentIndex + 1} / {children.length}
        </span>
      </div>

      <button
        className="carousel__btn"
        data-direction="right"
        onClick={handleMove}
      >
        &rarr;
      </button>
    </div>
  );
}
