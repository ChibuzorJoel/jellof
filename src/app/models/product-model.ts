export interface Product {
  id?: string;        // frontend-friendly
  _id?: string;       // backend (MongoDB)

  name: string;
  category: string;
  price: number;

  /* ================= MEDIA ================= */
  image: string;
  images?: string[];

  /* ================= DESCRIPTION ================= */
  description?: string;

  /* ================= FLAGS ================= */
  isNew?: boolean;
  inStock?: boolean;

  /* ================= VARIANTS ================= */
  colors?: string[];
  sizes?: string[];

  /* ================= PRICING ================= */
  originalPrice?: number;     // Enables SALE badge & discount %
  
  /* ================= RATINGS ================= */
  rating?: number;            // 1–5 stars
  reviewCount?: number;

  /* ================= INVENTORY ================= */
  stockQuantity?: number;
  sku?: string;

  /* ================= TIMESTAMPS ================= */
  createdAt?: Date;
  updatedAt?: Date;
}