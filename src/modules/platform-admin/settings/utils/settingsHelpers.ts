import { defaultSettings } from '../schemas/defaultSettings'

const LOCAL_STORAGE_KEY = 'platform_settings'

export function getSettings(): typeof defaultSettings {
  try {
    const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedSettings) {
      return { ...defaultSettings, ...JSON.parse(storedSettings) }
    }
  } catch (error) {
    console.error('Error loading settings from local storage:', error)
  }
  return defaultSettings
}

export function saveSettings(settings: typeof defaultSettings): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings to local storage:', error)
  }
}

export function resetSettings(): typeof defaultSettings {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  } catch (error) {
    console.error('Error resetting settings in local storage:', error)
  }
  return defaultSettings
}