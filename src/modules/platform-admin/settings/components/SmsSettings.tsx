import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, Info } from 'lucide-react'

interface SmsSettingsProps {
  settings: any
  onChange: (values: any) => void
}

export default function SmsSettings({ settings, onChange }: SmsSettingsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value })
  }

  const smsProviders = [
    { value: 'default', label: 'Default (Platform)' },
    { value: 'twilio', label: 'Twilio' },
    { value: 'messagebird', label: 'MessageBird' },
    { value: 'vonage', label: 'Vonage (Nexmo)' }
  ]

  const countryCodes = [
    { value: '+1', label: 'United States (+1)' },
    { value: '+44', label: 'United Kingdom (+44)' },
    { value: '+61', label: 'Australia (+61)' },
    { value: '+33', label: 'France (+33)' },
    { value: '+49', label: 'Germany (+49)' },
    { value: '+81', label: 'Japan (+81)' },
    { value: '+86', label: 'China (+86)' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">SMS Provider</h3>
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
                {smsProviders.map(provider => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              The SMS service provider used for sending text messages
            </p>
          </div>

          {settings.provider !== 'default' && (
            <div className="p-4 border rounded-md bg-blue-50">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Additional configuration for {smsProviders.find(p => p.value === settings.provider)?.label} 
                  would be available here. For this demo, we're using the default provider.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">SMS Configuration</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fromNumber">From Number</Label>
            <Input
              id="fromNumber"
              value={settings.fromNumber || ''}
              onChange={(e) => handleChange('fromNumber', e.target.value)}
              className="max-w-md"
              placeholder="+15551234567"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Must be in E.164 format (e.g., +15551234567)
            </p>
          </div>

          <div>
            <Label htmlFor="defaultCountryCode">Default Country Code</Label>
            <Select
              value={settings.defaultCountryCode || '+1'}
              onValueChange={(value) => handleChange('defaultCountryCode', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map(code => (
                  <SelectItem key={code.value} value={code.value}>
                    {code.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">SMS Limits & Tracking</h3>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="maxDailySms">Max Daily SMS</Label>
              <Input
                id="maxDailySms"
                type="number"
                min="0"
                value={settings.maxDailySms || 0}
                onChange={(e) => handleChange('maxDailySms', parseInt(e.target.value) || 0)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Maximum number of SMS that can be sent per day
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
                Maximum number of SMS that can be sent per minute
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="enableTracking"
              checked={settings.enableTracking || false}
              onCheckedChange={(checked) => handleChange('enableTracking', !!checked)}
            />
            <Label htmlFor="enableTracking">Enable SMS Tracking</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Compliance Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="complianceEnabled"
              checked={settings.complianceEnabled || false}
              onCheckedChange={(checked) => handleChange('complianceEnabled', !!checked)}
            />
            <Label htmlFor="complianceEnabled">Enable Compliance Messages</Label>
          </div>
          
          {settings.complianceEnabled && (
            <>
              <div>
                <Label htmlFor="optOutText">Opt-Out Text</Label>
                <Input
                  id="optOutText"
                  value={settings.optOutText || ''}
                  onChange={(e) => handleChange('optOutText', e.target.value)}
                  className="max-w-md"
                  placeholder="Reply STOP to opt out."
                />
              </div>
              
              <div>
                <Label htmlFor="helpText">Help Text</Label>
                <Input
                  id="helpText"
                  value={settings.helpText || ''}
                  onChange={(e) => handleChange('helpText', e.target.value)}
                  className="max-w-md"
                  placeholder="Reply HELP for help."
                />
              </div>
            </>
          )}
          
          <div className="p-4 border rounded-md bg-yellow-50">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-yellow-500 mt-0.5" />
              <p className="text-sm text-yellow-700">
                SMS messaging is subject to various regulations including TCPA in the US. 
                Ensure your SMS practices comply with all applicable laws and regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}