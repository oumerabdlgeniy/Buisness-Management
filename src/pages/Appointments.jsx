
import { useContext, useState, useEffect } from 'react'
import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import { appointments as initialAppointments, translations } from '../data/data'
import { LanguageContext } from '../context/LanguageProvider'
import { readStorage } from '../utils/storage'

export default function Appointments() {
  const { language } = useContext(LanguageContext)
  const t = translations[language] || translations.en

  const [appointmentsList, setAppointmentsList] = useState(() => {
    return readStorage('appointments', initialAppointments)
  })

  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    customer: '',
    service: '',
    date: '',
    time: '',
  })

  useEffect(() => {
    localStorage.setItem(
      'appointments',
      JSON.stringify(appointmentsList)
    )

    window.dispatchEvent(new Event('appointmentsUpdated'))
  }, [appointmentsList])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newAppointment = {
      id: Date.now(),
      customer: formData.customer,
      service: formData.service,
      date: formData.date,
      time: formData.time,
    }

    setAppointmentsList((previousAppointments) => [
      ...previousAppointments,
      newAppointment,
    ])

    if (localStorage.getItem('appointmentNotifications') === 'true' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Appointment created', { body: `${newAppointment.customer} — ${newAppointment.date} at ${newAppointment.time}` })
      } else if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }

    setFormData({
      customer: '',
      service: '',
      date: '',
      time: '',
    })
  }

  const handleDelete = (id) => {
    setAppointmentsList((previousAppointments) =>
      previousAppointments.filter(
        (appointment) => appointment.id !== id
      )
    )
  }

  const filteredAppointments = appointmentsList.filter((appointment) =>
    `${appointment.customer} ${appointment.service} ${appointment.date}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <PageTitle
        title={t.appointments}
        description={t.appointmentsPageDescription}
      />

      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {t.addAppointment}
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
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t.addAppointment}
        </button>
      </form>

      <input
        type="text"
        placeholder={t.searchAppointments}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      />

      {filteredAppointments.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {t.noAppointments}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {appointment.customer}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {appointment.service}
                  </p>
                </div>

                <div className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {appointment.time}
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                {t.date}: {appointment.date}
              </p>

              <button
                onClick={() => handleDelete(appointment.id)}
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
