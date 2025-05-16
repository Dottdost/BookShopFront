import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "../../types/book";

interface FavoritesState {
  items: Book[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites(state, action: PayloadAction<Book[]>) {
      state.items = action.payload;
    },
    addToFavorites(state, action: PayloadAction<Book>) {
      const exists = state.items.find((book) => book.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromFavorites(state, action: PayloadAction<number>) {
      state.items = state.items.filter((book) => book.id !== action.payload);
    },
    clearFavorites(state) {
      state.items = [];
    },
  },
});

export const {
  setFavorites,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
