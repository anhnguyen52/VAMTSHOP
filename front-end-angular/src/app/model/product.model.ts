export interface Size {
  size: string;
  quantity: number;
}

export interface ImageUrl {
  url: string;
  public_id: string;
}

export type ProductStatus = 'available' | 'out_of_stock' | 'disabled';

export interface Product {
  _id?: string; 
  product_name: string;
  category_id?: string; 
  collection_id?: string; 
  price: number;
  stock: number;
  sizes: Size[];
  description: string;
  image_urls: ImageUrl[];
  status: ProductStatus;
  sku?: string; 
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}
