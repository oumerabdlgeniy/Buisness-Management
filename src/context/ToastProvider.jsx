/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useState } from 'react'

export const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((current) => [...current, { id, message, type }])
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed right-4 top-24 z-[100] space-y-2" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
