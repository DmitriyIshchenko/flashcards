import { useLocalStorageState } from "./hooks/useLocalStorage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import DeckForm from "./components/DeckForm/DeckForm";
import DecksList from "./components/DecksList/DecksList";
import Deck from "./components/Deck/Deck";

import "./index.scss";

export default function App() {
  const [decks, setDecks] = useLocalStorageState([], "decks");

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
      <BrowserRouter>
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="login" element={<Login />} />
          <Route path="app" element={<AppLayout />}>
            <Route index element={<Navigate to="decks" />} />
            <Route path="decks" element={<DecksList decks={decks} />} />
            <Route path="decks/:deckId" element={<Deck decks={decks} />} />
            <Route
              path="decks/new"
              element={<DeckForm onSaveDeck={handleSaveDeck} decks={decks} />}
            />
            <Route
              path="decks/edit/:deckId"
              element={<DeckForm onSaveDeck={handleSaveDeck} decks={decks} />}
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
