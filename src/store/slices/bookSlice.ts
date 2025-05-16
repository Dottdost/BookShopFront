import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "../../types";

interface BookState {
  allBooks: Book[];
}

const initialState: BookState = {
  allBooks: [],
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    setBooks(state, action: PayloadAction<Book[]>) {
      state.allBooks = action.payload;
    },
    addBook(state, action: PayloadAction<Book>) {
      state.allBooks.push(action.payload);
    },
    removeBook(state, action: PayloadAction<number>) {
      state.allBooks = state.allBooks.filter(
        (book) => book.id !== action.payload
      );
    },
    updateBook(state, action: PayloadAction<Book>) {
      const index = state.allBooks.findIndex(
        (book) => book.id === action.payload.id
      );
      if (index !== -1) {
        state.allBooks[index] = action.payload;
      }
    },
  },
});

export const { setBooks, addBook, removeBook, updateBook } = bookSlice.actions;
export default bookSlice.reducer;
