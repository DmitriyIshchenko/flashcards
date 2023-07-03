import { useState } from "react";
import "./Carousel.scss";

export default function Carousel({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleClick(newIndex) {
    if (newIndex < 0) newIndex = children.length - 1;
    if (newIndex > children.length - 1) newIndex = 0;

    setCurrentIndex(newIndex);
  }

  return (
    <div className="carousel">
      <div
        className="carousel__content"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {Array.from(children).map((child, i) => (
          <CarouselItem key={i}>{child}</CarouselItem>
        ))}
      </div>

      <div className="carousel__controls">
        <button
          className="carousel__btn"
          onClick={() => handleClick(currentIndex - 1)}
        >
          &larr;
        </button>
        <button
          className="carousel__btn"
          onClick={() => handleClick(currentIndex + 1)}
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}

function CarouselItem({ children }) {
  return <div className="carousel__item">{children}</div>;
}
