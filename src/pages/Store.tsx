import React from 'react';
import { useStore } from '../store';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

export default function Store() {
  const products = useStore(state => state.products);
  const addToCart = useStore(state => state.addToCart);

  const categories = [
    { id: 'coffee_beans', name: 'البن المختص (Reserve)' },
    { id: 'drinks', name: 'المشروبات الجاهزة' },
  ];

  const handleAddToCart = (product: Product) => {
    addToCart({ product, quantity: 1, grindType: product.category === 'coffee_beans' ? 'مضبوط' : undefined });
    alert('تمت الإضافة إلى السلة!');
  };

  return (
    <div>
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-12 mb-16 text-center shadow-lg border border-border"
        style={{
          background: 'linear-gradient(135deg, #1E3932 0%, #0c1c18 100%)'
        }}
      >
        <div className="relative z-10 py-8">
          <h1 className="text-[42px] font-extrabold text-accent mb-4 tracking-tight">El-Koiby Reserve</h1>
          <p className="text-bg-base max-w-2xl mx-auto text-[18px] leading-relaxed opacity-90">
            اكتشف تشكيلتنا الفاخرة من حبوب القهوة النادرة والمشروبات المحضرة بدقة. من محامصنا إلى كوبك.
          </p>
        </div>
      </motion.div>

      {/* Products list */}
      {categories.map((category, index) => {
        const categoryProducts = products.filter(p => p.category === category.id);
        if (categoryProducts.length === 0) return null;

        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            key={category.id} 
            className="mb-20"
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-[28px] font-black text-primary tracking-tight">
                {category.name}
              </h2>
              <div className="h-[2px] flex-grow bg-gradient-to-l from-border to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categoryProducts.map((product, pIndex) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: pIndex * 0.05 + 0.3 }}
                  key={product.id} 
                  className="group bg-bg-surface rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-xl transition-all flex flex-col"
                >
                  <div className="relative overflow-hidden w-full h-56 bg-bg-base border-b border-border flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-[14px] uppercase tracking-widest font-semibold text-text-muted opacity-60">صورة المنتج</span>
                    )}
                    <div className="absolute top-4 right-4 bg-primary text-white text-[11px] px-3 py-1 font-bold rounded-full uppercase tracking-wider backdrop-blur-sm bg-opacity-90">
                      متوفر
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-extrabold text-[18px] text-primary mb-2 leading-tight">{product.name}</h3>
                    <p className="text-[14px] text-text-muted mb-6 line-clamp-3 leading-relaxed flex-grow">{product.description}</p>
                    
                    <div className="mt-auto flex items-end justify-between border-t border-border pt-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-text-muted uppercase font-bold tracking-wider mb-1">السعر</span>
                        <span className="font-black text-coffee-dark text-[22px] leading-none">{product.price} <span className="text-[14px]">ج.م</span></span>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className="bg-primary text-white p-3.5 rounded-full hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md group-hover:-translate-y-1"
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  );
}
