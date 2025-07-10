import { defaultSettings } from '../schemas/defaultSettings'

const SETTINGS_STORAGE_KEY = 'renter-insight-platform-settings'

export async function loadSettings(): Promise<Record<string, any>> {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
    
    if (!storedSettings) {
      // If no settings exist, save and return the defaults
      await saveSettings(defaultSettings)
      return defaultSettings
    }
    
    return JSON.parse(storedSettings)
  } catch (error) {
    console.error('Error loading settings:', error)
    return defaultSettings
  }
}

export async function saveSettings(settings: Record<string, any>): Promise<void> {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings:', error)
    throw error
  }
}

export function validateSettings(settings: Record<string, any>): boolean {
  // Basic validation - ensure all required categories exist
  const requiredCategories = Object.keys(defaultSettings)
  
  for (const category of requiredCategories) {
    if (!settings[category]) {
      console.error(`Missing required settings category: ${category}`)
      return false
    }
  }
  
  return true
}

export function exportSettings(): string {
  const settings = localStorage.getItem(SETTINGS_STORAGE_KEY) || JSON.stringify(defaultSettings)
  return settings
}

export function importSettings(settingsJson: string): boolean {
  try {
    const settings = JSON.parse(settingsJson)
    
    if (!validateSettings(settings)) {
      return false
    }
    
    localStorage.setItem(SETTINGS_STORAGE_KEY, settingsJson)
    return true
  } catch (error) {
    console.error('Error importing settings:', error)
    return false
  }
}