import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import Card from './Card'
import { LanguageContext } from '../context/LanguageProvider'
import { translations } from '../data/data'

export default function CustomerCard({ customer, onDelete }) {
  const { language } = useContext(LanguageContext)
  const t = { ...translations.en, ...(translations[language] || {}) }

  return (
    <Card>

      <h2 className="text-lg font-semibold text-slate-900">
        {customer.name}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        {customer.email}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {customer.phone}
      </p>

   <div className="mt-4 flex gap-2">

  <button
    onClick={() => onDelete(customer.id)}
    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
  >
    {t.delete}
  </button>

  <NavLink
    to={`/customers/${customer.id}`}
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
  >
    {t.viewDetails}
  </NavLink>

</div>
    </Card>
  )
}