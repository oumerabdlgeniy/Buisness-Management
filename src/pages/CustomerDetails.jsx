import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { customers, translations } from '../data/data'
import { LanguageContext } from '../context/LanguageProvider'

export default function CustomerDetails() {
  const { language } = useContext(LanguageContext)
  const t = translations[language] || translations.en

  const { id } = useParams()

  const customer = customers.find(
    (customer) => customer.id === Number(id)
  )

  if (!customer) {
    return <p className="p-6">{t.customerNotFound}</p>
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold text-slate-900">
        {customer.name}
      </h1>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

        <p>
          <strong>{t.email}:</strong> {customer.email}
        </p>

        <p className="mt-2">
          <strong>{t.phone}:</strong> {customer.phone}
        </p>

      </div>

    </div>
  )
}