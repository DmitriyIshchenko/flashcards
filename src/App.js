import { useState } from "react";
import Carousel from "./Carousel";
import FlashCard from "./FlashCard";
import "./index.scss";

const data = [
  { term: "term 1", description: "description 1" },
  { term: "term 2", description: "description 2" },
  { term: "term 3", description: "description 3" },
  { term: "term 4", description: "description 4" },
  {
    term: "term 5",
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem corrupti omnis eaque quod qui architecto est itaque magni iure, libero voluptate tempora dolorem distinctio error similique dolore accusamus blanditiis quisquam?
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem corrupti omnis eaque quod qui architecto est itaque magni iure, libero voluptate tempora dolorem distinctio error similique dolore accusamus blanditiis quisquam?
    `,
  },
];

export default function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  function handleFlip() {
    setIsFlipped((v) => !v);
  }

  return (
    <div className="App">
      <Carousel>
        {data.map((item) => (
          <FlashCard
            key={item.term}
            data={item}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />
        ))}
      </Carousel>
    </div>
  );
}
