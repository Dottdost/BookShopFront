import { useDispatch, useSelector } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
} from "../store/slices/favoritesSlice";
import { RootState } from "../store";
import { Book } from "../types/book";

export const useFavorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const addFavorite = (book: Book) => {
    dispatch(addToFavorites(book));
  };

  const removeFavorite = (bookId: number) => {
    dispatch(removeFromFavorites(bookId));
  };

  const isFavorite = (bookId: number) => {
    return favorites.some((item) => item.id === bookId);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
