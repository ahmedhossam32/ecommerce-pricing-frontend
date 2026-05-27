import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, role }) {
  const { user, token } = useAuth()
  if (!token || !user) return <Navigate to="/" replace />
  if (role && user.role !== role) return <Navigate to="/unauthorized" replace />
  return children ?? <Outlet />
}

export default ProtectedRoute
