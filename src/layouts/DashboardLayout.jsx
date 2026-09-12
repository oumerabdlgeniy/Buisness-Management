import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <Navbar />

      <main className="pt-20 lg:ml-72">
        {children}
      </main>

    </div>
  )
}