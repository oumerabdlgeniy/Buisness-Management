import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useContext } from 'react'
import { AppSettingsContext } from '../context/AppSettingsProvider'

export default function DashboardLayout({ children }) {
  const { compactMode } = useContext(AppSettingsContext)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />

      <Navbar />

      <main className={`lg:ml-72 ${compactMode ? '[&>div]:p-4' : ''}`}>
        {children}
      </main>
    </div>
  )
}
