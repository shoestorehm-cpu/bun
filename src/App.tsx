import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreLayout } from './components/StoreLayout';
import { AdminLayout } from './components/AdminLayout';
import Store from './pages/Store';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import POS from './pages/admin/POS';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import SettingsPage from './pages/admin/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Store */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<Store />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        <Route path="/login" element={<Login />} />

        {/* Admin Pages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pos" element={<POS />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
