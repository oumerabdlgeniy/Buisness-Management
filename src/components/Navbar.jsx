
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { ThemeContext } from '../context/ThemeProvider'
import { LanguageContext } from '../context/LanguageProvider'
import { AppSettingsContext, formatCurrency } from '../context/AppSettingsProvider'
import { useAuth } from '../context/AuthProvider'
import { readStorage } from '../utils/storage'
import {
  translations,
  customers as initialCustomers,
  services as initialServices,
  employees as initialEmployees,
  appointments as initialAppointments,
  payments as initialPayments,
} from '../data/data'

import {
  Bell,
  Search,
  User,
  Moon,
  Sun,
  Globe,
  ChevronDown,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { darkMode, toggleTheme } = useContext(ThemeContext)
  const { language, setLanguage } = useContext(LanguageContext)
  const { currency, exchangeRates, emailNotifications, appointmentNotifications } = useContext(AppSettingsContext)
  const { logout } = useAuth()

  const [showLanguages, setShowLanguages] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    return readStorage('readNotificationIds', [])
  })
  const [records, setRecords] = useState({
    customers: initialCustomers,
    services: initialServices,
    employees: initialEmployees,
    appointments: initialAppointments,
    payments: initialPayments,
  })

  const [profileName, setProfileName] = useState(() => {
    return readStorage('profile', { name: 'Admin' }).name
  })
  const [profileImage, setProfileImage] = useState(() => {
    return readStorage('profile', {}).image || ''
  })

  const navigate = useNavigate()
  const t = translations[language]

  useEffect(() => {
    const loadRecords = () => {
      const readList = (key, fallback) => {
        return readStorage(key, fallback)
      }

      setRecords({
        customers: readList('customers', initialCustomers),
        services: readList('services', initialServices),
        employees: readList('employees', initialEmployees),
        appointments: readList('appointments', initialAppointments),
        payments: readList('payments', initialPayments),
      })
    }

    loadRecords()

    const events = [
      'customersUpdated',
      'servicesUpdated',
      'employeesUpdated',
      'appointmentsUpdated',
      'paymentsUpdated',
    ]

    events.forEach((eventName) => {
      window.addEventListener(eventName, loadRecords)
    })

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, loadRecords)
      })
    }
  }, [])

  const searchResults = searchTerm.trim()
    ? [
        ...records.customers.map((customer) => ({
          id: `customer-${customer.id}`,
          title: customer.name,
          detail: customer.email,
          type: t.customers,
          path: `/customers/${customer.id}`,
        })),
        ...records.services.map((service) => ({
          id: `service-${service.id}`,
          title: service.name,
          detail: `$${service.price}`,
          type: t.services,
          path: '/services',
        })),
        ...records.employees.map((employee) => ({
          id: `employee-${employee.id}`,
          title: employee.name,
          detail: employee.position,
          type: t.employees,
          path: '/employees',
        })),
        ...records.appointments.map((appointment) => ({
          id: `appointment-${appointment.id}`,
          title: appointment.customer,
          detail: `${appointment.service} - ${appointment.date}`,
          type: t.appointments,
          path: '/appointments',
        })),
        ...records.payments.map((payment) => ({
          id: `payment-${payment.id}`,
          title: payment.customer,
          detail: `${formatCurrency(payment.amount, currency, exchangeRates)} - ${payment.status}`,
          type: t.payments,
          path: '/payments',
        })),
      ]
        .filter((result) =>
          `${result.title} ${result.detail} ${result.type}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        .slice(0, 8)
    : []

  const notifications = [
    ...(emailNotifications ? records.payments
      .filter((payment) => payment.status === 'Pending')
      .map((payment) => ({
        id: `pending-${payment.id}`,
        text: `${t.pending}: ${payment.customer} - ${formatCurrency(payment.amount, currency, exchangeRates)}`,
        path: '/payments',
      })) : []),
    ...(appointmentNotifications ? records.appointments.slice(-5).map((appointment) => ({
      id: `appointment-${appointment.id}`,
      text: `${t.upcomingAppointments}: ${appointment.customer} - ${appointment.date}`,
      path: '/appointments',
      })) : []),
  ]

  const hasUnreadNotifications = notifications.some(
    (notification) => !readNotificationIds.includes(notification.id)
  )

  const handleNotificationsToggle = () => {
    if (!showNotifications) {
      const currentNotificationIds = notifications.map(
        (notification) => notification.id
      )

      setReadNotificationIds(currentNotificationIds)
      localStorage.setItem(
        'readNotificationIds',
        JSON.stringify(currentNotificationIds)
      )
    }

    setShowNotifications(!showNotifications)
    setShowSearch(false)
  }

  const openSearchResult = (path) => {
    navigate(path)
    setSearchTerm('')
    setShowSearch(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const updateProfileName = () => {
      const profile = readStorage('profile', { name: 'Admin', image: '' })
      setProfileName(profile.name)
      setProfileImage(profile.image || '')
    }

    window.addEventListener('profileUpdated', updateProfileName)

    return () => {
      window.removeEventListener('profileUpdated', updateProfileName)
    }
  }, [])

  return (
    <header className={`fixed right-0 top-0 z-30 min-h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80 ${sidebarOpen ? 'lg:left-72 lg:w-auto' : 'left-0 w-full'}`}>
      <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
        {/* Title */}
        <div className="flex min-w-0 flex-shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
            title="Toggle sidebar"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
              {t.navbarTitle}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.manageBusiness}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-3">
          {/* Search */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSearch(!showSearch)
                setShowNotifications(false)
              }}
              aria-label={t.search}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Search size={20} />
            </button>

            {showSearch && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <input
                  autoFocus
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />

                {searchTerm.trim() && (
                  <div className="mt-2 max-h-72 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => openSearchResult(result.path)}
                          className="w-full rounded-md px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <span className="block text-sm font-medium text-slate-900 dark:text-white">
                            {result.title}
                          </span>
                          <span className="block text-xs text-slate-500 dark:text-slate-400">
                            {result.type} - {result.detail}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
                        {t.noSearchResults}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationsToggle}
              aria-label={t.notifications}
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Bell size={20} />
              {hasUnreadNotifications && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <h3 className="px-2 pb-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {t.notifications}
                </h3>

                {notifications.length > 0 ? (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => {
                          navigate(notification.path)
                          setShowNotifications(false)
                        }}
                        className="w-full rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        {notification.text}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-2 py-2 text-sm text-slate-500 dark:text-slate-400">
                    {t.noNotifications}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="flex items-center gap-2 rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Globe size={20} />

              <span className="hidden text-sm font-medium md:block">
                {language.toUpperCase()}
              </span>
            </button>

            {showLanguages && (
              <div className="absolute right-0 top-full mt-2 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <button
                  onClick={() => {
                    setLanguage('en')
                    setShowLanguages(false)
                  }}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {t.english}
                </button>

                <button
                  onClick={() => {
                    setLanguage('am')
                    setShowLanguages(false)
                  }}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {t.amharic}
                </button>

                <button
                  onClick={() => {
                    setLanguage('ar')
                    setShowLanguages(false)
                  }}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {t.arabic}
                </button>
              </div>
            )}
          </div>

          {/* Dark / Light */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {profileImage ? (
                <img src={profileImage} alt={profileName} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                  <User size={18} />
                </div>
              )}

              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {profileName}
              </span>

              <ChevronDown size={16} />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <button
                  onClick={() => {
                    navigate('/profile')
                    setShowProfile(false)
                  }}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {t.profile}
                </button>

                <button
                  onClick={() => {
                    navigate('/settings')
                    setShowProfile(false)
                  }}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {t.settings}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={16} />
                  {t.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
