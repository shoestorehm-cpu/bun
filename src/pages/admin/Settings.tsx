import React, { useState } from 'react';
import { useStore } from '../../store';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const settings = useStore(state => state.settings);
  const setSettings = useStore(state => state.setSettings);
  const currentUser = useStore(state => state.currentUser);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser?.role !== 'manager') {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    alert('تم حفظ الإعدادات بنجاح!');
  };

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <header className="flex justify-between items-center bg-transparent pb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-bold text-coffee-dark mb-1 leading-tight">إعدادات النظام</h1>
          <p className="text-sm text-text-muted">التحكم في بيانات المتجر والتخزين</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[13px] font-medium text-text-muted mb-1.5">اسم المتجر / المحل</label>
            <input 
              type="text" 
              required
              value={formData.storeName}
              onChange={e => setFormData({...formData, storeName: e.target.value})}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-coffee-light outline-none text-[13px]"
            />
          </div>
          
          <div>
            <label className="block text-[13px] font-medium text-text-muted mb-1.5">رقم هاتف واتساب للإدارة (لاستقبال الطلبات)</label>
            <input 
              type="text" 
              required
              placeholder="مثال: 201xxxxxxxxx"
              value={formData.whatsappNumber}
              onChange={e => setFormData({...formData, whatsappNumber: e.target.value})}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-coffee-light outline-none text-left text-[13px]"
              dir="ltr"
            />
            <p className="text-[11px] text-text-muted mt-1.5">يجب أن يتضمن كود الدولة بدون علامة +</p>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-text-muted mb-1.5">البريد الإلكتروني للإدارة (لاستلام التقارير)</label>
            <input 
              type="email" 
              required
              value={formData.reportEmail}
              onChange={e => setFormData({...formData, reportEmail: e.target.value})}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-coffee-light outline-none text-left text-[13px]"
              dir="ltr"
            />
          </div>

          <div className="pt-6 mt-4 border-t border-border flex justify-end">
            <button 
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-light flex items-center gap-2 transition-all shadow-md"
            >
              <Save size={18} />
              حفظ الإعدادات الأساسية
            </button>
          </div>
        </form>
      </div>

      {/* GAS Setup Section */}
      <div className="bg-white border border-border shadow-sm rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-extrabold text-[20px] text-primary mb-2">ربط الجداول والتخزين السحابي (Google Apps Script)</h3>
            <p className="text-text-muted text-[13px] max-w-xl leading-relaxed">
              قم بإنشاء قاعدة البيانات الآمنة الخاصة بك على خوادم جوجل تلقائياً. ألصق رابط <span className="font-mono bg-bg-base px-1 rounded">Web App URL</span> الذي حصلت عليه بعد إضافة ملف <span className="font-mono bg-bg-base px-1 rounded text-primary font-bold">Code.gs</span> لإنشاء ومعالجة البيانات السحابية بضغطة زر.
            </p>
          </div>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-[13px] font-semibold text-text-muted mb-2">رابط الخادم السحابي (Web App URL)</label>
            <input 
              type="url" 
              placeholder="https://script.google.com/macros/s/AKI.../exec"
              value={formData.gasUrl || ''}
              onChange={e => setFormData({...formData, gasUrl: e.target.value})}
              className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-left text-[13px] font-mono tracking-wide"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-base p-4 rounded-xl border border-border">
              <span className="block text-[11px] font-bold text-text-muted uppercase mb-1">Spreadsheet ID</span>
              <div className="font-mono text-[13px] text-coffee-dark break-all">{settings.dbId ? settings.dbId : '— لم يتم الربط بعد —'}</div>
            </div>
            <div className="bg-bg-base p-4 rounded-xl border border-border">
              <span className="block text-[11px] font-bold text-text-muted uppercase mb-1">Drive Folder ID</span>
              <div className="font-mono text-[13px] text-coffee-dark break-all">{settings.folderId ? settings.folderId : '— لم يتم الربط بعد —'}</div>
            </div>
          </div>
          
          <div className="flex justify-start pt-2">
             <button 
                onClick={async () => {
                  if(!formData.gasUrl) { alert('أدخل الرابط أولاً'); return; }
                  try {
                    const res = await fetch(formData.gasUrl, {
                      method: 'POST',
                      body: JSON.stringify({ action: 'init', storeName: formData.storeName })
                    });
                    const d = await res.json();
                    if(d.success) {
                      setFormData({...formData, dbId: d.dbId, folderId: d.folderId});
                      setSettings({...settings, dbId: d.dbId, folderId: d.folderId, gasUrl: formData.gasUrl});
                      alert('تم إنشاء مساحة العمل بقواعد بيانات جوجل السحابية! المعرفات الآن مسجلة باللوحة.');
                    } else {
                      alert('حدث خطأ: ' + d.error);
                    }
                  } catch(e) {
                    alert('تعذر الاتصال بالخادم. يرجى التأكد من الرابط أو إعدادات CORS.');
                  }
                }}
                disabled={!formData.gasUrl}
                type="button"
                className="bg-coffee-dark text-white px-6 py-3 rounded-xl font-semibold hover:bg-black flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                توليد قواعد البيانات وإنشاء المجلد السحابي أوتوماتيكياً
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
