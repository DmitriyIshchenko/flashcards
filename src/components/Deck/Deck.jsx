import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageNotFound from "../../pages/PageNotFound";
import Carousel from "../UI/Carousel/Carousel";
import FlashCard from "./FlashCard";
import SpinnerFullPage from "../UI/Spinner/SpinnerFullPage";

import { useDecks } from "../../contexts/DecksContext";

function Deck() {
  const { currentDeck, isLoading, getDeck } = useDecks();
  const { deckId } = useParams();

  useEffect(() => {
    getDeck(deckId);
  }, [deckId]);

  const [isFlipped, setIsFlipped] = useState(false);

  function handleFlip() {
    // don't flip if there is selected text
    if (document.getSelection().toString()) return;

    setIsFlipped((v) => !v);
  }

  if (isLoading) return <SpinnerFullPage />;
  if (!currentDeck) return <PageNotFound />;
  return (
    <Carousel>
      {currentDeck.terms.map((term) => (
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
