export interface Review {
  id: string;
  userId: string;
  bookId: number;
  rating: number;
  comment: string;
  createdAt: string;
  userName?: string; // Добавим для отображения
}
