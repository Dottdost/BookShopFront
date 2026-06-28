import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../store";
import { addOrder, fetchOrders } from "../store/slices/ordersSlice";
import { Order } from "../types/order";

export const useOrders = (userId: string) => {
  const dispatch: DispatchType = useDispatch();

  const orders = useSelector((state: RootState) => state.orders.items);
  const reduxLoading = useSelector((state: RootState) => state.orders.loading);
  const error = useSelector((state: RootState) => state.orders.error);

  const [firstLoadDone, setFirstLoadDone] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const loadFirstTime = async () => {
      await dispatch(fetchOrders(userId));

      if (!cancelled) {
        setFirstLoadDone(true);
      }
    };

    void loadFirstTime();

    const interval = window.setInterval(() => {
      void dispatch(fetchOrders(userId));
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [userId, dispatch]);

  const placeOrder = (order: Order) => {
    dispatch(addOrder(order));
  };

  return {
    orders,
    placeOrder,
    loading: reduxLoading && !firstLoadDone,
    error,
  };
};
