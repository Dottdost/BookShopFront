export interface PromoCode {
  id: number;
  code: string;
  discount: number;
  expiryDate: string; // ISO-строка даты
  isActive: boolean;
}
