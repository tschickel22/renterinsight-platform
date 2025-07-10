// src/modules/platform-admin/settings/components/VoiceSettings.tsx
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Phone } from 'lucide-react'
import { Settings } from '../utils/useSettings'

interface VoiceSettingsProps {
  settings: Settings
  onChange: (values: Partial<Settings>) => void
}

export default function VoiceSettings({ settings, onChange }: VoiceSettingsProps) {
  const handleChange = (key: keyof Settings, value: any) => {
    onChange({ [key]: value })
  }

  const voiceProviders = [
    { value: 'none', label: 'None' },
    { value: 'twilio', label: 'Twilio' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Voice Provider Configuration</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="voiceProvider">Voice Provider</Label>
            <Select
              value={settings.voiceProvider || 'none'}
              onValueChange={(value) => handleChange('voiceProvider', value as Settings['voiceProvider'])}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voiceProviders.map(provider => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="voiceEnabled"
              checked={settings.voiceEnabled || false}
              onCheckedChange={(checked) => handleChange('voiceEnabled', !!checked)}
            />
            <Label htmlFor="voiceEnabled">Enable Voice Features</Label>
          </div>

          {settings.voiceProvider === 'twilio' && (
            <div className="space-y-4 border p-4 rounded-md">
              <h4 className="font-medium">Twilio Voice Configuration</h4>
              <div>
                <Label htmlFor="twilioVoiceSid">Twilio Account SID</Label>
                <Input
                  id="twilioVoiceSid"
                  value={settings.twilioVoiceSid || ''}
                  onChange={(e) => handleChange('twilioVoiceSid', e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div>
                <Label htmlFor="twilioVoiceAuthToken">Twilio Auth Token</Label>
                <Input
                  id="twilioVoiceAuthToken"
                  type="password"
                  value={settings.twilioVoiceAuthToken || ''}
                  onChange={(e) => handleChange('twilioVoiceAuthToken', e.target.value)}
                  className="max-w-md"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This is typically the same Account SID and Auth Token used for SMS, but can be different if needed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
