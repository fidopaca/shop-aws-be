export interface Product {
  id: string;
  count: number;
  description: string;
  price: number;
  title: string;
}

export interface CreateProductDTO {
  count: number;
  description: string;
  price: number;
  title: string;
}
