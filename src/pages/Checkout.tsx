import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, MapPin, Phone, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function Checkout() {
  const cart = useStore(state => state.cart);
  const updateCartQuantity = useStore(state => state.updateCartQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const addOrder = useStore(state => state.addOrder);
  const clearCart = useStore(state => state.clearCart);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    addOrder({
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      items: [...cart],
      total,
      type: 'delivery',
      customerName: formData.name,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      status: 'pending'
    });

    clearCart();
    alert('تم استلام طلبك بنجاح! سيتم التواصل معك قريباً.');
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-24 bg-bg-surface rounded-3xl border border-border shadow-sm mt-10"
      >
        <div className="w-24 h-24 bg-bg-base rounded-full flex items-center justify-center mx-auto mb-6 text-border">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-black text-primary mb-3">السلة فارغة</h2>
        <p className="text-text-muted mb-8 font-medium">قم بإضافة بعض المنتجات لتتمكن من إتمام الطلب.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-light flex items-center justify-center gap-2 mx-auto transition-colors shadow-md"
        >
          <ArrowLeft size={20} />
          العودة للمتجر
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10 items-start">
      {/* Form Section */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-3/5 bg-bg-surface rounded-3xl p-8 border border-border shadow-sm"
      >
        <h2 className="text-[26px] font-black text-primary border-b border-border pb-5 mb-8">تفاصيل التوصيل</h2>
        <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="flex items-center gap-2 text-[14px] font-bold text-text-muted mb-2 uppercase tracking-wide">
              <User size={16} /> الاسم بالكامل
            </label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-4 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-[15px] font-semibold bg-bg-base/30 transition-shadow"
              placeholder="مثال: أحمد محمد"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[14px] font-bold text-text-muted mb-2 uppercase tracking-wide">
              <Phone size={16} /> رقم الهاتف
            </label>
            <input 
              required
              type="tel" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full px-5 py-4 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-[15px] font-semibold bg-bg-base/30 transition-shadow text-left"
              dir="ltr"
              placeholder="+20 100 000 0000"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[14px] font-bold text-text-muted mb-2 uppercase tracking-wide">
              <MapPin size={16} /> العنوان بالتفصيل
            </label>
            <textarea 
              required
              rows={3}
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full px-5 py-4 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-[15px] font-semibold bg-bg-base/30 resize-none transition-shadow leading-relaxed"
              placeholder="المدينة، الحي، الشارع، رقم المبنى والشقة"
            ></textarea>
          </div>
        </form>
      </motion.div>

      {/* Cart Summary */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-2/5 bg-primary text-white rounded-3xl p-8 border border-primary-light shadow-2xl sticky top-28"
      >
        <h2 className="text-[26px] font-black text-white border-b border-white/20 pb-5 mb-6 flex items-center justify-between">
          <span>ملخص الطلب</span>
          <span className="text-accent">{cart.length}</span>
        </h2>
        
        <div className="flex flex-col gap-4 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {cart.map(item => (
            <div key={`${item.product.id}-${item.grindType || ''}`} className="bg-white/10 rounded-2xl p-4 flex flex-col gap-3 backdrop-blur-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-[15px] mb-1">{item.product.name}</div>
                  {item.grindType && (
                    <div className="text-[12px] text-accent font-semibold tracking-wide">الطحنة: {item.grindType}</div>
                  )}
                </div>
                <div className="font-black text-[16px]">{item.product.price * item.quantity} ج.م</div>
              </div>
              
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-white/10 p-1">
                  <button 
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-7 h-7 flex items-center justify-center rounded text-white hover:bg-white/20 disabled:opacity-50 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-[13px]">{item.quantity}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateCartQuantity(item.product.id, item.quantity - 1);
                      } else {
                        removeFromCart(item.product.id);
                      }
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded text-white hover:bg-white/20 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                </div>
                <button 
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-red-300 hover:text-red-200 hover:bg-red-400/20 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 pt-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-[16px] font-bold opacity-80 uppercase tracking-widest">الإجمالي النهائي</span>
            <span className="text-[36px] font-black leading-none text-accent">{total} <span className="text-[16px] text-white/60">ج.م</span></span>
          </div>
        </div>
        
        <button 
          form="checkout-form"
          type="submit" 
          className="w-full bg-accent text-primary py-4 rounded-xl font-black text-[18px] hover:bg-white flex justify-center items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
        >
          تأكيد الطلب
        </button>
      </motion.div>
    </div>
  );
}
