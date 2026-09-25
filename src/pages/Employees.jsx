
import { useContext, useState, useEffect } from 'react'
import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import { employees as initialEmployees, translations } from '../data/data'
import { LanguageContext } from '../context/LanguageProvider'
import { readStorage } from '../utils/storage'

export default function Employees() {
  const { language } = useContext(LanguageContext)
  const t = translations[language] || translations.en

  const [employeesList, setEmployeesList] = useState(() => {
    return readStorage('employees', initialEmployees)
  })

  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    position: '',
  })

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employeesList))
    window.dispatchEvent(new Event('employeesUpdated'))
  }, [employeesList])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newEmployee = {
      id: Date.now(),
      name: formData.name,
      position: formData.position,
    }

    setEmployeesList((previousEmployees) => [
      ...previousEmployees,
      newEmployee,
    ])

    setFormData({
      name: '',
      position: '',
    })
  }

  const handleDelete = (id) => {
    setEmployeesList((previousEmployees) =>
      previousEmployees.filter((employee) => employee.id !== id)
    )
  }

  const filteredEmployees = employeesList.filter((employee) =>
    `${employee.name} ${employee.position}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <PageTitle
        title={t.employees}
        description={t.employeesPageDescription}
      />

      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {t.addEmployee}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.employeeName}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />

          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder={t.employeePosition}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t.addEmployee}
        </button>
      </form>

      <input
        type="text"
        placeholder={t.searchEmployees}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      />

      {filteredEmployees.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {t.noEmployees}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {employee.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {employee.position}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {employee.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <button
                onClick={() => handleDelete(employee.id)}
                className="mt-5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
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
