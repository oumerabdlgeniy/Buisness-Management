import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LanguageContext } from '../context/LanguageProvider'
import { translations } from '../data/data'
import { useAuth } from '../context/AuthProvider'

export default function Login() {
  const navigate = useNavigate()
  const { language } = useContext(LanguageContext)
  const { login } = useAuth()
  const [loginError, setLoginError] = useState(false)
  const t = translations[language] || translations.en

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.email && formData.password) {
      const authenticated = login(formData.email, formData.password)

      if (!authenticated) {
        setLoginError(true)
        return
      }

      navigate('/')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-900">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            Bizflow
          </h1>

          <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            {t.welcomeBack}
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t.loginDescription}
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.email}
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t.enterEmail}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.password}
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t.enterPassword}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              required
            />
          </div>

          {loginError && (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {t.invalidLogin}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
          >
            {t.login}
          </button>

        </form>

      </div>

    </div>
  )
}
