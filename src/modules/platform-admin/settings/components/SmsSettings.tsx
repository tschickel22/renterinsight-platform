// src/modules/platform-admin/settings/components/SmsSettings.tsx
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare } from 'lucide-react'
import { Settings } from '../utils/useSettings'

interface SmsSettingsProps {
  settings: Settings
  onChange: (values: Partial<Settings>) => void
}

export default function SmsSettings({ settings, onChange }: SmsSettingsProps) {
  const handleChange = (key: keyof Settings, value: any) => {
    onChange({ [key]: value })
  }

  const smsProviders = [
    { value: 'none', label: 'None' },
    { value: 'twilio', label: 'Twilio' },
    { value: 'messagebird', label: 'MessageBird' },
    { value: 'vonage', label: 'Vonage (Nexmo)' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">SMS Provider Configuration</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="smsProvider">SMS Provider</Label>
            <Select
              value={settings.smsProvider || 'none'}
              onValueChange={(value) => handleChange('smsProvider', value as Settings['smsProvider'])}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {smsProviders.map(provider => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="smsEnabled"
              checked={settings.smsEnabled || false}
              onCheckedChange={(checked) => handleChange('smsEnabled', !!checked)}
            />
            <Label htmlFor="smsEnabled">Enable SMS Notifications</Label>
          </div>

          {settings.smsProvider === 'twilio' && (
            <div className="space-y-4 border p-4 rounded-md">
              <h4 className="font-medium">Twilio Configuration</h4>
              <div>
                <Label htmlFor="twilioAccountSid">Twilio Account SID</Label>
                <Input
                  id="twilioAccountSid"
                  value={settings.twilioAccountSid || ''}
                  onChange={(e) => handleChange('twilioAccountSid', e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div>
                <Label htmlFor="twilioAuthToken">Twilio Auth Token</Label>
                <Input
                  id="twilioAuthToken"
                  type="password"
                  value={settings.twilioAuthToken || ''}
                  onChange={(e) => handleChange('twilioAuthToken', e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div>
                <Label htmlFor="twilioPhoneNumber">Twilio Phone Number</Label>
                <Input
                  id="twilioPhoneNumber"
                  value={settings.twilioPhoneNumber || ''}
                  onChange={(e) => handleChange('twilioPhoneNumber', e.target.value)}
                  placeholder="+15551234567"
                  className="max-w-md"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Must be in E.164 format (e.g., +15551234567)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">SMS Templates</h3>
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="flex items-start space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">SMS Templates</h4>
              <p className="text-sm text-blue-700 mt-1">
                SMS templates can be configured in the Company Settings area under Notification Templates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
