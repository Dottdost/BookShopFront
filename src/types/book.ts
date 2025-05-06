export interface BookAttribute {
  id: string;
  name: string;
  value?: string;
}

export interface Publisher {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  bookIds?: number[];
}

export interface Genre {
  id: number;
  name: string;
  parentGenreId?: number;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  genreId?: string;
  publisherId?: string;
  attributes?: BookAttribute[];
}

export interface Warehouse {
  bookId: number;
  quantity: number;
  updatedAt: string;
}
