import React from 'react';
import { useStore } from '../../store';
import { PackageSearch, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const orders = useStore(state => state.orders);
  const products = useStore(state => state.products);

  const totalSales = orders.filter(o => o.status !== 'cancelled').reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  
  const stats = [
    { title: 'إجمالي المبيعات', value: `${totalSales}`, suffix: 'ج.م', icon: DollarSign },
    { title: 'إجمالي الطلبات', value: totalOrders, suffix: 'طلب', icon: ShoppingCart },
    { title: 'طلبات مكتملة', value: completedOrders, suffix: 'مكتمل', icon: TrendingUp },
    { title: 'المنتجات', value: products.length, suffix: 'صنف', icon: PackageSearch },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center bg-transparent pb-4 border-b border-border">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-black text-primary mb-1 tracking-tight">نظام الإدارة المتكامل</h1>
          <p className="text-[15px] font-medium text-text-muted">مرحباً بك، إليك ملخص عمليات اليوم والإحصائيات العامة.</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="bg-bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="text-[13px] font-bold uppercase tracking-wider text-text-muted">
                  {stat.title}
                </div>
                <div className="bg-primary/5 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-accent transition-colors">
                  <Icon size={20} />
                </div>
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <div className="text-[36px] font-black tracking-tight text-primary leading-none">{stat.value}</div>
                <div className="text-[14px] font-bold text-text-muted">{stat.suffix}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-bg-surface rounded-3xl border border-border flex flex-col overflow-hidden shadow-sm"
      >
        <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-table-head">
          <h2 className="text-[18px] font-extrabold text-primary">أحدث العمليات</h2>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-right border-collapse">
            <thead className="text-text-muted">
              <tr>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">رقم العملية</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">التاريخ</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">المصدر</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">المبلغ</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 7).map(order => (
                <tr key={order.id} className="hover:bg-bg-base/50 transition-colors">
                  <td className="py-4 px-6 border-b border-border text-[14px] font-mono font-bold text-primary-light">#{order.id.slice(0, 8)}</td>
                  <td className="py-4 px-6 border-b border-border text-[14px] font-medium text-text-main">{new Date(order.date).toLocaleDateString('ar-EG')}</td>
                  <td className="py-4 px-6 border-b border-border">
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-bg-base border border-border text-text-main">
                        {order.type === 'delivery' ? 'توصيل' : 'نقاط بيع (POS)'}
                     </span>
                  </td>
                  <td className="py-4 px-6 border-b border-border text-[15px] font-black text-primary">{order.total} <span className="text-[11px] text-text-muted">ج.م</span></td>
                  <td className="py-4 px-6 border-b border-border">
                    <span className={`px-3 py-1.5 text-[11px] font-bold rounded-full uppercase tracking-wide border ${
                      order.status === 'completed' ? 'bg-[#E8F5E9] text-success border-[#A5D6A7]' :
                      order.status === 'pending' ? 'bg-[#FFF3E0] text-[#E65100] border-[#FFCC80]' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {order.status === 'completed' ? 'مكتمل' : order.status === 'pending' ? 'مُعلق' : 'مُلغى'}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-text-muted text-[15px] font-medium">لا توجد عمليات مسجلة بعد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
