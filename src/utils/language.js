export const SUPPORTED_LANGUAGES = {
  en: 'en',
  am: 'am',
  ar: 'ar',
  English: 'en',
  Amharic: 'am',
  Arabic: 'ar',
}

export function normalizeLanguage(value) {
  if (!value) return 'en'

  const key = String(value).trim()

  if (SUPPORTED_LANGUAGES[key]) {
    return SUPPORTED_LANGUAGES[key]
  }

  const lowered = key.toLowerCase()

  if (lowered === 'english' || lowered === 'en') return 'en'
  if (lowered === 'amharic' || lowered === 'am') return 'am'
  if (lowered === 'arabic' || lowered === 'ar') return 'ar'

  return 'en'
}
