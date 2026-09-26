/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react'
import { readStorage } from '../utils/storage'

export const AppSettingsContext = createContext()

export const formatCurrency = (amount, currency = 'ETB', rates = { USD: 1 }) =>
  new Intl.NumberFormat(currency === 'ETB' ? 'en-ET' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format((Number(amount) || 0) * (rates[currency] || 1))

const getSettings = () => ({
  businessName: localStorage.getItem('businessName') || 'BizFlow',
  businessPhone: localStorage.getItem('businessPhone') || '',
  businessAddress: localStorage.getItem('businessAddress') || '',
  currency: localStorage.getItem('businessCurrency') || 'ETB',
  emailNotifications: localStorage.getItem('emailNotifications') !== 'false',
  appointmentNotifications: localStorage.getItem('appointmentNotifications') !== 'false',
  compactMode: localStorage.getItem('compactMode') === 'true',
  defaultPage: localStorage.getItem('defaultPage') || '/',
  role: localStorage.getItem('userRole') || 'Admin',
})

export function AppSettingsProvider({ children }) {
  const [settings, setSettings] = useState(getSettings)
  const [exchangeRates, setExchangeRates] = useState(() => {
    const cached = readStorage('usdExchangeRates', null)
    return cached?.rates || { USD: 1, ETB: 162.09, EUR: 0.88 }
  })
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState(() => {
    return readStorage('usdExchangeRates', null)?.updatedAt || null
  })

  const updateSettings = (changes) => {
    const nextSettings = { ...settings, ...changes }
    const storageKeys = {
      businessName: 'businessName', businessPhone: 'businessPhone', businessAddress: 'businessAddress',
      currency: 'businessCurrency', emailNotifications: 'emailNotifications',
      appointmentNotifications: 'appointmentNotifications', compactMode: 'compactMode', defaultPage: 'defaultPage',
      role: 'userRole',
    }

    Object.entries(changes).forEach(([key, value]) => {
      localStorage.setItem(storageKeys[key], String(value))
    })
    setSettings(nextSettings)
    window.dispatchEvent(new Event('appSettingsUpdated'))
  }

  useEffect(() => {
    const reloadSettings = () => setSettings(getSettings())
    window.addEventListener('storage', reloadSettings)
    return () => window.removeEventListener('storage', reloadSettings)
  }, [])

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD')
        const data = await response.json()
        if (!response.ok || data.result !== 'success' || !data.rates?.ETB || !data.rates?.EUR) {
          throw new Error('Invalid exchange-rate response')
        }

        const updatedAt = data.time_last_update_utc || new Date().toISOString()
        const nextRates = { USD: 1, ETB: data.rates.ETB, EUR: data.rates.EUR }
        localStorage.setItem('usdExchangeRates', JSON.stringify({ rates: nextRates, updatedAt }))
        setExchangeRates(nextRates)
        setRatesUpdatedAt(updatedAt)
      } catch {
        // The last saved rate (or the supplied starter rate) remains available offline.
      }
    }

    loadExchangeRates()
  }, [])

  return (
    <AppSettingsContext.Provider value={{ ...settings, exchangeRates, ratesUpdatedAt, updateSettings }}>
      {children}
    </AppSettingsContext.Provider>
  )
}
