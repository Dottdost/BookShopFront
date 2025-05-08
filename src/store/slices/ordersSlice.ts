import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../../types/order";

interface OrdersState {
  items: Order[];
}

const initialState: OrdersState = {
  items: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.items.push(action.payload);
    },
    setOrders(state, action: PayloadAction<Order[]>) {
      state.items = action.payload;
    },
    clearOrders(state) {
      state.items = [];
    },
  },
});

export const { addOrder, setOrders, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
