
import { useContext, useEffect, useState } from 'react'

import PageTitle from '../components/PageTitle'
import Card from '../components/Card'

import {
  Search,
  FileText,
  BarChart3,
  Users,
} from 'lucide-react'

import {
  customers as initialCustomers,
  services as initialServices,
  appointments as initialAppointments,
  payments as initialPayments,
  translations,
} from '../data/data'
import { LanguageContext } from '../context/LanguageProvider'
import { AppSettingsContext, formatCurrency } from '../context/AppSettingsProvider'
import { readStorage } from '../utils/storage'

export default function Reports() {
  const { language } = useContext(LanguageContext)
  const { currency, exchangeRates } = useContext(AppSettingsContext)
  const t = { ...translations.en, ...(translations[language] || {}) }

  const [customers, setCustomers] = useState(initialCustomers)
  const [services, setServices] = useState(initialServices)
  const [appointments, setAppointments] = useState(initialAppointments)
  const [payments, setPayments] = useState(initialPayments)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [serviceFilter, setServiceFilter] = useState('All')
  const [sortBy, setSortBy] = useState('date-desc')
  const [page, setPage] = useState(1)
  const pageSize = 8

  // Load data
  useEffect(() => {
    const loadData = () => {
      setCustomers(readStorage('customers', initialCustomers))
      setServices(readStorage('services', initialServices))
      setAppointments(readStorage('appointments', initialAppointments))
      setPayments(readStorage('payments', initialPayments))
    }

    loadData()

    window.addEventListener('customersUpdated', loadData)
    window.addEventListener('servicesUpdated', loadData)
    window.addEventListener('appointmentsUpdated', loadData)
    window.addEventListener('paymentsUpdated', loadData)

    return () => {
      window.removeEventListener('customersUpdated', loadData)
      window.removeEventListener('servicesUpdated', loadData)
      window.removeEventListener('appointmentsUpdated', loadData)
      window.removeEventListener('paymentsUpdated', loadData)
    }
  }, [])

  // Payment filtering
  const filteredPayments = payments.filter((payment) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      payment.customer?.toLowerCase().includes(search) ||
      payment.service?.toLowerCase().includes(search)

    const matchesStatus =
      statusFilter === 'All' ||
      payment.status === statusFilter

    return matchesSearch && matchesStatus && (serviceFilter === 'All' || payment.service === serviceFilter)
  })
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    const [field, direction] = sortBy.split('-')
    const first = field === 'amount' ? Number(a.amount) : String(a[field] || '')
    const second = field === 'amount' ? Number(b.amount) : String(b[field] || '')
    return direction === 'asc' ? first > second ? 1 : -1 : first > second ? -1 : 1
  })
  const totalPages = Math.max(1, Math.ceil(sortedPayments.length / pageSize))
  const visiblePayments = sortedPayments.slice((page - 1) * pageSize, page * pageSize)

  const exportPayments = () => {
    const lines = [['Customer', 'Service', 'Amount (USD)', 'Status', 'Date'], ...sortedPayments.map((payment) => [payment.customer, payment.service, payment.amount, payment.status, payment.date])]
    const csv = lines.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    link.download = 'bizflow-payments.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  // Service performance
  const servicePerformance = services.map((service) => {
    const serviceAppointments = appointments.filter(
      (appointment) => appointment.service === service.name
    )

    const servicePayments = payments.filter(
      (payment) =>
        payment.service === service.name &&
        payment.status === 'Paid'
    )

    const revenue = servicePayments.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    )

    return {
      ...service,
      appointmentCount: serviceAppointments.length,
      revenue,
    }
  })

  // Customer analysis
  const customerAnalysis = customers.map((customer) => {
    const customerAppointments = appointments.filter(
      (appointment) => appointment.customer === customer.name
    )

    const customerPayments = payments.filter(
      (payment) =>
        payment.customer === customer.name &&
        payment.status === 'Paid'
    )

    const spending = customerPayments.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    )

    return {
      ...customer,
      appointmentCount: customerAppointments.length,
      spending,
    }
  })

  return (
    <div className="p-6">

      {/* Page Title */}
      <PageTitle
        title={t.reportsTitle}
        description={t.reportsDescription}
      />

      {/* Payment Details */}
      <Card>
        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {t.paymentDetails}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t.paymentDetailsDescription}
            </p>
          </div>

          <FileText
            size={22}
            className="text-blue-600"
          />

        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder={t.searchCustomerOrService}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) => { setStatusFilter(event.target.value); setPage(1) }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value="All">{t.allStatus}</option>
            <option value="Paid">{t.paid}</option>
            <option value="Pending">{t.pending}</option>
          </select>

          <select value={serviceFilter} onChange={(event) => { setServiceFilter(event.target.value); setPage(1) }} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
            <option value="All">All services</option>
            {[...new Set(payments.map((payment) => payment.service))].map((service) => <option key={service} value={service}>{service}</option>)}
          </select>

          <select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1) }} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>

          <button onClick={exportPayments} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">Export CSV</button>

        </div>

        {/* Payment Table */}
        <div className="mt-6 overflow-x-auto">

          <table className="w-full min-w-[650px] text-left text-sm">

            <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">{t.customers}</th>
                <th className="px-4 py-3 font-medium">{t.service}</th>
                <th className="px-4 py-3 font-medium">{t.amount}</th>
                <th className="px-4 py-3 font-medium">{t.allStatus}</th>
                <th className="px-4 py-3 font-medium">{t.date}</th>
              </tr>
            </thead>

            <tbody>
              {visiblePayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-slate-100 even:bg-slate-50/30 hover:bg-slate-50/50 dark:border-slate-700 dark:hover:bg-slate-700/30"
                >
                  <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                    {payment.customer}
                  </td>

                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                    {payment.service}
                  </td>

                  <td className="px-4 py-4 text-slate-900 dark:text-white">
                    {formatCurrency(payment.amount, currency, exchangeRates)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        payment.status === 'Paid'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {payment.status === 'Paid' ? t.paid : t.pending}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                    {payment.date}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {filteredPayments.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              {t.noPaymentRecords}
            </p>
          )}

          {filteredPayments.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>{sortedPayments.length} record{sortedPayments.length === 1 ? '' : 's'}</span>
              <div className="flex items-center gap-2">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
              </div>
            </div>
          )}

        </div>
      </Card>

      {/* Service Performance */}
      <div className="mt-6">
        <Card>

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t.servicePerformance}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t.servicePerformanceDescription}
              </p>
            </div>

            <BarChart3
              size={22}
              className="text-green-600"
            />

          </div>

          <div className="mt-6 overflow-x-auto">

            <table className="w-full min-w-[500px] text-left text-sm">

              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">{t.service}</th>
                  <th className="px-4 py-3 font-medium">
                    {t.appointments}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t.revenue}
                  </th>
                </tr>
              </thead>

              <tbody>
                {servicePerformance.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-slate-100 even:bg-slate-50/30 hover:bg-slate-50/50 dark:border-slate-700 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                      {service.name}
                    </td>

                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {service.appointmentCount}
                    </td>

                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {formatCurrency(service.revenue, currency, exchangeRates)}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </Card>
      </div>

      {/* Customer Analysis */}
      <div className="mt-6">
        <Card>

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t.customerAnalysis}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t.customerAnalysisDescription}
              </p>
            </div>

            <Users
              size={22}
              className="text-purple-600"
            />

          </div>

          <div className="mt-6 overflow-x-auto">

            <table className="w-full min-w-[500px] text-left text-sm">

              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">{t.customers}</th>
                  <th className="px-4 py-3 font-medium">
                    {t.appointments}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t.totalSpending}
                  </th>
                </tr>
              </thead>

              <tbody>
                {customerAnalysis.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-slate-100 even:bg-slate-50/30 hover:bg-slate-50/50 dark:border-slate-700 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                      {customer.name}
                    </td>

                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {customer.appointmentCount}
                    </td>

                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {formatCurrency(customer.spending, currency, exchangeRates)}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </Card>
      </div>

    </div>
  )
}
