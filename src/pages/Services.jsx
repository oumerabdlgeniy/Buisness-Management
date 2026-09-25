
import { useContext, useState, useEffect } from 'react'
import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import { services as initialServices, translations } from '../data/data'
import { LanguageContext } from '../context/LanguageProvider'
import { readStorage } from '../utils/storage'

export default function Services() {
  const { language } = useContext(LanguageContext)
  const t = translations[language] || translations.en

  const [servicesList, setServicesList] = useState(() => {
    return readStorage('services', initialServices)
  })

  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  })

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(servicesList))
    window.dispatchEvent(new Event('servicesUpdated'))
  }, [servicesList])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newService = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      price: formData.price,
    }

    setServicesList((previousServices) => [
      ...previousServices,
      newService,
    ])

    setFormData({
      name: '',
      description: '',
      price: '',
    })
  }

  const handleDelete = (id) => {
    setServicesList((previousServices) =>
      previousServices.filter((service) => service.id !== id)
    )
  }

  const filteredServices = servicesList.filter((service) =>
    `${service.name} ${service.description}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <PageTitle
        title={t.services}
        description={t.servicesPageDescription}
      />

      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {t.addService}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.serviceName}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />

          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t.serviceDescription}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder={t.servicePrice}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            min="0"
          />
        </div>

        <button
          type="submit"
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t.addService}
        </button>
      </form>

      <input
        type="text"
        placeholder={t.searchServices}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      />

      {filteredServices.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {t.noServices}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service.id}>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {service.name}
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {service.description}
              </p>

              {service.price && (
                <p className="mt-3 font-medium text-blue-600 dark:text-blue-400">
                  {t.price}: {service.price}
                </p>
              )}

              <button
                onClick={() => handleDelete(service.id)}
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
