import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import favoritesReducer from "./slices/favoritesSlice";
import ordersReducer from "./slices/ordersSlice";
import bookReducer from "./slices/bookSlice";
import genreReducer from "./slices/genreSlice";
import cartReducer from "./slices/cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    orders: ordersReducer,
    book: bookReducer,
    genre: genreReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
