import { useContext, useState, useEffect } from "react";
import { createContext } from "react";

import { DECKS_API_URL } from "../helpers/config";
const DecksContext = createContext();

function DecksProvider({ children }) {
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
  return (
    <DecksContext.Provider
      value={{
        decks,
        isLoading,
        createDeck,
        deleteDeck,
        updateDeck,
      }}
    >
      {children}
    </DecksContext.Provider>
  );
}

function useDecks() {
  const context = useContext(DecksContext);

  if (context === undefined)
    throw new Error("DecksContext was used outside DecksProvider");

  return context;
}

export { DecksProvider, useDecks };
