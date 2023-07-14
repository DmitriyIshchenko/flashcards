import { useState } from "react";
import { useLocalStorageState } from "./hooks/useLocalStorage";
import Carousel from "./Carousel";
import FlashCard from "./FlashCard";
import DeckForm from "./DeckForm/DeckForm";

import "./index.scss";
import DecksList from "./DecksList";

// const initialDecks = [
//   {
//     id: "009fae03-608a-4021-8997-165b8c3209f8",
//     title: "Lorem ipsum dolor, sit amet consectetur adipisicing",
//     description: "deck 1",
//     terms: [
//       {
//         term: "term 1",
//         description:
//           "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, maiores?",
//         id: "6546542c-c31b-4e27-ac65-d6bb4c7b1812",
//       },
//       {
//         term: "term 2 ",
//         description:
//           "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, nostrum!",
//         id: "13ee79a4-8dac-474f-a7b3-dd6489ec8838",
//       },
//       {
//         term: "term 3",
//         description:
//           "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, quasi.",
//         id: "f73eaf95-70a3-4516-9caa-60d519071d2d",
//       },
//     ],
//   },
//   {
//     id: "488e9711-5c42-4318-b051-218367ec9598",
//     title: "Velit earum excepturi quis provident iste facere?",
//     description: "deck 2",
//     terms: [
//       {
//         term: "aaa",
//         description: "aaa",
//         id: "6546542c-c31b-4e27-ac65-d6bb4c7b1812",
//       },
//       {
//         term: "bbb",
//         description: "bbb",
//         id: "13ee79a4-8dac-474f-a7b3-dd6489ec8838",
//       },
//       {
//         term: "ccc",
//         description: "ccc",
//         id: "f73eaf95-70a3-4516-9caa-60d519071d2d",
//       },
//       {
//         term: "ddd",
//         description: "ddd",
//         id: "84e6604e-c13d-4e13-905b-18d641909e96",
//       },
//     ],
//   },
// ];

export default function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [decks, setDecks] = useLocalStorageState([], "decks");

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
      <DecksList decks={decks} />
      {/* <DeckForm onSaveDeck={handleSaveDeck} deckToEdit={decks[0]} /> */}
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
