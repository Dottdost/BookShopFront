import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../../types/order";

interface OrdersState {
  items: Order[];
}

const initialState: OrdersState = {
  items: JSON.parse(localStorage.getItem("orders") || "[]"),
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.items.push(action.payload);
      localStorage.setItem("orders", JSON.stringify(state.items));
    },
    clearOrders(state) {
      state.items = [];
      localStorage.removeItem("orders");
    },
  },
});

export const { addOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
