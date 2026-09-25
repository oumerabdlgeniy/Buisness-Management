
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  )

  const toggleTheme = () => {
    setDarkMode((previousMode) => !previousMode)
  }

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode))

    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
