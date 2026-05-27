import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SellerLayout from './layouts/SellerLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetail from './pages/buyer/ProductDetail'
import Cart from './pages/buyer/Cart'
import Wishlist from './pages/buyer/Wishlist'
import Orders from './pages/buyer/Orders'
import Profile from './pages/buyer/Profile'
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerProducts from './pages/seller/SellerProducts'
import ListProduct from './pages/seller/ListProduct'
import PricingDecision from './pages/seller/PricingDecision'
import SellerDecisions from './pages/seller/SellerDecisions'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRequests from './pages/admin/AdminRequests'
import AdminRequestDetail from './pages/admin/AdminRequestDetail'

const DefaultLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
)

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
      <p className="text-gray-500">You don't have permission to view this page.</p>
    </div>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>

          {/* Public + Buyer + Admin — share Navbar/Footer */}
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route path="/cart" element={
              <ProtectedRoute role="BUYER"><Cart /></ProtectedRoute>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute role="BUYER"><Wishlist /></ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute role="BUYER"><Orders /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />

          </Route>

          {/* Admin — own layout with sidebar */}
          <Route element={<ProtectedRoute role="ADMIN" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/requests" element={<AdminRequests />} />
              <Route path="/admin/requests/:requestId" element={<AdminRequestDetail />} />
            </Route>
          </Route>

          {/* Seller — own layout with sidebar */}
          <Route element={<ProtectedRoute role="SELLER" />}>
            <Route element={<SellerLayout />}>
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/products" element={<SellerProducts />} />
              <Route path="/seller/products/new" element={<ListProduct />} />
              <Route path="/seller/products/:id/decision" element={<PricingDecision />} />
              <Route path="/seller/decisions" element={<SellerDecisions />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
