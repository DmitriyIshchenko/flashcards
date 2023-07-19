import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import DeckForm from "./components/DeckForm/DeckForm";
import DecksList from "./components/DecksList/DecksList";
import Deck from "./components/Deck/Deck";

import { DECKS_API_URL } from "./helpers/config";

import "./index.scss";

export default function App() {
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleSaveDeck(newDeck) {
    const { id } = newDeck;
    const updatedDecks = [...decks];

    const index = updatedDecks.findIndex((deck) => deck.id === id);
    if (index === -1)
      return setDecks((currentDecks) => [...currentDecks, newDeck]);

    updatedDecks[index] = newDeck;
    setDecks(updatedDecks);
  }

  useEffect(() => {
    async function fetchDecks() {
      setIsLoading(true);
      try {
        const res = await fetch(`${DECKS_API_URL}/decks`);
        const data = await res.json();

        setDecks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDecks();
  }, []);

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
