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
} from 'lucide-react'

import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-slate-200 bg-white lg:block">

      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">
            BizFlow
          </h1>

          <p className="text-xs text-slate-500">
            Business Management
          </p>
        </div>
      </div>

      <nav className="p-4">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        <div className="space-y-1">

          <SidebarItem
            to="/"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />

          <SidebarItem
            to="/customers"
            icon={<Users size={20} />}
            label="Customers"
          />

          <SidebarItem
            to="/services"
            icon={<Briefcase size={20} />}
            label="Services"
          />

          <SidebarItem
            to="/employees"
            icon={<UserRound size={20} />}
            label="Employees"
          />

          <SidebarItem
            to="/appointments"
            icon={<CalendarDays size={20} />}
            label="Appointments"
          />

          <SidebarItem
            to="/payments"
            icon={<CreditCard size={20} />}
            label="Payments"
          />

          <SidebarItem
            to="/reports"
            icon={<BarChart3 size={20} />}
            label="Reports"
          />

          <SidebarItem
            to="/tasks"
            icon={<CheckSquare size={20} />}
            label="Tasks"
          />

        </div>

        <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Account
        </p>

        <div className="space-y-1">

          <SidebarItem
            to="/profile"
            icon={<UserCircle size={20} />}
            label="Profile"
          />

          <SidebarItem
            to="/settings"
            icon={<Settings size={20} />}
            label="Settings"
          />

        </div>

      </nav>

    </aside>
  )
}

function SidebarItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
          isActive
            ? 'bg-blue-50 text-blue-600'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}