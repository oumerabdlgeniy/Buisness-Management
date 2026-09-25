/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react'

import { normalizeLanguage } from '../utils/language'

export const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language')

    return normalizeLanguage(saved)
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: (nextLanguage) => {
          setLanguage(normalizeLanguage(nextLanguage))
        },
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}