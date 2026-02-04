export interface Product {
    id?: string;      // frontend-friendly
    _id?: string;     // backend (MongoDB)
    name: string;
    category: string;
    price: number;
    description?: string;
    image: string;
    images?: string[];
    isNew?: boolean;
    colors?: string[];
    sizes?: string[];
    inStock?: boolean;
    stockQuantity?: number;
    sku?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  