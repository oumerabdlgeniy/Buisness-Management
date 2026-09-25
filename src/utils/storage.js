export function readStorage(key, fallback) {
  const savedValue = localStorage.getItem(key)

  if (!savedValue) return fallback

  try {
    return JSON.parse(savedValue)
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}
