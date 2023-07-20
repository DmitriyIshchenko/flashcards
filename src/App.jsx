import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import DeckForm from "./components/DeckForm/DeckForm";
import DecksList from "./components/DecksList/DecksList";
import Deck from "./components/Deck/Deck";

import "./index.scss";
import { DecksProvider } from "./contexts/DecksContext";

export default function App() {
  return (
    <div className="App">
      <DecksProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="login" element={<Login />} />
            <Route path="app" element={<AppLayout />}>
              <Route index element={<Navigate to="decks" />} />
              <Route path="decks" element={<DecksList />} />
              <Route path="decks/:deckId" element={<Deck />} />
              <Route path="form/:deckId?" element={<DeckForm />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </DecksProvider>
    </div>
  );
}
