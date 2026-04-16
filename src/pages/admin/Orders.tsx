import React from 'react';
import { useStore } from '../../store';

export default function Orders() {
  const orders = useStore(state => state.orders);
  const updateOrderStatus = useStore(state => state.updateOrderStatus);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center bg-transparent pb-4 border-b border-border">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-black text-primary mb-1 tracking-tight">إدارة الطلبات</h1>
          <p className="text-[15px] font-medium text-text-muted">متابعة وإدارة سير الطلبات</p>
        </div>
      </header>
      
      <div className="bg-bg-surface rounded-3xl border border-border flex flex-col overflow-hidden shadow-sm">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-right border-collapse">
            <thead className="bg-table-head text-text-muted rounded-xl">
              <tr>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">رقم الطلب</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">التاريخ</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">النوع / العميل</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">التفاصيل</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">الإجمالي</th>
                <th className="py-4 px-6 text-[12px] font-bold tracking-widest uppercase border-b border-border">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-bg-base/50 transition-colors group">
                  <td className="py-4 px-6 border-b border-border text-[14px] font-mono font-bold text-primary-light">#{order.id.slice(0, 8)}</td>
                  <td className="py-4 px-6 border-b border-border text-[14px] font-medium text-text-main">{new Date(order.date).toLocaleString('ar-EG')}</td>
                  <td className="py-4 px-6 border-b border-border">
                    {order.type === 'delivery' ? (
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[#E3F2FD] border border-[#BBDEFB] text-[#1976D2] mb-2">دليفري</span>
                        <div className="mt-1.5 font-bold text-primary">{order.customerName}</div>
                        <div className="text-text-muted text-[12px]">{order.customerPhone}</div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[#F3E5F5] border border-[#E1BEE7] text-[#7B1FA2]">كاشير (POS)</span>
                    )}
                  </td>
                  <td className="py-4 px-6 border-b border-border text-[13px] text-text-muted">
                    <div className="max-w-xs space-y-1.5">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between border-b border-border/50 pb-1 last:border-0">
                          <span className="font-bold text-primary leading-tight"><span className="text-accent">{item.quantity}x</span> {item.product.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-border text-[15px] font-black text-primary">{order.total} <span className="text-[11px] text-text-muted">ج.م</span></td>
                  <td className="py-4 px-6 border-b border-border">
                    <div className="relative">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className={`pl-8 pr-4 py-2.5 text-[12px] rounded-xl border outline-none font-bold appearance-none cursor-pointer w-full transition-shadow hover:shadow-sm ${
                          order.status === 'completed' ? 'border-[#A5D6A7] bg-[#E8F5E9] text-success focus:ring-success/50' :
                          order.status === 'pending' ? 'border-[#FFCC80] bg-[#FFF3E0] text-[#E65100] focus:ring-[#E65100]/50' :
                          'border-red-200 bg-red-50 text-red-700 focus:ring-red-500/50'
                        }`}
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 px-6 text-center text-text-muted text-[15px] font-medium">لا توجد طلبات مسجلة بعد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
