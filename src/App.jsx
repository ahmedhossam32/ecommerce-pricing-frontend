import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetail from './pages/buyer/ProductDetail'
import Cart from './pages/buyer/Cart'
import Wishlist from './pages/buyer/Wishlist'
import Orders from './pages/buyer/Orders'
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerProducts from './pages/seller/SellerProducts'
import ListProduct from './pages/seller/ListProduct'
import PricingDecision from './pages/seller/PricingDecision'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRequests from './pages/admin/AdminRequests'

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
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Buyer */}
          <Route path="/cart" element={
            <ProtectedRoute role="BUYER"><Cart /></ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute role="BUYER"><Wishlist /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute role="BUYER"><Orders /></ProtectedRoute>
          } />

          {/* Seller */}
          <Route path="/seller/dashboard" element={
            <ProtectedRoute role="SELLER"><SellerDashboard /></ProtectedRoute>
          } />
          <Route path="/seller/products" element={
            <ProtectedRoute role="SELLER"><SellerProducts /></ProtectedRoute>
          } />
          <Route path="/seller/products/new" element={
            <ProtectedRoute role="SELLER"><ListProduct /></ProtectedRoute>
          } />
          <Route path="/seller/products/:id/decision" element={
            <ProtectedRoute role="SELLER"><PricingDecision /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/requests" element={
            <ProtectedRoute role="ADMIN"><AdminRequests /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
