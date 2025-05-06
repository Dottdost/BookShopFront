// src/slices/genreSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Genre } from "../../types";

interface GenreState {
  genres: Genre[];
}

const initialState: GenreState = {
  genres: [],
};

const genreSlice = createSlice({
  name: "genre",
  initialState,
  reducers: {
    setGenres(state, action: PayloadAction<Genre[]>) {
      state.genres = action.payload;
    },
    addGenre(state, action: PayloadAction<Genre>) {
      state.genres.push(action.payload);
    },
  },
});

export const { setGenres, addGenre } = genreSlice.actions;
export default genreSlice.reducer;
