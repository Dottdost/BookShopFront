import { useDispatch, useSelector } from "react-redux";
import { addOrder } from "../store/slices/ordersSlice";
import { RootState } from "../store";
import { Order } from "../types/order";

export const useOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.items);

  const placeOrder = (order: Order) => {
    dispatch(addOrder(order));
  };

  return { orders, placeOrder };
};
