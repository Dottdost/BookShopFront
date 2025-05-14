import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Order } from "../types/order";
import { addOrder, fetchOrders } from "../store/slices/ordersSlice";
import { useEffect } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Action } from "redux";

type DispatchType = ThunkDispatch<RootState, undefined, Action>;

export const useOrders = (userId: string) => {
  const dispatch: DispatchType = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.items);
  const loading = useSelector((state: RootState) => state.orders.loading);
  const error = useSelector((state: RootState) => state.orders.error);

  const placeOrder = (order: Order) => {
    dispatch(addOrder(order));
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrders(userId));
    }
  }, [userId, dispatch]);

  return { orders, placeOrder, loading, error };
};
