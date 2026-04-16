import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product, Order, Settings, CartItem } from './types';

interface AppState {
  currentUser: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  settings: Settings;
  cart: CartItem[];
  
  // Actions
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  
  setSettings: (settings: Settings) => void;
  
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;

  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
}

const defaultProducts: Product[] = [
  { id: '1', name: 'بن برازيلي محمص', category: 'coffee_beans', price: 450, stock: 50, description: 'بن برازيلي عالي الجودة' },
  { id: '2', name: 'بن كولومبي', category: 'coffee_beans', price: 550, stock: 30, description: 'بن كولومبي بنكهة الفواكه' },
  { id: '3', name: 'كابوتشينو', category: 'drinks', price: 45, stock: 100, description: 'مزيج الإسبريسو مع الحليب المبخر' },
  { id: '4', name: 'كوفي ميكس', category: 'drinks', price: 25, stock: 200, description: 'مشروب القهوة السريع' },
];

const defaultUsers: User[] = [
  { id: '1', username: 'admin', password: '123', role: 'manager' },
  { id: '2', username: 'cashier1', password: '123', role: 'cashier' },
];

const defaultSettings: Settings = {
  storeName: 'بن الكويبي',
  whatsappNumber: '201000000000',
  reportEmail: 'admin@elkoiby.com'
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: defaultUsers,
      products: defaultProducts,
      orders: [],
      settings: defaultSettings,
      cart: [],

      login: (username, password) => {
        const user = get().users.find(u => u.username === username && u.password === password);
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null }),
      
      setSettings: (settings) => set({ settings }),
      
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (product) => set((state) => ({
        products: state.products.map(p => p.id === product.id ? product : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),

      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      })),

      addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => i.product.id === item.product.id && i.grindType === item.grindType);
        if (existing) {
          return {
            cart: state.cart.map(i => i === existing ? { ...i, quantity: i.quantity + item.quantity } : i)
          };
        }
        return { cart: [...state.cart, item] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(i => i.product.id !== productId)
      })),
      clearCart: () => set({ cart: [] }),
      updateCartQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(i => i.product.id === productId ? { ...i, quantity } : i)
      })),
    }),
    {
      name: 'el-koiby-storage',
    }
  )
);
