export interface ProductSpecification {
  label: string; // e.g. "1kg", "500ml", "Large"
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  rating?: number;
  specifications?: ProductSpecification[];
  createdAt?: Date;
  updatedAt?: Date;
  isDealOfWeek?: boolean;
  dealOrder?: number;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}
