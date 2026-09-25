import { useEffect, useState, useContext } from 'react'

import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserRound,
  CalendarDays,
  CreditCard,
  BarChart3,
  CheckSquare,
  UserCircle,
  Settings,
  BriefcaseBusiness,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageProvider'
import { translations } from '../data/data'
import { AppSettingsContext } from '../context/AppSettingsProvider'

export default function Sidebar({ isOpen, onClose }) {
  const { language } = useContext(LanguageContext)
  const { role } = useContext(AppSettingsContext)

  const t = { ...translations.en, ...(translations[language] || {}) }
const [businessName, setBusinessName] = useState(
  localStorage.getItem('businessName') || 'BizFlow'
)

useEffect(() => {
  const updateBusinessName = () => {
    setBusinessName(localStorage.getItem('businessName') || 'BizFlow')
  }

  window.addEventListener('businessNameUpdated', updateBusinessName)

  return () => {
    window.removeEventListener('businessNameUpdated', updateBusinessName)
  }
}, [])
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}
      <aside className={`fixed left-0 top-0 z-50 h-dvh w-72 max-w-[85vw] overflow-y-auto border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-800 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-20 items-center border-b border-slate-200 px-6 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <BriefcaseBusiness className="text-blue-600" size={30} aria-hidden="true" />
          <div>
          <h1 className="text-2xl font-bold text-blue-600">
            {businessName}
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.navbarTitle}
          </p>
          </div>
        </div>
      </div>

      <nav
        className="p-4 pb-8"
        onClick={(event) => {
          if (window.innerWidth < 1024 && event.target.closest('a')) onClose()
        }}
      >
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {t.mainMenu}
        </p>

        <div className="space-y-1">
          <SidebarItem
            to="/"
            icon={<LayoutDashboard size={20} />}
            label={t.dashboard}
          />

          {role !== 'Employee' && <SidebarItem
            to="/customers"
            icon={<Users size={20} />}
            label={t.customers}
          />}

          {role !== 'Employee' && <SidebarItem
            to="/services"
            icon={<Briefcase size={20} />}
            label={t.services}
          />}

          {role === 'Admin' && <SidebarItem
            to="/employees"
            icon={<UserRound size={20} />}
            label={t.employees}
          />}

          {role !== 'Employee' && <SidebarItem
            to="/appointments"
            icon={<CalendarDays size={20} />}
            label={t.appointments}
          />}

          {role !== 'Employee' && <SidebarItem
            to="/payments"
            icon={<CreditCard size={20} />}
            label={t.payments}
          />}

          {role !== 'Employee' && <SidebarItem
            to="/reports"
            icon={<BarChart3 size={20} />}
            label={t.reports}
          />}

          <SidebarItem
            to="/tasks"
            icon={<CheckSquare size={20} />}
            label={t.tasks}
          />

        </div>

        <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {t.account}
        </p>

        <div className="space-y-1">
          <SidebarItem
            to="/profile"
            icon={<UserCircle size={20} />}
            label={t.profile}
          />

          <SidebarItem
            to="/settings"
            icon={<Settings size={20} />}
            label={t.settings}
          />
        </div>
      </nav>
      </aside>
    </>
  )
}

function SidebarItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
          isActive
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}
