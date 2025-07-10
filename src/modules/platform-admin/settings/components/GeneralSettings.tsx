import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building, Globe } from 'lucide-react'

interface GeneralSettingsProps {
  settings: any
  onChange: (values: any) => void
}

export default function GeneralSettings({ settings, onChange }: GeneralSettingsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value })
  }

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' }
  ]

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' }
  ]

  const dateFormats = [
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
    { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
    { value: 'MMMM d, yyyy', label: 'Month Day, Year' }
  ]

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Platform Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="platformName">Platform Name</Label>
            <Input
              id="platformName"
              value={settings.platformName || ''}
              onChange={(e) => handleChange('platformName', e.target.value)}
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground mt-1">
              The name of your platform as it appears throughout the system
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail || ''}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input
                id="supportPhone"
                value={settings.supportPhone || ''}
                onChange={(e) => handleChange('supportPhone', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Maintenance Mode</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="maintenanceMode"
              checked={settings.maintenanceMode || false}
              onCheckedChange={(checked) => handleChange('maintenanceMode', !!checked)}
            />
            <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
          </div>

          <div>
            <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
            <Textarea
              id="maintenanceMessage"
              value={settings.maintenanceMessage || ''}
              onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
              className="max-w-md"
              rows={3}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Message displayed to users during maintenance
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Regional Settings</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="defaultTimezone">Default Timezone</Label>
            <Select
              value={settings.defaultTimezone || 'America/New_York'}
              onValueChange={(value) => handleChange('defaultTimezone', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map(timezone => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="defaultCurrency">Default Currency</Label>
            <Select
              value={settings.defaultCurrency || 'USD'}
              onValueChange={(value) => handleChange('defaultCurrency', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="defaultDateFormat">Default Date Format</Label>
            <Select
              value={settings.defaultDateFormat || 'MM/dd/yyyy'}
              onValueChange={(value) => handleChange('defaultDateFormat', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateFormats.map(format => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="defaultLanguage">Default Language</Label>
            <Select
              value={settings.defaultLanguage || 'en-US'}
              onValueChange={(value) => handleChange('defaultLanguage', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(language => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}