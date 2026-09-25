import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import { ThemeProvider } from './context/ThemeProvider'
import { LanguageProvider } from './context/LanguageProvider'
import { AppSettingsProvider } from './context/AppSettingsProvider'
import { ToastProvider } from './context/ToastProvider'
import { AuthProvider, useAuth } from './context/AuthProvider'
import { AppSettingsContext } from './context/AppSettingsProvider'

import DashboardLayout from './layouts/DashboardLayout'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import CustomerDetails from './pages/CustomerDetails'
import Services from './pages/Services'
import Employees from './pages/Employees'
import Appointments from './pages/Appointments'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>

      <ThemeProvider>

        <LanguageProvider>
          <AppSettingsProvider>
            <AuthProvider>
              <ToastProvider>

          <Routes>

            {/* Login Page */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* Protected Dashboard */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Customers */}
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Customers />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Customer Details */}
            <Route
              path="/customers/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CustomerDetails />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Services */}
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Services />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
 {/* Protected Employees */}
           <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Employees />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            /> 
         
      {/* Protected Appointments */}    
<Route
  path="/appointments"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <Appointments />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
{/* Protected Payments */}
<Route
  path="/payments"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <Payments />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
{/* Protected Reports */}
<Route
  path="/reports"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <Reports />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
   {/* Tasks Page */}
   <Route
    path="/tasks"
    element={
      <ProtectedRoute>
        <DashboardLayout>
          <Tasks />
        </DashboardLayout>
      </ProtectedRoute>
    }
   />
    {/* Profile Page */}
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />
    {/* Settings Page */}
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />
    </Routes>
                </ToastProvider>
            </AuthProvider>
          </AppSettingsProvider>
        </LanguageProvider>

      </ThemeProvider>

    </BrowserRouter>
  )
}


function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const { role } = useContext(AppSettingsContext)
  const location = useLocation()

  const roleAccess = {
    '/customers': ['Admin', 'Manager'],
    '/services': ['Admin', 'Manager'],
    '/employees': ['Admin'],
    '/appointments': ['Admin', 'Manager'],
    '/payments': ['Admin', 'Manager'],
    '/reports': ['Admin', 'Manager'],
  }
  const matchedPath = Object.keys(roleAccess).find((path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`)
  )

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (matchedPath && !roleAccess[matchedPath].includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}
