import React, { useState } from 'react';
import { useStore } from '../../store';
import { Product, ProductCategory } from '../../types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Products() {
  const products = useStore(state => state.products);
  const addProduct = useStore(state => state.addProduct);
  const updateProduct = useStore(state => state.updateProduct);
  const deleteProduct = useStore(state => state.deleteProduct);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const emptyProduct: Product = {
    id: '',
    name: '',
    category: 'coffee_beans',
    price: 0,
    stock: 0,
    description: '',
    image: ''
  };

  const [formData, setFormData] = useState<Product>(emptyProduct);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ ...emptyProduct, id: Date.now().toString() });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(emptyProduct);
    setEditingProduct(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(formData);
    } else {
      addProduct(formData);
    }
    handleCloseModal();
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center bg-transparent pb-4 border-b border-border">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-black text-primary mb-1 tracking-tight">المنتجات والمخزون</h1>
          <p className="text-[15px] font-medium text-text-muted">إضافة وتعديل وحذف المنتجات</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-light flex items-center gap-2 transition-all shadow-md"
        >
          <Plus size={20} />
          إضافة منتج جديد
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-surface rounded-3xl border border-border flex flex-col overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto p-4">
          <table className="w-full text-right border-collapse">
            <thead className="bg-table-head text-text-muted rounded-xl">
              <tr>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">المنتج</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">القسم</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">السعر</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">المخزون</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="hover:bg-bg-base/50 transition-colors group">
                  <td className="py-4 px-6 border-b border-border">
                    <div className="flex items-center gap-4">
                      {product.image ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-border shadow-sm">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-bg-base border border-border flex items-center justify-center text-[10px] text-text-muted font-bold">صورة</div>
                      )}
                      <div>
                        <div className="font-extrabold text-[15px] text-primary">{product.name}</div>
                        <div className="text-[12px] text-text-muted max-w-[200px] truncate">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-border">
                    <span className="inline-flex items-center px-3 py-1 bg-bg-base border border-border rounded-full text-[12px] font-bold text-text-main">
                      {product.category === 'coffee_beans' ? 'بن' : 
                       product.category === 'drinks' ? 'مشروبات' : 'إكسسوارات'}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b border-border">
                    <div className="font-black text-[15px] text-primary">{product.price} <span className="text-[11px] font-bold text-text-muted">ج.م</span></div>
                  </td>
                  <td className="py-4 px-6 border-b border-border">
                    <div className={`font-bold text-[14px] ${product.stock <= 5 ? 'text-red-500' : 'text-success'}`}>
                      {product.stock}
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-border text-left">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-muted font-medium">لا توجد منتجات.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal / Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-surface rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-white/20"
            >
              <div className="flex justify-between items-center p-6 border-b border-border bg-table-head">
                <h3 className="font-extrabold text-[20px] text-primary">
                  {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
                </h3>
                <button onClick={handleCloseModal} className="text-text-muted hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-8 flex flex-col gap-5">
                
                <div>
                  <label className="block text-[13px] font-bold text-text-muted mb-2 uppercase tracking-wide">اسم المنتج</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm font-semibold transition-shadow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-text-muted mb-2 uppercase tracking-wide">القسم</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value as ProductCategory})}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm font-semibold bg-white cursor-pointer"
                    >
                      <option value="coffee_beans">بن مختص</option>
                      <option value="drinks">مشروبات</option>
                      <option value="accessories">إكسسوارات</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-text-muted mb-2 uppercase tracking-wide">رابط الصورة (اختياري)</label>
                    <input 
                      type="url" 
                      value={formData.image || ''}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      placeholder="https://..."
                      className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-text-muted mb-2 uppercase tracking-wide">السعر</label>
                    <input 
                      required
                      type="number" 
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm font-black text-coffee-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-text-muted mb-2 uppercase tracking-wide">المخزون المتوفر</label>
                    <input 
                      required
                      type="number" 
                      min="0"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm font-black text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-text-muted mb-2 uppercase tracking-wide">وصف للمنتج</label>
                  <textarea 
                    rows={3}
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm font-medium resize-none leading-relaxed"
                  ></textarea>
                </div>

                <div className="pt-4 mt-2 border-t border-border flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-border rounded-xl text-sm font-bold text-text-muted hover:bg-bg-base transition-colors"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-light transition-colors shadow-md"
                  >
                    حفظ البيانات
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
