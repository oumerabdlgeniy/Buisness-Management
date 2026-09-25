
import { useContext, useState, useEffect } from 'react'

import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import { LanguageContext } from '../context/LanguageProvider'
import { AppSettingsContext, formatCurrency } from '../context/AppSettingsProvider'
import { payments as initialPayments, translations } from '../data/data'
import { readStorage } from '../utils/storage'

export default function Payments() {
  const { language } = useContext(LanguageContext)
  const { currency, exchangeRates } = useContext(AppSettingsContext)
  const t = translations[language] || translations.en

  const [paymentsList, setPaymentsList] = useState(() => {
    return readStorage('payments', initialPayments)
  })

  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    customer: '',
    service: '',
    amount: '',
    date: '',
    status: 'Paid',
  })

  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(paymentsList))

    window.dispatchEvent(new Event('paymentsUpdated'))
  }, [paymentsList])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newPayment = {
      id: Date.now(),
      customer: formData.customer,
      service: formData.service,
      amount: Number(formData.amount),
      date: formData.date,
      status: formData.status,
    }

    setPaymentsList((previousPayments) => [
      ...previousPayments,
      newPayment,
    ])

    setFormData({
      customer: '',
      service: '',
      amount: '',
      date: '',
      status: 'Paid',
    })
  }

  const handleDelete = (id) => {
    setPaymentsList((previousPayments) =>
      previousPayments.filter((payment) => payment.id !== id)
    )
  }

  const totalPaid = paymentsList
    .filter((payment) => payment.status === 'Paid')
    .reduce((total, payment) => total + payment.amount, 0)

  const totalPending = paymentsList
    .filter((payment) => payment.status === 'Pending')
    .reduce((total, payment) => total + payment.amount, 0)

  const filteredPayments = paymentsList.filter((payment) =>
    `${payment.customer} ${payment.service} ${payment.date} ${payment.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <PageTitle
        title={t.payments}
        description={t.paymentsPageDescription}
      />

      {/* Payment Summary */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <Card>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t.totalPaid}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(totalPaid, currency, exchangeRates)}
          </h2>
        </Card>

        <Card>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t.totalPending}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(totalPending, currency, exchangeRates)}
          </h2>
        </Card>
      </div>

      {/* Add Payment */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {t.addPayment}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            placeholder={t.customerName}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />

          <input
            type="text"
            name="service"
            value={formData.service}
            onChange={handleChange}
            placeholder={t.service}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder={t.amount}
            min="0"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="Paid">{t.paid}</option>
            <option value="Pending">{t.pending}</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t.addPayment}
        </button>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder={t.searchPayments}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      />

      {/* Payment List */}
      {filteredPayments.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {t.noPayments}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPayments.map((payment) => (
            <Card key={payment.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {payment.customer}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {payment.service}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    payment.status === 'Paid'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}
                >
                  {payment.status === 'Paid' ? t.paid : t.pending}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(payment.amount, currency, exchangeRates)}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t.date}: {payment.date}
                </p>
              </div>

              <button
                onClick={() => handleDelete(payment.id)}
                className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                {t.delete}
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
