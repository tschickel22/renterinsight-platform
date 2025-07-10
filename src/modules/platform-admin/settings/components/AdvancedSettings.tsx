import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Code, Webhook, Download, Bug, Clock, Plus, Trash2 } from 'lucide-react'

interface AdvancedSettingsProps {
  settings: any
  onChange: (values: any) => void
}

export default function AdvancedSettings({ settings, onChange }: AdvancedSettingsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value })
  }

  const handleWebhookChange = (index: number, field: string, value: string) => {
    const newWebhooks = [...(settings.webhooks || [])]
    newWebhooks[index] = { ...newWebhooks[index], [field]: value }
    onChange({ webhooks: newWebhooks })
  }

  const addWebhook = () => {
    onChange({ webhooks: [...(settings.webhooks || []), { url: '', event: '' }] })
  }

  const removeWebhook = (index: number) => {
    const newWebhooks = [...(settings.webhooks || [])]
    newWebhooks.splice(index, 1)
    onChange({ webhooks: newWebhooks })
  }

  const handleFeatureFlagChange = (key: string, value: any) => {
    onChange({
      featureFlags: {
        ...settings.featureFlags,
        [key]: value
      }
    })
  }

  const addFeatureFlag = () => {
    const newKey = `newFeature${Object.keys(settings.featureFlags || {}).length + 1}`
    onChange({
      featureFlags: {
        ...settings.featureFlags,
        [newKey]: false
      }
    })
  }

  const removeFeatureFlag = (keyToRemove: string) => {
    const newFeatureFlags = { ...settings.featureFlags }
    delete newFeatureFlags[keyToRemove]
    onChange({ featureFlags: newFeatureFlags })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Code className="mr-2 h-5 w-5" /> Custom Scripts
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customScriptsHead">Custom &lt;head&gt; Scripts</Label>
            <Textarea
              id="customScriptsHead"
              value={settings.customScripts?.head || ''}
              onChange={(e) => handleChange('customScripts', { ...settings.customScripts, head: e.target.value })}
              placeholder="<!-- Add scripts for the <head> section here -->"
              rows={8}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Scripts or meta tags to be injected into the &lt;head&gt; section of every page.
            </p>
          </div>

          <div>
            <Label htmlFor="customScriptsBody">Custom &lt;body&gt; Scripts</Label>
            <Textarea
              id="customScriptsBody"
              value={settings.customScripts?.body || ''}
              onChange={(e) => handleChange('customScripts', { ...settings.customScripts, body: e.target.value })}
              placeholder="<!-- Add scripts for the <body> section here -->"
              rows={8}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Scripts to be injected at the end of the &lt;body&gt; section of every page.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Webhook className="mr-2 h-5 w-5" /> Webhooks
        </h3>
        <div className="space-y-4">
          {(settings.webhooks || []).map((webhook: any, index: number) => (
            <div key={index} className="border p-4 rounded-md space-y-3">
              <div>
                <Label htmlFor={`webhook-url-${index}`}>URL</Label>
                <Input
                  id={`webhook-url-${index}`}
                  value={webhook.url}
                  onChange={(e) => handleWebhookChange(index, 'url', e.target.value)}
                  placeholder="https://your-webhook-endpoint.com"
                />
              </div>
              <div>
                <Label htmlFor={`webhook-event-${index}`}>Event Trigger</Label>
                <Input
                  id={`webhook-event-${index}`}
                  value={webhook.event}
                  onChange={(e) => handleWebhookChange(index, 'event', e.target.value)}
                  placeholder="e.g., user.created, payment.succeeded"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => removeWebhook(index)}>
                <Trash2 className="h-4 w-4 mr-2" /> Remove Webhook
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addWebhook}>
            <Plus className="h-4 w-4 mr-2" /> Add Webhook
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Download className="mr-2 h-5 w-5" /> Data Export
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="dataExportFormat">Allowed Data Export Formats</Label>
            <Select
              value={settings.dataExportFormat?. || 'csv'} // Assuming single select for simplicity, can be multi-select
              onValueChange={(value) => handleChange('dataExportFormat', [value])}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Bug className="mr-2 h-5 w-5" /> Debugging & Logging
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="debugMode"
              checked={settings.debugMode || false}
              onCheckedChange={(checked) => handleChange('debugMode', !!checked)}
            />
            <Label htmlFor="debugMode">Enable Debug Mode</Label>
          </div>

          <div>
            <Label htmlFor="logLevel">Log Level</Label>
            <Select
              value={settings.logLevel || 'info'}
              onValueChange={(value) => handleChange('logLevel', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warn</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="mr-2 h-5 w-5" /> Maintenance Window
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="maintenanceWindowEnabled"
              checked={settings.maintenanceWindow?.enabled || false}
              onCheckedChange={(checked) => handleChange('maintenanceWindow', { ...settings.maintenanceWindow, enabled: !!checked })}
            />
            <Label htmlFor="maintenanceWindowEnabled">Enable Scheduled Maintenance Window</Label>
          </div>

          {settings.maintenanceWindow?.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl">
              <div>
                <Label htmlFor="maintenanceStartTime">Start Time</Label>
                <Input
                  id="maintenanceStartTime"
                  type="time"
                  value={settings.maintenanceWindow?.startTime || '02:00'}
                  onChange={(e) => handleChange('maintenanceWindow', { ...settings.maintenanceWindow, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="maintenanceEndTime">End Time</Label>
                <Input
                  id="maintenanceEndTime"
                  type="time"
                  value={settings.maintenanceWindow?.endTime || '04:00'}
                  onChange={(e) => handleChange('maintenanceWindow', { ...settings.maintenanceWindow, endTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="maintenanceDayOfWeek">Day of Week</Label>
                <Select
                  value={settings.maintenanceWindow?.dayOfWeek || 'sunday'}
                  onValueChange={(value) => handleChange('maintenanceWindow', { ...settings.maintenanceWindow, dayOfWeek: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Code className="mr-2 h-5 w-5" /> Feature Flags
        </h3>
        <div className="space-y-4">
          {(Object.keys(settings.featureFlags || {})).map((key: string, index: number) => (
            <div key={key} className="flex items-center space-x-4">
              <Input
                value={key}
                onChange={(e) => {
                  const newKey = e.target.value
                  const newFeatureFlags = { ...settings.featureFlags }
                  if (key !== newKey) {
                    newFeatureFlags[newKey] = newFeatureFlags[key]
                    delete newFeatureFlags[key]
                  }
                  onChange({ featureFlags: newFeatureFlags })
                }}
                className="w-48"
              />
              <Checkbox
                id={`feature-flag-${key}`}
                checked={settings.featureFlags[key]}
                onCheckedChange={(checked) => handleFeatureFlagChange(key, !!checked)}
              />
              <Label htmlFor={`feature-flag-${key}`}>{key}</Label>
              <Button variant="ghost" size="icon" onClick={() => removeFeatureFlag(key)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addFeatureFlag}>
            <Plus className="h-4 w-4 mr-2" /> Add Feature Flag
          </Button>
        </div>
      </div>
    </div>
  )
}