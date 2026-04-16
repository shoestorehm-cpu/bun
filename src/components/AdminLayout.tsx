import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { LayoutDashboard, ShoppingBag, PackageSearch, Settings, LogOut, TerminalSquare, Coffee } from 'lucide-react';

export function AdminLayout() {
  const currentUser = useStore(state => state.currentUser);
  const logout = useStore(state => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'الرئيسية', path: '/admin', icon: LayoutDashboard },
    { name: 'الطلبات', path: '/admin/orders', icon: ShoppingBag },
    { name: 'نظام الكاشير', path: '/admin/pos', icon: TerminalSquare },
    { name: 'المنتجات والمخزون', path: '/admin/products', icon: PackageSearch },
  ];

  if (currentUser.role === 'manager') {
    navItems.push({ name: 'إعدادات النظام', path: '/admin/settings', icon: Settings });
  }

  return (
    <div className="flex h-screen bg-bg-base text-text-main font-sans">
      {/* Sidebar - Dark Premium Theme */}
      <aside className="w-64 bg-primary text-white flex flex-col no-print border-l border-primary-light shadow-xl z-20">
        <div className="px-6 py-8 border-b border-primary-light/50 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent text-primary rounded-xl flex items-center justify-center font-black">
            <Coffee size={24} />
          </div>
          <div>
            <h2 className="text-[18px] leading-tight font-black tracking-tight text-white mb-0">El-Koiby</h2>
            <div className="text-accent text-[12px] font-semibold tracking-widest uppercase">Reserve Staff</div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-[14px] font-semibold rounded-xl transition-all ${
                  isActive 
                    ? 'text-white bg-primary-light shadow-md' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-accent' : 'opacity-70'} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 m-3 bg-primary-light/30 rounded-2xl border border-white/10 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-accent font-bold">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-[13px] font-bold text-white leading-tight">{currentUser.username}</div>
              <div className="text-[11px] text-accent font-semibold tracking-wide">
                {currentUser.role === 'manager' ? 'MANAGER' : 'CASHIER'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 bg-white/5 hover:bg-red-500/20 text-white hover:text-red-400 py-2.5 rounded-xl transition-colors text-xs font-bold tracking-wide uppercase"
          >
            <LogOut size={14} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto print:overflow-visible print:w-full flex flex-col p-8 print:p-0 relative">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
