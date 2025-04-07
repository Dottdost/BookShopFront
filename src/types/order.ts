export interface OrderItem {
  id: string; // Это поле теперь есть
  bookId: number;
  quantity: number;
  price: number;
  title?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  promoCode?: string;
}

export enum OrderStatus {
  Pending = "Pending",
  Paid = "Paid",
  Shipped = "Shipped",
  Completed = "Completed",
  Canceled = "Canceled",
}

export interface PreOrder {
  id: string;
  userName: string;
  title: string;
  author: string;
  date: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
}
