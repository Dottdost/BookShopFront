import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Order, OrderStatus } from "../../types/order";
import axios from "axios";

type BackendBook = {
  id?: string | number;
  title?: string;
  price?: number;
  imageUrl?: string;
};

type BackendOrderItem = {
  id?: string;
  bookId: string | number;
  quantity?: number;
  unitPrice?: number;
  price?: number;
  title?: string;
  imageUrl?: string;
};

type BackendOrder = {
  id?: string;
  userId?: string;
  orderDate?: string;
  createdAt?: string;
  totalPrice?: number;
  status?: OrderStatus | string;
  promoCode?: string;
  orderItems?:
    | {
        $values?: BackendOrderItem[];
      }
    | BackendOrderItem[];
};

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://cheshireshelfapp-env.eba-pzcyg6yq.eu-north-1.elasticbeanstalk.com";

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

const unwrapArray = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const objectData = data as Record<string, unknown>;

  if (Array.isArray(objectData.$values)) {
    return objectData.$values as T[];
  }

  return [];
};

const normalizeStatus = (status: BackendOrder["status"]): OrderStatus => {
  if (
    status === OrderStatus.Pending ||
    status === OrderStatus.Paid ||
    status === OrderStatus.Shipped ||
    status === OrderStatus.Completed ||
    status === OrderStatus.Canceled
  ) {
    return status;
  }

  return OrderStatus.Pending;
};

const fetchBookById = async (
  bookId: string | number,
): Promise<BackendBook | null> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/books/${bookId}`);
    return res.data;
  } catch {
    return null;
  }
};

export const fetchOrders = createAsyncThunk<Order[], string>(
  "orders/fetchOrders",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Order/user/${userId}`,
      );

      const rawOrders = unwrapArray<BackendOrder>(response.data);

      const normalized = await Promise.all(
        rawOrders.map(async (order: BackendOrder): Promise<Order> => {
          const items = Array.isArray(order.orderItems)
            ? order.orderItems
            : (order.orderItems?.$values ?? []);

          const orderItems = await Promise.all(
            items.map(async (item: BackendOrderItem, index: number) => {
              const bookData = await fetchBookById(item.bookId);

              const price =
                item.unitPrice ?? item.price ?? bookData?.price ?? 0;
              const quantity = item.quantity ?? 1;

              return {
                id: item.id ?? `${order.id ?? "order"}-${item.bookId}-${index}`,
                bookId: Number(item.bookId),
                quantity,
                price,
                title: item.title ?? bookData?.title ?? "Unknown Book",
                imageUrl: item.imageUrl ?? bookData?.imageUrl,
              };
            }),
          );

          const calculatedTotal = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );

          return {
            id: order.id ?? "",
            userId: order.userId ?? userId,
            orderItems,
            totalPrice: order.totalPrice ?? calculatedTotal,
            status: normalizeStatus(order.status),
            createdAt:
              order.orderDate || order.createdAt || new Date().toISOString(),
            promoCode: order.promoCode,
          };
        }),
      );

      return normalized;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ошибка при загрузке заказов";

      return rejectWithValue(message);
    }
  },
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
