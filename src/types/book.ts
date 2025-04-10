export interface BookAttribute {
  id: string;
  name: string;
  value?: string;
}

export interface Genre {
  id: number;
  genreName: string;
  parentGenreId?: number;
}

export interface Publisher {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  genreId?: number;
  publisherId?: number;
  genreName?: string;
  publisherName?: string;
  attributes?: BookAttribute[];
}

export interface Warehouse {
  bookId: number;
  quantity: number;
  updatedAt: string;
}
