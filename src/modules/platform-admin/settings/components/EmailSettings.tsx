// src/modules/platform-admin/settings/components/EmailSettings.tsx
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail } from 'lucide-react'
import { Settings } from '../utils/useSettings'

interface EmailSettingsProps {
  settings: Settings
  onChange: (values: Partial<Settings>) => void
}

export default function EmailSettings({ settings, onChange }: EmailSettingsProps) {
  const handleChange = (key: keyof Settings, value: any) => {
    onChange({ [key]: value })
  }

  const emailProviders = [
    { value: 'none', label: 'None' },
    { value: 'smtp', label: 'SMTP' },
    { value: 'sendgrid', label: 'SendGrid' },
    { value: 'mailgun', label: 'Mailgun' },
    { value: 'ses', label: 'Amazon SES' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Email Provider Configuration</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="emailProvider">Email Provider</Label>
            <Select
              value={settings.emailProvider || 'none'}
              onValueChange={(value) => handleChange('emailProvider', value as Settings['emailProvider'])}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {emailProviders.map(provider => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailEnabled"
              checked={settings.emailEnabled || false}
              onCheckedChange={(checked) => handleChange('emailEnabled', !!checked)}
            />
            <Label htmlFor="emailEnabled">Enable Email Notifications</Label>
          </div>

          {settings.emailProvider === 'smtp' && (
            <div className="space-y-4 border p-4 rounded-md">
              <h4 className="font-medium">SMTP Configuration</h4>
              <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost || ''}
                  onChange={(e) => handleChange('smtpHost', e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={settings.smtpPort || 587}
                  onChange={(e) => handleChange('smtpPort', parseInt(e.target.value))}
                  className="max-w-md"
                />
              </div>
              <div>
                <Label htmlFor="smtpUsername">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  value={settings.smtpUsername || ''}
                  onChange={(e) => handleChange('smtpUsername', e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div>
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.smtpPassword || ''}
                  onChange={(e) => handleChange('smtpPassword', e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smtpSecure"
                  checked={settings.smtpSecure || false}
                  onCheckedChange={(checked) => handleChange('smtpSecure', !!checked)}
                />
                <Label htmlFor="smtpSecure">Use SSL/TLS (Secure Connection)</Label>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="emailFromAddress">From Email Address</Label>
            <Input
              id="emailFromAddress"
              type="email"
              value={settings.emailFromAddress || ''}
              onChange={(e) => handleChange('emailFromAddress', e.target.value)}
              placeholder="noreply@example.com"
              className="max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="emailFromName">From Name</Label>
            <Input
              id="emailFromName"
              value={settings.emailFromName || ''}
              onChange={(e) => handleChange('emailFromName', e.target.value)}
              placeholder="Your Company Name"
              className="max-w-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Email Templates</h3>
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="flex items-start space-x-2">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Email Templates</h4>
              <p className="text-sm text-blue-700 mt-1">
                Email templates can be configured in the Company Settings area under Notification Templates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
