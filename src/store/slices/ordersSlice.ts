import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Order } from "../../types/order";
import axios from "axios";

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

const fetchBookById = async (bookId: string) => {
  try {
    const res = await axios.get(`https://localhost:44308/api/books/${bookId}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const fetchOrders = createAsyncThunk<Order[], string>(
  "orders/fetchOrders",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://localhost:44308/api/Order/user/${userId}`
      );

      const rawOrders = response.data?.$values || response.data;

      if (!Array.isArray(rawOrders)) {
        return rejectWithValue("Некорректный формат данных");
      }

      const normalized = await Promise.all(
        rawOrders.map(async (order) => {
          const orderItems = await Promise.all(
            (order.orderItems?.$values || order.orderItems || []).map(
              async (item) => {
                const bookData = await fetchBookById(item.bookId);

                return {
                  ...item,
                  price: item.unitPrice ?? bookData?.price ?? 0,
                  title: item.title ?? bookData?.title ?? "Unknown Book",
                };
              }
            )
          );

          return {
            ...order,
            createdAt: order.orderDate || new Date().toISOString(),
            orderItems,
          };
        })
      );

      return normalized;
    } catch (error: any) {
      return rejectWithValue(error.message || "Ошибка при загрузке заказов");
    }
  }
);

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
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
