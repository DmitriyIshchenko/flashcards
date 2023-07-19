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

  async function createDeck(newDeck) {
    setIsLoading(true);
    try {
      const res = await fetch(`${DECKS_API_URL}/decks`, {
        method: "POST",
        body: JSON.stringify(newDeck),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      setDecks((decks) => [...decks, data]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteDeck(id) {
    setIsLoading(true);
    try {
      setDecks((decks) => decks.filter((deck) => deck.id !== id));
      await fetch(`${DECKS_API_URL}/decks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateDeck(updatedDeck, id) {
    setIsLoading(true);
    try {
      const res = await fetch(`${DECKS_API_URL}/decks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedDeck),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setDecks((decks) => {
        const updatedDecks = [...decks];
        const index = updatedDecks.findIndex((deck) => deck.id === data.id);

        updatedDecks[index] = data;
        return updatedDecks;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
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
            <Route
              path="decks"
              element={<DecksList decks={decks} onDeleteDeck={deleteDeck} />}
            />
            <Route path="decks/:deckId" element={<Deck decks={decks} />} />
            <Route
              path="form/:deckId?"
              element={
                <DeckForm
                  decks={decks}
                  onCreateDeck={createDeck}
                  onUpdateDeck={updateDeck}
                />
              }
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
