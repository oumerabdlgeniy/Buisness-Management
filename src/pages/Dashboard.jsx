
import { useContext, useEffect, useState } from 'react'
import PageTitle from '../components/PageTitle'
import StatCard from '../components/StatCard'
import Card from '../components/Card'

import {
  Users,
  Briefcase,
  CalendarDays,
  CreditCard,
  ArrowUpRight,
} from 'lucide-react'

import { LanguageContext } from '../context/LanguageProvider'
import { AppSettingsContext, formatCurrency } from '../context/AppSettingsProvider'

import {
  translations,
  customers as initialCustomers,
  services as initialServices,
  appointments as initialAppointments,
  employees as initialEmployees,
  payments as initialPayments,
} from '../data/data'
import { readStorage } from '../utils/storage'

export default function Dashboard() {
  const { language } = useContext(LanguageContext)
  const { currency, exchangeRates } = useContext(AppSettingsContext)

  const t = translations[language] || translations.en

  // Data states
  const [customers, setCustomers] = useState(initialCustomers)
  const [services, setServices] = useState(initialServices)
  const [appointments, setAppointments] = useState(initialAppointments)
  const [employees, setEmployees] = useState(initialEmployees)
  const [payments, setPayments] = useState(initialPayments)

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      setCustomers(readStorage('customers', initialCustomers))
      setServices(readStorage('services', initialServices))
      setAppointments(readStorage('appointments', initialAppointments))
      setEmployees(readStorage('employees', initialEmployees))
      setPayments(readStorage('payments', initialPayments))
    }

    loadData()

    // Update dashboard when data changes
    window.addEventListener('customersUpdated', loadData)
    window.addEventListener('servicesUpdated', loadData)
    window.addEventListener('appointmentsUpdated', loadData)
    window.addEventListener('employeesUpdated', loadData)
    window.addEventListener('paymentsUpdated', loadData)

    return () => {
      window.removeEventListener('customersUpdated', loadData)
      window.removeEventListener('servicesUpdated', loadData)
      window.removeEventListener('appointmentsUpdated', loadData)
      window.removeEventListener('employeesUpdated', loadData)
      window.removeEventListener('paymentsUpdated', loadData)
    }
  }, [])

  // Calculate total revenue
  const totalRevenue = payments
    .filter((payment) => payment.status === 'Paid')
    .reduce(
      (total, payment) => total + Number(payment.amount),
      0
    )

  // Calculate pending payments
  const totalPending = payments
    .filter((payment) => payment.status === 'Pending')
    .reduce(
      (total, payment) => total + Number(payment.amount),
      0
    )

  const revenueTrend = payments
    .filter((payment) => payment.status === 'Paid')
    .reduce((totals, payment) => ({
      ...totals,
      [payment.date]: (totals[payment.date] || 0) + Number(payment.amount),
    }), {})
  const trendEntries = Object.entries(revenueTrend).slice(-7)
  const trendMax = Math.max(...trendEntries.map(([, amount]) => amount), 1)

  return (
    <div className="p-6">
      {/* Page Title */}
      <PageTitle
        title={t.dashboard}
        description={t.dashboardDescription}
      />

      {/* Main Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title={t.totalCustomers}
          value={customers.length}
          description={t.customersDescription}
        />

        <StatCard
          title={t.totalServices}
          value={services.length}
          description={t.servicesDescription}
        />

        <StatCard
          title={t.totalAppointments}
          value={appointments.length}
          description={t.appointmentsDescription}
        />

        <StatCard
          title={t.totalEmployees}
          value={employees.length}
          description={t.employeesManaging}
        />

        <StatCard
          title={t.totalRevenue}
          value={formatCurrency(totalRevenue, currency, exchangeRates)}
          description={t.revenueDescription}
        />
      </div>

      <div className="mt-6">
        <Card>
          <div className="mb-5 flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t.revenueTrend}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.revenueTrendDescription}</p>
            </div>
            <span className="min-w-0 break-words text-right text-sm font-medium text-blue-600 [overflow-wrap:anywhere]">{formatCurrency(totalRevenue, currency, exchangeRates)}</span>
          </div>
          {trendEntries.length ? (
            <div className="flex h-44 items-end gap-3" aria-label="Revenue trend chart">
              {trendEntries.map(([date, amount]) => (
                <div key={date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <span className="max-w-full break-words text-center text-xs font-medium text-slate-600 [overflow-wrap:anywhere] dark:text-slate-300">{formatCurrency(amount, currency, exchangeRates)}</span>
                  <div className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600" style={{ height: `${Math.max((amount / trendMax) * 110, 8)}px` }} title={`${date}: ${formatCurrency(amount, currency, exchangeRates)}`} />
                  <span className="truncate text-xs text-slate-400">{date.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">{t.noPaidPayments}</p>}
        </Card>
      </div>

      {/* Payment Summary */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Paid Payments */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t.paidPayments}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t.totalMoneyReceived}
              </p>
            </div>

            <CreditCard
              size={22}
              className="text-green-600"
            />
          </div>

          <p className="mt-4 max-w-full break-words text-2xl font-bold leading-tight text-green-600 [overflow-wrap:anywhere] sm:text-3xl">
            {formatCurrency(totalRevenue, currency, exchangeRates)}
          </p>
        </Card>

        {/* Pending Payments */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t.pendingPayments}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t.moneyNotReceived}
              </p>
            </div>

            <CreditCard
              size={22}
              className="text-yellow-600"
            />
          </div>

          <p className="mt-4 max-w-full break-words text-2xl font-bold leading-tight text-yellow-600 [overflow-wrap:anywhere] sm:text-3xl">
            {formatCurrency(totalPending, currency, exchangeRates)}
          </p>
        </Card>
      </div>

      {/* Recent Customers and Upcoming Appointments */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Customers */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t.recentCustomers}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t.recentCustomersDescription}
              </p>
            </div>

            <Users
              size={22}
              className="text-blue-600"
            />
          </div>

          <div className="mt-6 space-y-4">
            {customers
              .slice(-5)
              .reverse()
              .map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50"
                >
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {customer.name}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {customer.email}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-slate-400"
                  />
                </div>
              ))}

            {customers.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.noCustomers}
              </p>
            )}
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t.upcomingAppointments}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t.upcomingAppointmentsDescription}
              </p>
            </div>

            <CalendarDays
              size={22}
              className="text-blue-600"
            />
          </div>

          <div className="mt-6 space-y-4">
            {appointments
              .slice(-5)
              .reverse()
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {appointment.customer}
                    </h3>

                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {appointment.time}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {appointment.service}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {appointment.date}
                  </p>
                </div>
              ))}

            {appointments.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.noAppointments}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Employees */}
      <div className="mt-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t.recentEmployees}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t.employeesDescription}
              </p>
            </div>

            <Briefcase
              size={22}
              className="text-green-600"
            />
          </div>

          <div className="mt-6 space-y-3">
            {employees
              .slice(-5)
              .reverse()
              .map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700"
                >
                  <span className="font-medium text-slate-900 dark:text-white">
                    {employee.name}
                  </span>

                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {employee.position}
                  </span>
                </div>
              ))}

            {employees.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.noEmployees}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Business Overview */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Customers */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
              <Users
                size={22}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.customers}
              </p>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {customers.length}
              </h3>
            </div>
          </div>
        </Card>

        {/* Services */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
              <Briefcase
                size={22}
                className="text-green-600 dark:text-green-400"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.services}
              </p>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {services.length}
              </h3>
            </div>
          </div>
        </Card>

        {/* Revenue */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
              <CreditCard
                size={22}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.revenue}
              </p>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalRevenue, currency, exchangeRates)}
              </h3>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
