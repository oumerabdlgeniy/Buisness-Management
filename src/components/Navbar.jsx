import { Bell, Search, User } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="fixed right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white lg:left-72">
      <div className="flex h-full items-center justify-between px-6">

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Business Management
          </h2>

          <p className="text-sm text-slate-500">
            Manage your business easily
          </p>
        </div>

        <div className="flex items-center gap-4">

          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
            <Search size={20} />
          </button>

          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
            <Bell size={20} />
          </button>

          <button className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
              <User size={18} />
            </div>

            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              Admin
            </span>
          </button>

        </div>

      </div>
    </header>
  )
}