import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function AdminLayout() {
  const [pendingCount, setPendingCount] = useState(6)

  useEffect(() => {
    // TODO: replace with real fetch when API is ready
    // const token = localStorage.getItem('accessToken')
    // fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
    //   .then(res => res.ok ? res.json() : Promise.reject())
    //   .then(data => setPendingCount(data.pendingReview ?? 0))
    //   .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-start min-h-0">
        <AdminSidebar pendingCount={pendingCount} />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
