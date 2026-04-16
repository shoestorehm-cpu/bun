import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { LogIn, ArrowRight, Coffee } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
         <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary-light blur-3xl mix-blend-multiply"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-accent blur-3xl mix-blend-multiply"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-border p-10 relative z-10"
      >
        <div className="flex flex-col flex-1 items-center mb-10 text-center">
          <div className="w-16 h-16 bg-primary text-accent rounded-2xl flex items-center justify-center mb-6 shadow-md rotate-3">
             <Coffee size={32} />
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight mb-2">El-Koiby Reserve</h1>
          <p className="text-text-muted text-[15px] font-medium">تسجيل الدخول للنظام الإداري</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[13px] font-bold text-text-muted mb-2 uppercase tracking-widest">اسم المستخدم</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-5 py-4 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none text-[15px] transition-all bg-bg-base/30 font-semibold"
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-text-muted mb-2 uppercase tracking-widest">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-4 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none text-[15px] transition-all bg-bg-base/30 font-semibold"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-[16px] hover:bg-primary-light flex justify-center items-center gap-2 mt-4 transition-transform active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            تسجيل الدخول
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-10 p-6 bg-bg-base border border-border rounded-2xl">
          <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <LogIn size={14} /> بيانات للتجربة السريعة:
          </p>
          <div className="space-y-2 text-[13px] font-semibold text-primary">
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span>المدير:</span>
              <span className="font-mono bg-white px-2 py-1 rounded shadow-sm">admin / 123</span>
            </div>
            <div className="flex justify-between items-center">
              <span>الكاشير:</span>
              <span className="font-mono bg-white px-2 py-1 rounded shadow-sm">cashier1 / 123</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
