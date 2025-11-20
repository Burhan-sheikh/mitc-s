import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';

// Placeholder components - will be created next
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PublicLayout } from '@/components/common/PublicLayout';

// Public pages
import HomePage from '@/pages/public/HomePage';
import ProductsPage from '@/pages/public/ProductsPage';
import ProductDetailPage from '@/pages/public/ProductDetailPage';
import AboutPage from '@/pages/public/AboutPage';
import ContactPage from '@/pages/public/ContactPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// Admin pages
import AdminDashboard from '@/pages/admin/DashboardPage';
import ProductsManagement from '@/pages/admin/ProductsPage';
import ChatsManagement from '@/pages/admin/ChatsPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import ReviewsManagement from '@/pages/admin/ReviewsPage';
import UsersManagement from '@/pages/admin/UsersPage';
import SettingsPage from '@/pages/admin/SettingsPage';

function App() {
  const { loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          isAdmin ? (
            <AdminLayout>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductsManagement />} />
                <Route path="chats" element={<ChatsManagement />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="reviews" element={<ReviewsManagement />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="settings" element={<SettingsPage />} />
              </Routes>
            </AdminLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;