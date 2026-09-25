
import { useContext, useState } from 'react'
import { ThemeContext } from '../context/ThemeProvider'
import { LanguageContext } from '../context/LanguageProvider'
import { AppSettingsContext } from '../context/AppSettingsProvider'
import { ToastContext } from '../context/ToastProvider'
import {
  appointments as initialAppointments,
  customers as initialCustomers,
  employees as initialEmployees,
  services as initialServices,
  translations,
} from '../data/data'
import { normalizeLanguage } from '../utils/language'

function Settings() {
  const { darkMode, toggleTheme } = useContext(ThemeContext)
  const { language: activeLanguage, setLanguage: setAppLanguage } = useContext(LanguageContext)
  const { updateSettings, exchangeRates, ratesUpdatedAt } = useContext(AppSettingsContext)
  const { showToast } = useContext(ToastContext)
  const t = { ...translations.en, ...(translations[normalizeLanguage(activeLanguage)] || {}) }

  // Business Information
  const [businessName, setBusinessName] = useState(
    localStorage.getItem('businessName') || 'BizFlow'
  )

  const [phone, setPhone] = useState(
    localStorage.getItem('businessPhone') || ''
  )

  const [address, setAddress] = useState(
    localStorage.getItem('businessAddress') || ''
  )

  const [currency, setCurrency] = useState(
    localStorage.getItem('businessCurrency') || 'ETB'
  )

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(
    localStorage.getItem('emailNotifications') === 'true'
  )

  const [appointmentNotifications, setAppointmentNotifications] =
    useState(
      localStorage.getItem('appointmentNotifications') === 'true'
    )

  // Dashboard Preferences
  const [compactMode, setCompactMode] = useState(
    localStorage.getItem('compactMode') === 'true'
  )

  const [defaultPage, setDefaultPage] = useState(
    localStorage.getItem('defaultPage') || '/'
  )

  // Language
  const language = normalizeLanguage(activeLanguage)

  // Save Business Information
  const saveBusinessInformation = () => {
    updateSettings({ businessName, businessPhone: phone, businessAddress: address, currency })

    window.dispatchEvent(new Event('businessNameUpdated'))

    showToast('Business information saved successfully!')
  }

  // Save Notifications
  const saveNotifications = () => {
    updateSettings({ emailNotifications, appointmentNotifications })

    showToast('Notification settings saved successfully!')
  }

  // Save New Preferences
  const savePreferences = () => {
    const normalizedLanguage = normalizeLanguage(language)
    setAppLanguage(normalizedLanguage)
    localStorage.setItem('language', normalizedLanguage)
    updateSettings({ compactMode, defaultPage })

    window.dispatchEvent(new Event('settingsUpdated'))

    showToast('Preferences saved successfully!')
  }

  // Export Data
  const exportData = () => {
    const data = {}

    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index)
      const value = localStorage.getItem(key)

      try {
        data[key] = JSON.parse(value)
      } catch {
        data[key] = value
      }
    }

    const defaultCollections = {
      customers: initialCustomers,
      services: initialServices,
      employees: initialEmployees,
      appointments: initialAppointments,
    }

    Object.entries(defaultCollections).forEach(([key, defaultValue]) => {
      if (!(key in data)) data[key] = defaultValue
    })

    data.exportedAt = new Date().toISOString()

    const file = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: 'application/json' }
    )

    const url = URL.createObjectURL(file)
    const link = document.createElement('a')

    link.href = url
    link.download = 'bizflow-backup.json'
    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
    showToast('Business data exported successfully!')
  }

  // Reset Application Data
  const resetApplicationData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset application data?'
    )

    if (!confirmed) return

    const keysToRemove = [
      'customers',
      'employees',
      'services',
      'appointments',
      'payments',
      'tasks',
      'reports',
      'profile',
      'businessName',
      'businessPhone',
      'businessAddress',
      'businessCurrency',
      'emailNotifications',
      'appointmentNotifications',
      'compactMode',
      'defaultPage',
      'userRole',
      'language',
      'darkMode',
      'readNotificationIds',
      'usdExchangeRates',
    ]

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
    })

    showToast('Application data has been reset.')

    window.location.reload()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t.settings}
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          {t.settingsDescription}
        </p>
      </div>

      {/* Appearance */}
      <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          {t.appearance}
        </h2>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-200">
              {t.darkMode}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.changeAppearance}
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {darkMode ? t.switchToLight : t.switchToDark}
          </button>
        </div>
      </section>

      {/* Access role */}
      <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">{t.accessRole}</h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{t.accessRoleDescription}</p>
        <select
          value={localStorage.getItem('userRole') || 'Admin'}
          onChange={(event) => {
            updateSettings({ role: event.target.value })
              showToast(`${t.roleChanged} ${t[`${event.target.value.toLowerCase()}Role`]}`)
          }}
          className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
            <option value="Admin">{t.adminRole} — {t.fullAccess}</option>
            <option value="Manager">{t.managerRole} — {t.operationalAccess}</option>
            <option value="Employee">{t.employeeRole} — {t.appointmentsAndTasks}</option>
        </select>
      </section>

      {/* Notifications */}
      <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          {t.notifications}
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(event) =>
                setEmailNotifications(event.target.checked)
              }
            />

            {t.emailNotifications}
          </label>

          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              checked={appointmentNotifications}
              onChange={(event) =>
                setAppointmentNotifications(event.target.checked)
              }
            />

            {t.appointmentNotifications}
          </label>

          <button
            onClick={saveNotifications}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t.saveNotifications}
          </button>
        </div>
      </section>

      {/* Business Information */}
      <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          {t.businessInformation}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder={t.businessName}
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />

          <input
            type="text"
            placeholder={t.phoneNumber}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />

          <input
            type="text"
            placeholder={t.businessAddress}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />

          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="ETB">ETB - Ethiopian Birr</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
          </select>

          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-900/30 dark:text-blue-100">
            <p>Live reference rates: 1 USD = {exchangeRates.ETB?.toFixed(2)} ETB · {exchangeRates.EUR?.toFixed(2)} EUR</p>
            <p className="mt-1 text-xs opacity-75">
              {ratesUpdatedAt ? `Updated: ${new Date(ratesUpdatedAt).toLocaleString()}` : 'Using saved rates while offline'}
            </p>
            <a className="mt-1 inline-block text-xs underline" href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">
              Rates by ExchangeRate-API
            </a>
          </div>

          <button
            onClick={saveBusinessInformation}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t.saveBusinessInformation}
          </button>
        </div>
      </section>

      {/* Dashboard Preferences */}
      <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          {t.dashboardPreferences}
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(event) =>
                setCompactMode(event.target.checked)
              }
            />

            {t.compactDashboardMode}
          </label>

          <div>
            <label className="mb-2 block text-gray-700 dark:text-gray-200">
              {t.defaultPage}
            </label>

            <select
              value={defaultPage}
              onChange={(event) => setDefaultPage(event.target.value)}
              className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="/">Dashboard</option>
              <option value="/customers">Customers</option>
              <option value="/services">Services</option>
              <option value="/reports">Reports</option>
            </select>
          </div>
        </div>
      </section>

      {/* Language */}
      <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          {t.language}
        </h2>

        <select
          value={language}
          onChange={(event) => setAppLanguage(normalizeLanguage(event.target.value))}
          className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="en">English</option>
          <option value="am">Amharic</option>
          <option value="ar">Arabic</option>
        </select>

        <button
          onClick={savePreferences}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {t.savePreferences}
        </button>
      </section>

      {/* Data Management */}
      <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          {t.dataManagement}
        </h2>

        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {t.exportDescription}
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportData}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            {t.exportData}
          </button>

          <button
            onClick={resetApplicationData}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            {t.resetApplicationData}
          </button>
        </div>
      </section>

      {/* Help and About */}
      <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          {t.helpAbout}
        </h2>

        <div className="space-y-2 text-gray-700 dark:text-gray-200">
          <p>
            <strong>{t.application}:</strong> BizFlow
          </p>

          <p>
            <strong>{t.version}:</strong> 1.0.0
          </p>

          <p>
            <strong>{t.technology}:</strong> React, Tailwind CSS
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.businessManagementDescription}
          </p>
        </div>
      </section>
    </div>
  )
}

export default Settings
