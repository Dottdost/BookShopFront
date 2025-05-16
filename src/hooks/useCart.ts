import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  setCartItems,
} from "../store/slices/cartSlice";
import { OrderItem } from "../types/order";
import { Book } from "../types/book";

const getCartKey = (userId: string) => `cart_${userId}`;

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);

  // Ref для запомнания id пользователя, для которого уже загружена корзина
  const loadedUserIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка корзины из localStorage только один раз при смене пользователя
  useEffect(() => {
    if (user && loadedUserIdRef.current !== user.id) {
      const stored = localStorage.getItem(getCartKey(user.id));
      if (stored) {
        try {
          const parsed: OrderItem[] = JSON.parse(stored);
          dispatch(setCartItems(parsed));
        } catch {
          dispatch(setCartItems([]));
        }
      } else {
        dispatch(setCartItems([]));
      }
      loadedUserIdRef.current = user.id;
      setIsLoaded(true);
    }
    if (!user) {
      dispatch(setCartItems([]));
      loadedUserIdRef.current = null;
      setIsLoaded(true);
    }
  }, [user, dispatch]);

  // Сохраняем корзину в localStorage только после загрузки и при изменении
  useEffect(() => {
    if (user && isLoaded) {
      localStorage.setItem(getCartKey(user.id), JSON.stringify(cartItems));
      console.log(`[Cart] Saved cart for user: ${user.id}`, cartItems);
    }
  }, [cartItems, user, isLoaded]);

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
