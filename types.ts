
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export type Category = 'Rings' | 'Earrings' | 'Bangles' | 'Bracelets' | 'Necklace' | 'Pendants' | 'All';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  additionalImages?: string[];
  videoUrl?: string;
  status: 'In Stock' | 'Limited' | 'Out of Stock';
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface Order {
  id: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  timestamp: number;
}

export interface SpecialRequest {
  id: string;
  userId: string;
  description: string;
  quantity: number;
  dueDate: string;
  image?: string;
  status: 'Pending' | 'Reviewing' | 'Accepted' | 'Rejected';
  createdAt: number;
}
