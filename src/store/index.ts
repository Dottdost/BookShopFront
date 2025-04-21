import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import favoritesReducer from "./slices/favoritesSlice";
import ordersReducer from "./slices/ordersSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
