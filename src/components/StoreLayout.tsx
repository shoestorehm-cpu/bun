import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, LogIn } from 'lucide-react';
import { useStore } from '../store';

export function StoreLayout() {
  const cart = useStore(state => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-bg-base text-text-main font-sans flex flex-col">
      <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black text-accent tracking-tighter flex items-center gap-2">
            El-Koiby <span className="font-light text-white">Reserve</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/checkout" className="flex items-center gap-1.5 text-white hover:text-accent font-medium transition-colors relative">
              <ShoppingCart size={20} />
              <span className="text-sm font-semibold tracking-wide">السلة</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-accent text-primary text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-primary">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="w-[1px] h-5 bg-white opacity-20"></div>
            <Link to="/login" className="flex items-center gap-1.5 text-white hover:text-accent font-medium transition-colors">
              <LogIn size={20} />
              <span className="hidden sm:inline text-sm font-semibold tracking-wide">لوحة الإدارة</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-6 py-10">
        <Outlet />
      </main>
      <footer className="bg-primary text-white py-12 text-center text-sm border-t border-primary-light">
        <p className="opacity-70 font-medium tracking-wide">© {new Date().getFullYear()} بن الكويبي. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
