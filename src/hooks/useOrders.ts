import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Order } from "../types/order";
import { addOrder } from "../store/slices/ordersSlice";

export const useOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.items);

  const placeOrder = (order: Order) => {
    dispatch(addOrder(order));
  };

  return { orders, placeOrder };
};
