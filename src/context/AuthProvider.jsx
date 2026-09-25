/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
export const ACCESS_CODE = '1234'

function getStoredUser() {
  const savedUser = sessionStorage.getItem('authUser')

  if (!savedUser) return null

  try {
    return JSON.parse(savedUser)
  } catch {
    sessionStorage.removeItem('authUser')
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const login = (email, accessCode) => {
    if (accessCode !== ACCESS_CODE) return false

    const nextUser = { email, name: email.split('@')[0] }
    sessionStorage.setItem('authUser', JSON.stringify(nextUser))
    setUser(nextUser)
    return true
  }

  const logout = () => {
    sessionStorage.removeItem('authUser')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
