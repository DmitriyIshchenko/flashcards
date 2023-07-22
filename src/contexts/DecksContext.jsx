import { useContext, useEffect, useReducer } from "react";
import { createContext } from "react";

import { DECKS_API_URL } from "../helpers/config";
const DecksContext = createContext();

const initialState = {
  decks: [],
  isLoading: false,
  error: "",
  currentDeck: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "decks/loaded":
      return { ...state, isLoading: false, decks: action.payload };
    case "deck/loaded":
      return { ...state, isLoading: false, currentDeck: action.payload };
    case "deck/created":
      return {
        ...state,
        isLoading: false,
        decks: [...state.decks, action.payload],
      };
    case "deck/updated": {
      const updatedDecks = [...state.decks];
      const index = updatedDecks.findIndex(
        (deck) => deck.id === action.payload.id
      );

      updatedDecks[index] = action.payload;
      return { ...state, isLoading: false, decks: updatedDecks };
    }
    case "deck/deleted":
      return {
        ...state,
        isLoading: false,
        decks: state.decks.filter((deck) => deck.id !== action.payload),
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function DecksProvider({ children }) {
  const [{ decks, isLoading, error, currentDeck }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchDecks() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${DECKS_API_URL}/decks`);
        const data = await res.json();

        dispatch({ type: "decks/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error fetching decks.",
        });
      }
    }
    fetchDecks();
  }, []);

  async function createDeck(newDeck) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${DECKS_API_URL}/decks`, {
        method: "POST",
        body: JSON.stringify(newDeck),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      dispatch({ type: "deck/created", payload: data });
      return data.id;
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the deck.",
      });
    }
  }

  async function deleteDeck(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${DECKS_API_URL}/decks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({ type: "deck/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the deck.",
      });
    }
  }

  async function updateDeck(updatedDeck, id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${DECKS_API_URL}/decks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedDeck),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      dispatch({ type: "deck/updated", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error updating the deck.",
      });
    }
  }

  async function getDeck(id) {
    if (id == currentDeck?.id) return;

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${DECKS_API_URL}/decks/${id}`);
      const data = await res.json();

      if (!Object.keys(data).length) {
        dispatch({ type: "rejected", payload: "Deck not found" });
      } else dispatch({ type: "deck/loaded", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error loading the deck data.",
      });
    }
  }
  return (
    <DecksContext.Provider
      value={{
        decks,
        isLoading,
        error,
        createDeck,
        deleteDeck,
        updateDeck,
        getDeck,
        currentDeck,
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
