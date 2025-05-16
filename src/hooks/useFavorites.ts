import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../store/slices/favoritesSlice";
import { RootState } from "../store";
import { Book } from "../types/book";

const getFavoritesKey = (userId: string) => `favorites_${userId}`;

export const useFavorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const user = useSelector((state: RootState) => state.auth.user);

  // Храним id пользователя, для которого мы уже загрузили favorites
  const loadedUserIdRef = useRef<string | null>(null);

  // Флаг, показывающий, что favorites загружены
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка favorites — только если пользователь изменился
  useEffect(() => {
    if (user && loadedUserIdRef.current !== user.id) {
      const key = getFavoritesKey(user.id);
      console.log(`[Favorites] Loading favorites for user: ${user.id}`);
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            dispatch(setFavorites(parsed));
            console.log(`[Favorites] Loaded favorites:`, parsed);
          } else {
            dispatch(setFavorites([]));
          }
        } catch (error) {
          console.error("Failed to parse favorites from localStorage", error);
          dispatch(setFavorites([]));
        }
      } else {
        dispatch(setFavorites([]));
      }
      loadedUserIdRef.current = user.id;
      setIsLoaded(true);
    }
    if (!user) {
      dispatch(setFavorites([]));
      loadedUserIdRef.current = null;
      setIsLoaded(true);
    }
  }, [user, dispatch]);

  // Сохраняем favorites в localStorage только после загрузки и при изменениях
  useEffect(() => {
    if (user && isLoaded) {
      const key = getFavoritesKey(user.id);
      console.log(
        `[Favorites] Saved favorites for user: ${user.id}`,
        favorites
      );
      localStorage.setItem(key, JSON.stringify(favorites));
    }
  }, [favorites, user, isLoaded]);

  const addFavorite = (book: Book) => {
    console.log(`[Favorites] Adding favorite: ${book.id}`);
    dispatch(addToFavorites(book));
  };

  const removeFavorite = (bookId: number) => {
    console.log(`[Favorites] Removing favorite: ${bookId}`);
    dispatch(removeFromFavorites(bookId));
  };

  const isFavorite = (bookId: number) => {
    return favorites.some((item) => item.id === bookId);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite, isLoaded };
};
