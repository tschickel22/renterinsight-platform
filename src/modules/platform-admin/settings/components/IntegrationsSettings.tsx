import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Link, Calendar, FileText, DollarSign } from 'lucide-react'

interface IntegrationsSettingsProps {
  settings: any
  onChange: (values: any) => void
}

export default function IntegrationsSettings({ settings, onChange }: IntegrationsSettingsProps) {
  const handleChange = (category: string, key: string, value: any) => {
    onChange({
      [category]: {
        ...settings[category],
        [key]: value
      }
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Link className="mr-2 h-5 w-5" /> CRM Integration
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="crmEnabled"
              checked={settings.crm?.enabled || false}
              onCheckedChange={(checked) => handleChange('crm', 'enabled', !!checked)}
            />
            <Label htmlFor="crmEnabled">Enable CRM Integration</Label>
          </div>

          {settings.crm?.enabled && (
            <>
              <div>
                <Label htmlFor="crmProvider">CRM Provider</Label>
                <Select
                  value={settings.crm?.provider || 'salesforce'}
                  onValueChange={(value) => handleChange('crm', 'provider', value)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salesforce">Salesforce</SelectItem>
                    <SelectItem value="hubspot">HubSpot</SelectItem>
                    <SelectItem value="zoho">Zoho CRM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="crmApiKey">API Key</Label>
                <Input
                  id="crmApiKey"
                  type="password"
                  value={settings.crm?.apiKey || ''}
                  onChange={(e) => handleChange('crm', 'apiKey', e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div>
                <Label htmlFor="crmSyncFrequency">Sync Frequency</Label>
                <Select
                  value={settings.crm?.syncFrequency || 'daily'}
                  onValueChange={(value) => handleChange('crm', 'syncFrequency', value)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="crmSyncDirection">Sync Direction</Label>
                <Select
                  value={settings.crm?.syncDirection || 'two-way'}
                  onValueChange={(value) => handleChange('crm', 'syncDirection', value)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-way-to-crm">One-way (to CRM)</SelectItem>
                    <SelectItem value="one-way-from-crm">One-way (from CRM)</SelectItem>
                    <SelectItem value="two-way">Two-way</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <DollarSign className="mr-2 h-5 w-5" /> Accounting Integration
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="accountingEnabled"
              checked={settings.accounting?.enabled || false}
              onCheckedChange={(checked) => handleChange('accounting', 'enabled', !!checked)}
            />
            <Label htmlFor="accountingEnabled">Enable Accounting Integration</Label>
          </div>

          {settings.accounting?.enabled && (
            <>
              <div>
                <Label htmlFor="accountingProvider">Accounting Provider</Label>
                <Select
                  value={settings.accounting?.provider || 'quickbooks'}
                  onValueChange={(value) => handleChange('accounting', 'provider', value)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quickbooks">QuickBooks</SelectItem>
                    <SelectItem value="xero">Xero</SelectItem>
                    <SelectItem value="freshbooks">FreshBooks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accountingApiKey">API Key</Label>
                <Input
                  id="accountingApiKey"
                  type="password"
                  value={settings.accounting?.apiKey || ''}
                  onChange={(e) => handleChange('accounting', 'apiKey', e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div>
                <Label htmlFor="accountingSyncFrequency">Sync Frequency</Label>
                <Select
                  value={settings.accounting?.syncFrequency || 'daily'}
                  onValueChange={(value) => handleChange('accounting', 'syncFrequency', value)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accountingSyncDirection">Sync Direction</Label>
                <Select
                  value={settings.accounting?.syncDirection || 'two-way'}
                  onValueChange={(value) => handleChange('accounting', 'syncDirection', value)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-way-to-accounting">One-way (to Accounting)</SelectItem>
                    <SelectItem value="one-way-from-accounting">One-way (from Accounting)</SelectItem>
                    <SelectItem value="two-way">Two-way</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="mr-2 h-5 w-5" /> Calendar Integration
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="calendarEnabled"
              checked={settings.calendar?.enabled || false}
              onCheckedChange={(checked) => handleChange('calendar', 'enabled', !!checked)}
            />
            <Label htmlFor="calendarEnabled">Enable Calendar Integration</Label>
          </div>

          {settings.calendar?.enabled && (
            <>
              <div>
                <Label htmlFor="calendarProvider">Calendar Provider</Label>
                <Select
                  value={settings.calendar?.provider || 'google'}
                  onValueChange={(value) => handleChange('calendar', 'provider', value)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Calendar</SelectItem>
                    <SelectItem value="outlook">Outlook Calendar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="calendarApiKey">API Key</Label>
                <Input
                  id="calendarApiKey"
                  type="password"
                  value={settings.calendar?.apiKey || ''}
                  onChange={(e) => handleChange('calendar', 'apiKey', e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div>
                <Label htmlFor="calendarSyncFrequency">Sync Frequency</Label>
                <Select
                  value={settings.calendar?.syncFrequency || 'daily'}
                  onValueChange={(value) => handleChange('calendar', 'syncFrequency', value)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="calendarSyncDirection">Sync Direction</Label>
                <Select
                  value={settings.calendar?.syncDirection || 'two-way'}
                  onValueChange={(value) => handleChange('calendar', 'syncDirection', value)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-way-to-calendar">One-way (to Calendar)</SelectItem>
                    <SelectItem value="one-way-from-calendar">One-way (from Calendar)</SelectItem>
                    <SelectItem value="two-way">Two-way</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="mr-2 h-5 w-5" /> Document Management Integration
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="documentManagementEnabled"
              checked={settings.documentManagement?.enabled || false}
              onCheckedChange={(checked) => handleChange('documentManagement', 'enabled', !!checked)}
            />
            <Label htmlFor="documentManagementEnabled">Enable Document Management Integration</Label>
          </div>

          {settings.documentManagement?.enabled && (
            <>
              <div>
                <Label htmlFor="documentManagementProvider">Document Provider</Label>
                <Select
                  value={settings.documentManagement?.provider || 'dropbox'}
                  onValueChange={(value) => handleChange('documentManagement', 'provider', value)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dropbox">Dropbox</SelectItem>
                    <SelectItem value="google_drive">Google Drive</SelectItem>
                    <SelectItem value="onedrive">OneDrive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="documentManagementApiKey">API Key</Label>
                <Input
                  id="documentManagementApiKey"
                  type="password"
                  value={settings.documentManagement?.apiKey || ''}
                  onChange={(e) => handleChange('documentManagement', 'apiKey', e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div>
                <Label htmlFor="documentManagementSyncFrequency">Sync Frequency</Label>
                <Select
                  value={settings.documentManagement?.syncFrequency || 'daily'}
                  onValueChange={(value) => handleChange('documentManagement', 'syncFrequency', value)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="documentManagementSyncDirection">Sync Direction</Label>
                <Select
                  value={settings.documentManagement?.syncDirection || 'two-way'}
                  onValueChange={(value) => handleChange('documentManagement', 'syncDirection', value)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-way-to-dm">One-way (to DM)</SelectItem>
                    <SelectItem value="one-way-from-dm">One-way (from DM)</SelectItem>
                    <SelectItem value="two-way">Two-way</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}