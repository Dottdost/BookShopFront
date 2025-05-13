import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Order } from "../../types/order";
import axios from "axios";

interface OrdersState {
  items: Order[]; // Это гарантирует, что items будет всегда массивом
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [], // Начальное состояние - пустой массив
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk<Order[], string>(
  "orders/fetchOrders",
  async (userId: string) => {
    try {
      const response = await axios.get(`/api/order/user/${userId}`);
      // Проверяем, что данные - это массив, прежде чем возвращать их
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        throw new Error("Expected an array of orders");
      }
    } catch (error) {
      throw new Error("Failed to load orders");
    }
  }
);

// Слайс для заказов
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder(state, action) {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // Мы уверены, что это массив
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load orders";
      });
  },
});

export const { addOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
