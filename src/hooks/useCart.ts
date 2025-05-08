import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
} from "../store/slices/cartSlice";
import { OrderItem } from "../types/order";
import { Book } from "../types/book";

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const addItem = (book: Book) => {
    const item: OrderItem = {
      id: Date.now().toString(),
      bookId: book.id,
      quantity: 1,
      price: book.price,
      title: book.title,
      imageUrl: book.imageUrl,
    };
    dispatch(addToCart(item));
  };

  const removeItem = (bookId: number) => {
    dispatch(removeFromCart(bookId));
  };

  const changeQuantity = (bookId: number, quantity: number) => {
    dispatch(updateQuantity({ bookId, quantity }));
  };

  const clear = () => {
    dispatch(clearCart());
  };

  return { cartItems, addItem, removeItem, changeQuantity, clear };
};
