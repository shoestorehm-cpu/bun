import React, { useState } from 'react';
import { useStore } from '../../store';
import { Product, ProductCategory } from '../../types';
import { Search, Plus, Minus, Trash2, ShoppingBag, Coffee } from 'lucide-react';
import { motion } from 'motion/react';

export default function POS() {
  const products = useStore(state => state.products);
  const cart = useStore(state => state.cart);
  const addToCart = useStore(state => state.addToCart);
  const updateCartQuantity = useStore(state => state.updateCartQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const clearCart = useStore(state => state.clearCart);
  const addOrder = useStore(state => state.addOrder);
  const currentUser = useStore(state => state.currentUser);

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    addOrder({
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      items: [...cart],
      total: cartTotal,
      type: 'pos',
      status: 'completed',
      cashierId: currentUser?.id
    });
    
    alert('تم إتمام الطلب بنجاح وطباعة الإيصال');
    clearCart();
    window.print();
  };

  return (
    <div className="flex h-[calc(100vh-64px)] gap-6 no-print">
      {/* Products Section */}
      <div className="flex-1 flex flex-col bg-bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
        {/* Header & Filters */}
        <div className="p-6 border-b border-border bg-table-head">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-3.5 text-text-muted" size={20} />
              <input 
                type="text" 
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm font-semibold transition-shadow"
              />
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', name: 'الكل' },
              { id: 'coffee_beans', name: 'بن مختص' },
              { id: 'drinks', name: 'مشروبات' },
              { id: 'accessories', name: 'إكسسوارات' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white border border-border text-text-muted hover:border-primary/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-bg-base/30">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={product.id}
                onClick={() => addToCart({ product, quantity: 1, grindType: product.category === 'coffee_beans' ? 'مضبوط' : undefined })}
                disabled={product.stock <= 0}
                className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col text-right hover:border-primary/40 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="h-32 w-full bg-bg-base flex items-center justify-center border-b border-border overflow-hidden p-4">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                  ) : (
                    <Coffee size={40} className="text-primary/20" />
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow w-full">
                  <div className="font-extrabold text-[14px] text-primary mb-1 line-clamp-1">{product.name}</div>
                  <div className="text-[11px] text-text-muted mb-3 flex-grow">{product.stock} متوفر</div>
                  <div className="font-black text-accent text-[16px]">{product.price} <span className="text-[10px]">ج.م</span></div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-[380px] bg-bg-surface rounded-3xl border border-border shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border bg-primary text-white flex justify-between items-center">
          <h2 className="font-extrabold text-[18px] flex items-center gap-2">
            <ShoppingBag size={20} className="text-accent" />
            سلة الطلبات
          </h2>
          {cart.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-xs text-red-300 hover:text-red-200 font-bold tracking-wide transition-colors"
            >
              إفراغ السلة
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg-base/10">
          {cart.map(item => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={`${item.product.id}-${item.grindType || ''}`} 
              className="bg-white border border-border p-4 rounded-2xl flex flex-col gap-3 shadow-sm hover:border-primary/20 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-[14px] text-primary">{item.product.name}</div>
                  {item.grindType && (
                    <div className="text-[11px] font-semibold text-accent mt-0.5">الطحنة: {item.grindType}</div>
                  )}
                </div>
                <div className="font-black text-[15px]">{item.product.price * item.quantity} <span className="text-[10px] text-text-muted">ج.م</span></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 bg-bg-base rounded-lg p-1 border border-border">
                  <button 
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-primary hover:bg-bg-surface disabled:opacity-50"
                  >
                    <Plus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-[14px]">{item.quantity}</span>
                  <button 
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateCartQuantity(item.product.id, item.quantity - 1);
                      } else {
                        removeFromCart(item.product.id);
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-primary hover:bg-bg-surface"
                  >
                    <Minus size={14} />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-60">
              <ShoppingBag size={48} className="mb-4 text-border" />
              <p className="font-bold text-[15px]">السلة فارغة</p>
              <p className="text-[12px] mt-1">اختر منتجات من القائمة لإضافتها</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-border">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[14px] font-bold text-text-muted uppercase tracking-wider">الإجمالي المطلوب</span>
            <span className="text-[32px] font-black text-primary leading-none">{cartTotal} <span className="text-[16px] text-text-muted">ج.م</span></span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-[16px] hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-[0.98]"
          >
            إتمام الدفع وطباعة
          </button>
        </div>
      </div>

      {/* Print Receipt Template - Hidden unless printing */}
      <div className="hidden print-only fixed inset-0 bg-white z-50 p-8 w-[80mm] mx-auto text-black font-sans">
        {/* Print template exactly matches the previous iteration's logic but uses the generic store name */}
        <div className="text-center border-b border-black pb-4 mb-4">
          <h1 className="text-2xl font-black mb-1">El-Koiby Reserve</h1>
          <p className="text-sm">فاتورة مبيعات نقاط البيع</p>
          <p className="text-sm">{new Date().toLocaleString('ar-EG')}</p>
        </div>
        
        <table className="w-full text-sm mb-4">
          <thead className="border-b border-black">
            <tr>
              <th className="text-right pb-2">الصنف</th>
              <th className="text-center pb-2">الكمية</th>
              <th className="text-left pb-2">السعر</th>
            </tr>
          </thead>
          <tbody className="border-b border-black">
            {cart.map((item, idx) => (
              <tr key={idx}>
                <td className="py-2 text-right">
                  <div className="font-bold">{item.product.name}</div>
                  {item.grindType && <div className="text-xs">{item.grindType}</div>}
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-left">{item.product.price * item.quantity} ج</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-between items-center font-black text-lg mb-8">
          <span>الإجمالي:</span>
          <span>{cartTotal} ج.م</span>
        </div>
        
        <div className="text-center text-sm">
          <p>شكراً لزيارتكم!</p>
        </div>
      </div>
    </div>
  );
}
