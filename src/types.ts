export type Role = 'manager' | 'cashier' | 'employee';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: Role;
}

export type ProductCategory = 'coffee_beans' | 'drinks' | 'accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  image?: string;
  description?: string;
}

export interface Settings {
  storeName: string;
  whatsappNumber: string;
  reportEmail: string;
  gasUrl?: string; // Google Apps Script Web App URL
  dbId?: string;   // Database Spreadsheet ID
  folderId?: string; // Google Drive Folder ID
}

export interface CartItem {
  product: Product;
  quantity: number;
  grindType?: string; // e.g. espresso, turkish, whole bean
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  type: 'pos' | 'delivery';
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  status: 'pending' | 'completed' | 'cancelled';
  cashierId?: string;
}
