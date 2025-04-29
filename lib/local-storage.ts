/**
 * Safely get an item from localStorage, handling cases where localStorage might not be available
 */
export function getLocalStorageItem(key: string): string | null {
  if (typeof window === "undefined") return null

  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error)
    return null
  }
}

/**
 * Safely set an item in localStorage, handling cases where localStorage might not be available
 */
export function setLocalStorageItem(key: string, value: string): boolean {
  if (typeof window === "undefined") return false

  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error)
    return false
  }
}
