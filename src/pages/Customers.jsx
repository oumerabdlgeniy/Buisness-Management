
import { useContext, useState, useEffect } from 'react'
import PageTitle from '../components/PageTitle'
import CustomerCard from '../components/CustomerCard'
import { customers, translations } from '../data/data'
import { LanguageContext } from '../context/LanguageProvider'
import { readStorage } from '../utils/storage'

export default function Customers() {
  const { language } = useContext(LanguageContext)
  const t = translations[language] || translations.en

  const [customersList, setCustomersList] = useState(() => {
    return readStorage('customers', customers)
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    document.title = `Customers (${customersList.length}) | BizFlow`

    localStorage.setItem('customers', JSON.stringify(customersList))

    window.dispatchEvent(new Event('customersUpdated'))
  }, [customersList])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDelete = (id) => {
    const updatedCustomers = customersList.filter(
      (customer) => customer.id !== id
    )

    setCustomersList(updatedCustomers)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newCustomer = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    }

    setCustomersList([
      ...customersList,
      newCustomer,
    ])

    setFormData({
      name: '',
      email: '',
      phone: '',
    })
  }

  return (
    <div className="p-6">
      <PageTitle
        title={t.customers}
        description={t.customersPageDescription}
      />

      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {t.addCustomer}
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.customerName}
            className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t.customerEmail}
            className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t.customerPhone}
            className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t.addCustomer}
        </button>
      </form>

      {customersList.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-slate-500 dark:bg-slate-800">
          {t.noCustomers}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {customersList.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
