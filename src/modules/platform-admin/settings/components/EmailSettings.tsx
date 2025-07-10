import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Info } from 'lucide-react'

interface EmailSettingsProps {
  settings: any
  onChange: (values: any) => void
}

export default function EmailSettings({ settings, onChange }: EmailSettingsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value })
  }

  const emailProviders = [
    { value: 'default', label: 'Default (Platform)' },
    { value: 'sendgrid', label: 'SendGrid' },
    { value: 'mailchimp', label: 'Mailchimp' },
    { value: 'mailgun', label: 'Mailgun' },
    { value: 'smtp', label: 'Custom SMTP' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Email Provider</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="provider">Provider</Label>
            <Select
              value={settings.provider || 'default'}
              onValueChange={(value) => handleChange('provider', value)}
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
            <p className="text-sm text-muted-foreground mt-1">
              The email service provider used for sending emails
            </p>
          </div>

          {settings.provider !== 'default' && (
            <div className="p-4 border rounded-md bg-blue-50">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Additional configuration for {emailProviders.find(p => p.value === settings.provider)?.label} 
                  would be available here. For this demo, we're using the default provider.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Email Configuration</h3>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={settings.fromEmail || ''}
                onChange={(e) => handleChange('fromEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={settings.fromName || ''}
                onChange={(e) => handleChange('fromName', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="replyToEmail">Reply-To Email</Label>
            <Input
              id="replyToEmail"
              type="email"
              value={settings.replyToEmail || ''}
              onChange={(e) => handleChange('replyToEmail', e.target.value)}
              className="max-w-md"
            />
          </div>

          <div>
            <Label htmlFor="footerText">Email Footer Text</Label>
            <Textarea
              id="footerText"
              value={settings.footerText || ''}
              onChange={(e) => handleChange('footerText', e.target.value)}
              className="max-w-md"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Email Limits & Tracking</h3>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="maxDailyEmails">Max Daily Emails</Label>
              <Input
                id="maxDailyEmails"
                type="number"
                min="0"
                value={settings.maxDailyEmails || 0}
                onChange={(e) => handleChange('maxDailyEmails', parseInt(e.target.value) || 0)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Maximum number of emails that can be sent per day
              </p>
            </div>
            <div>
              <Label htmlFor="throttleRate">Throttle Rate (per minute)</Label>
              <Input
                id="throttleRate"
                type="number"
                min="0"
                value={settings.throttleRate || 0}
                onChange={(e) => handleChange('throttleRate', parseInt(e.target.value) || 0)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Maximum number of emails that can be sent per minute
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableTracking"
                checked={settings.enableTracking || false}
                onCheckedChange={(checked) => handleChange('enableTracking', !!checked)}
              />
              <Label htmlFor="enableTracking">Enable Email Tracking</Label>
            </div>
            
            {settings.enableTracking && (
              <>
                <div className="flex items-center space-x-2 ml-6">
                  <Checkbox
                    id="trackOpens"
                    checked={settings.trackOpens || false}
                    onCheckedChange={(checked) => handleChange('trackOpens', !!checked)}
                  />
                  <Label htmlFor="trackOpens">Track Email Opens</Label>
                </div>
                <div className="flex items-center space-x-2 ml-6">
                  <Checkbox
                    id="trackClicks"
                    checked={settings.trackClicks || false}
                    onCheckedChange={(checked) => handleChange('trackClicks', !!checked)}
                  />
                  <Label htmlFor="trackClicks">Track Link Clicks</Label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Unsubscribe Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enableUnsubscribe"
              checked={settings.enableUnsubscribe || false}
              onCheckedChange={(checked) => handleChange('enableUnsubscribe', !!checked)}
            />
            <Label htmlFor="enableUnsubscribe">Enable Unsubscribe</Label>
          </div>
          
          {settings.enableUnsubscribe && (
            <>
              <div className="flex items-center space-x-2 ml-6">
                <Checkbox
                  id="unsubscribeLink"
                  checked={settings.unsubscribeLink || false}
                  onCheckedChange={(checked) => handleChange('unsubscribeLink', !!checked)}
                />
                <Label htmlFor="unsubscribeLink">Include Unsubscribe Link</Label>
              </div>
              
              <div className="ml-6">
                <Label htmlFor="unsubscribeText">Unsubscribe Text</Label>
                <Input
                  id="unsubscribeText"
                  value={settings.unsubscribeText || ''}
                  onChange={(e) => handleChange('unsubscribeText', e.target.value)}
                  className="max-w-md"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}