import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useContext, useState } from 'react'
import { AppSettingsContext } from '../context/AppSettingsProvider'

export default function DashboardLayout({ children }) {
  const { compactMode } = useContext(AppSettingsContext)
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    window.innerWidth >= 1024 && localStorage.getItem('sidebarVisible') !== 'false'
  )

  const toggleSidebar = () => {
    setSidebarOpen((isOpen) => {
      const nextOpen = !isOpen
      localStorage.setItem('sidebarVisible', String(nextOpen))
      return nextOpen
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Navbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      <main className={`${sidebarOpen ? 'lg:ml-72' : ''} min-w-0 ${compactMode ? '[&>div]:p-4' : ''}`}>
        {children}
      </main>
    </div>
  )
}
