import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Services from './pages/Services'
import CustomerDetails from './pages/CustomerDetails'
export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/customers"
            element={<Customers />}
          />
                <Route
  path="/customers/:id"
  element={<CustomerDetails />}
/>
     <Route
  path="/services"
  element={<Services />}
      />

        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  )
}