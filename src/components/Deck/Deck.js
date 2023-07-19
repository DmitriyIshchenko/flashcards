import { useState } from "react";
import { useParams } from "react-router-dom";
import PageNotFound from "../../pages/PageNotFound";
import Carousel from "../UI/Carousel/Carousel";
import FlashCard from "./FlashCard";

function Deck({ decks }) {
  const { deckId } = useParams();

  const [isFlipped, setIsFlipped] = useState(false);

  function handleFlip() {
    setIsFlipped((v) => !v);
  }

  const deck = decks.find((deck) => deck.id === deckId);
  if (!deck) return <PageNotFound />;
  return (
    <Carousel>
      {deck.terms.map((term) => (
        <FlashCard
          key={term.term}
          data={term}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      ))}
    </Carousel>
  );
}

export default Deck;
