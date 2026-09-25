
import { useContext, useState } from 'react'
import PageTitle from '../components/PageTitle'
import Card from '../components/Card'
import { LanguageContext } from '../context/LanguageProvider'
import { translations } from '../data/data'

export default function Profile() {
  const { language } = useContext(LanguageContext)
  const t = translations[language] || translations.en

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('profile')
    const defaultProfile = {
      name: 'Admin',
      email: 'admin@example.com',
      phone: '+251 911 111 111',
      role: 'Administrator',
      image: '',
    }

    if (!savedProfile) return defaultProfile

    try {
      return { ...defaultProfile, ...JSON.parse(savedProfile) }
    } catch {
      return defaultProfile
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [imageError, setImageError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setProfile({
      ...profile,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError(t.profileImageTypeError)
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError(t.profileImageSizeError)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setProfile((previousProfile) => ({
        ...previousProfile,
        image: reader.result,
      }))
      setImageError('')
    }
    reader.readAsDataURL(file)
  }

 const handleSubmit = (e) => {
  e.preventDefault()

  localStorage.setItem('profile', JSON.stringify(profile))

  window.dispatchEvent(new Event('profileUpdated'))

  setIsEditing(false)
}

  return (
    <div className="p-6">
      <PageTitle
        title={t.profile}
        description={t.profileDescription}
      />

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {t.personalInformation}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.viewUpdateProfile}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {isEditing ? t.cancel : t.edit}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}

            {isEditing && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.profileImage}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-100 dark:text-slate-400 dark:file:bg-blue-900/30 dark:file:text-blue-300"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.profileImageHint}</p>
                {imageError && <p className="mt-1 text-xs text-red-600">{imageError}</p>}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.name}
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.email}
            </label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.phone}
            </label>

            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.role}
            </label>

            <input
              type="text"
              name="role"
              value={profile.role}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-700"
            />
          </div>

          {isEditing && (
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700"
            >
              {t.saveChanges}
            </button>
          )}
        </form>
      </Card>
    </div>
  )
}
