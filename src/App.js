import { useState } from "react";
import Carousel from "./Carousel";
import FlashCard from "./FlashCard";
import DeckForm from "./DeckForm";

import "./index.scss";

const initialDecks = [
  {
    id: "009fae03-608a-4021-8997-165b8c3209f8",
    title: "deck 1",
    description: "deck 1",
    terms: [
      {
        term: "term 1",
        description: "desc 1",
        id: "6546542c-c31b-4e27-ac65-d6bb4c7b1812",
      },
      {
        term: "term 2 ",
        description: "desc 2",
        id: "13ee79a4-8dac-474f-a7b3-dd6489ec8838",
      },
      {
        term: "term 3",
        description: "desc 3",
        id: "f73eaf95-70a3-4516-9caa-60d519071d2d",
      },
    ],
  },
  {
    id: "488e9711-5c42-4318-b051-218367ec9598",
    title: "deck 2",
    description: "deck 2",
    terms: [
      {
        term: "aaa",
        description: "aaa",
        id: "6546542c-c31b-4e27-ac65-d6bb4c7b1812",
      },
      {
        term: "bbb",
        description: "bbb",
        id: "13ee79a4-8dac-474f-a7b3-dd6489ec8838",
      },
      {
        term: "ccc",
        description: "ccc",
        id: "f73eaf95-70a3-4516-9caa-60d519071d2d",
      },
      {
        term: "ddd",
        description: "ddd",
        id: "84e6604e-c13d-4e13-905b-18d641909e96",
      },
    ],
  },
];

export default function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [decks, setDecks] = useState(initialDecks);

  function handleFlip() {
    setIsFlipped((v) => !v);
  }

  function handleSaveDeck(newDeck) {
    const { id } = newDeck;
    const updatedDecks = [...decks];

    const index = updatedDecks.findIndex((deck) => deck.id === id);
    if (index === -1)
      return setDecks((currentDecks) => [...currentDecks, newDeck]);

    updatedDecks[index] = newDeck;
    setDecks(updatedDecks);
  }

  return (
    <div className="App">
      <DeckForm onSaveDeck={handleSaveDeck} />
      {/* <Carousel>
        {decks[0].terms.map((item) => (
          <FlashCard
            key={item.term}
            data={item}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />
        ))}
      </Carousel> */}
    </div>
  );
}
