import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderItem } from "../../types/order";

interface CartState {
  items: OrderItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<OrderItem>) {
      const existing = state.items.find(
        (i) => i.bookId === action.payload.bookId
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.bookId !== action.payload
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ bookId: number; quantity: number }>
    ) {
      const item = state.items.find((i) => i.bookId === action.payload.bookId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
