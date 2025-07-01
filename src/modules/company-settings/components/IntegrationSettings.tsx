import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe, Mail, MessageSquare, Webhook, Save, Plus, Trash2 } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'

export function IntegrationSettings() {
  const { tenant, updateTenantSettings } = useTenant()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Email Provider Settings
  const [emailProvider, setEmailProvider] = useState(tenant?.settings?.emailProvider || 'default')
  const [emailApiKey, setEmailApiKey] = useState(tenant?.settings?.emailApiKey || '')
  const [emailFromAddress, setEmailFromAddress] = useState(tenant?.settings?.emailFromAddress || '')
  const [emailFromName, setEmailFromName] = useState(tenant?.settings?.emailFromName || '')
  
  // SMS Provider Settings
  const [smsProvider, setSmsProvider] = useState(tenant?.settings?.smsProvider || 'default')
  const [smsApiKey, setSmsApiKey] = useState(tenant?.settings?.smsApiKey || '')
  const [smsFromNumber, setSmsFromNumber] = useState(tenant?.settings?.smsFromNumber || '')
  
  // Webhook Settings
  const [webhooks, setWebhooks] = useState<Array<{id: string, event: string, url: string, active: boolean}>>(
    tenant?.settings?.webhooks || []
  )
  const [newWebhookEvent, setNewWebhookEvent] = useState('')
  const [newWebhookUrl, setNewWebhookUrl] = useState('')
  
  // API Settings
  const [apiEnabled, setApiEnabled] = useState(tenant?.settings?.apiEnabled || false)
  const [apiKey, setApiKey] = useState(tenant?.settings?.apiKey || '')
  const [allowedOrigins, setAllowedOrigins] = useState<string[]>(tenant?.settings?.allowedOrigins || [])
  const [newAllowedOrigin, setNewAllowedOrigin] = useState('')

  const emailProviders = [
    { value: 'default', label: 'Default (Platform)' },
    { value: 'sendgrid', label: 'SendGrid' },
    { value: 'mailchimp', label: 'Mailchimp' },
    { value: 'mailgun', label: 'Mailgun' },
    { value: 'smtp', label: 'Custom SMTP' }
  ]

  const smsProviders = [
    { value: 'default', label: 'Default (Platform)' },
    { value: 'twilio', label: 'Twilio' },
    { value: 'messagebird', label: 'MessageBird' },
    { value: 'vonage', label: 'Vonage (Nexmo)' }
  ]

  const webhookEvents = [
    { value: 'lead.created', label: 'Lead Created' },
    { value: 'lead.updated', label: 'Lead Updated' },
    { value: 'quote.created', label: 'Quote Created' },
    { value: 'quote.accepted', label: 'Quote Accepted' },
    { value: 'service.created', label: 'Service Ticket Created' },
    { value: 'service.completed', label: 'Service Completed' },
    { value: 'vehicle.created', label: 'Home/RV Created' },
    { value: 'vehicle.sold', label: 'Home/RV Sold' }
  ]

  const addWebhook = () => {
    if (!newWebhookEvent || !newWebhookUrl) return
    
    setWebhooks([
      ...webhooks,
      {
        id: Math.random().toString(36).substring(2, 9),
        event: newWebhookEvent,
        url: newWebhookUrl,
        active: true
      }
    ])
    
    setNewWebhookEvent('')
    setNewWebhookUrl('')
  }

  const removeWebhook = (id: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id))
  }

  const toggleWebhook = (id: string) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === id ? { ...webhook, active: !webhook.active } : webhook
    ))
  }

  const addAllowedOrigin = () => {
    if (!newAllowedOrigin) return
    
    setAllowedOrigins([...allowedOrigins, newAllowedOrigin])
    setNewAllowedOrigin('')
  }

  const removeAllowedOrigin = (origin: string) => {
    setAllowedOrigins(allowedOrigins.filter(o => o !== origin))
  }

  const generateApiKey = () => {
    // In a real app, this would be done server-side
    const key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    setApiKey(key)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateTenantSettings({
        emailProvider,
        emailApiKey,
        emailFromAddress,
        emailFromName,
        smsProvider,
        smsApiKey,
        smsFromNumber,
        webhooks,
        apiEnabled,
        apiKey,
        allowedOrigins
      })
      
      toast({
        title: 'Integrations Updated',
        description: 'Your integration settings have been saved successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update integration settings.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Email Provider */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-primary" />
            Email Provider
          </CardTitle>
          <CardDescription>
            Configure your email delivery service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="emailProvider">Provider</Label>
            <Select
              value={emailProvider}
              onValueChange={setEmailProvider}
            >
              <SelectTrigger className="shadow-sm">
                <SelectValue placeholder="Select email provider" />
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
          
          {emailProvider !== 'default' && (
            <>
              <div>
                <Label htmlFor="emailApiKey">API Key</Label>
                <Input
                  id="emailApiKey"
                  type="password"
                  value={emailApiKey}
                  onChange={(e) => setEmailApiKey(e.target.value)}
                  className="shadow-sm"
                  placeholder="Enter API key"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="emailFromAddress">From Email Address</Label>
                  <Input
                    id="emailFromAddress"
                    type="email"
                    value={emailFromAddress}
                    onChange={(e) => setEmailFromAddress(e.target.value)}
                    className="shadow-sm"
                    placeholder="noreply@yourdomain.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emailFromName">From Name</Label>
                  <Input
                    id="emailFromName"
                    value={emailFromName}
                    onChange={(e) => setEmailFromName(e.target.value)}
                    className="shadow-sm"
                    placeholder="Your Company Name"
                  />
                </div>
              </div>
            </>
          )}
          
          {emailProvider === 'default' && (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700">
                Using the default platform email provider. No additional configuration needed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Provider */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-primary" />
            SMS Provider
          </CardTitle>
          <CardDescription>
            Configure your SMS delivery service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="smsProvider">Provider</Label>
            <Select
              value={smsProvider}
              onValueChange={setSmsProvider}
            >
              <SelectTrigger className="shadow-sm">
                <SelectValue placeholder="Select SMS provider" />
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
          
          {smsProvider !== 'default' && (
            <>
              <div>
                <Label htmlFor="smsApiKey">API Key</Label>
                <Input
                  id="smsApiKey"
                  type="password"
                  value={smsApiKey}
                  onChange={(e) => setSmsApiKey(e.target.value)}
                  className="shadow-sm"
                  placeholder="Enter API key"
                />
              </div>
              
              <div>
                <Label htmlFor="smsFromNumber">From Number</Label>
                <Input
                  id="smsFromNumber"
                  value={smsFromNumber}
                  onChange={(e) => setSmsFromNumber(e.target.value)}
                  className="shadow-sm"
                  placeholder="+1234567890"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Must be in E.164 format (e.g., +1234567890)
                </p>
              </div>
            </>
          )}
          
          {smsProvider === 'default' && (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700">
                Using the default platform SMS provider. No additional configuration needed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Webhook className="h-5 w-5 mr-2 text-primary" />
            Webhooks
          </CardTitle>
          <CardDescription>
            Configure webhooks to receive event notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="webhookEvent">Event</Label>
              <Select
                value={newWebhookEvent}
                onValueChange={setNewWebhookEvent}
              >
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {webhookEvents.map(event => (
                    <SelectItem key={event.value} value={event.value}>
                      {event.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="webhookUrl"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="shadow-sm flex-1"
                  placeholder="https://your-endpoint.com/webhook"
                />
                <Button type="button" onClick={addWebhook}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mt-4">
            {webhooks.length > 0 ? (
              webhooks.map(webhook => (
                <div key={webhook.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={webhook.active}
                      onCheckedChange={() => toggleWebhook(webhook.id)}
                    />
                    <div>
                      <div className="font-medium">{webhookEvents.find(e => e.value === webhook.event)?.label || webhook.event}</div>
                      <div className="text-sm text-muted-foreground">{webhook.url}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWebhook(webhook.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                <Webhook className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No webhooks configured</p>
                <p className="text-sm">Add webhooks to receive event notifications</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Access */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2 text-primary" />
            API Access
          </CardTitle>
          <CardDescription>
            Configure API access for external integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="apiEnabled"
              checked={apiEnabled}
              onCheckedChange={(checked) => setApiEnabled(!!checked)}
            />
            <Label htmlFor="apiEnabled">Enable API access</Label>
          </div>
          
          {apiEnabled && (
            <>
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="shadow-sm flex-1"
                    placeholder="API key will appear here"
                    readOnly
                  />
                  <Button type="button" onClick={generateApiKey}>
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Keep this key secure. It provides full access to your account.
                </p>
              </div>
              
              <div>
                <Label htmlFor="allowedOrigins">Allowed Origins (CORS)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="allowedOrigins"
                    value={newAllowedOrigin}
                    onChange={(e) => setNewAllowedOrigin(e.target.value)}
                    className="shadow-sm flex-1"
                    placeholder="https://your-domain.com"
                  />
                  <Button type="button" onClick={addAllowedOrigin}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Domains that are allowed to make API requests
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {allowedOrigins.map((origin, index) => (
                  <div key={index} className="flex items-center bg-muted/50 px-3 py-1 rounded-md">
                    <span className="mr-2">{origin}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-5 w-5 p-0" 
                      onClick={() => removeAllowedOrigin(origin)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {allowedOrigins.length === 0 && (
                  <div className="text-sm text-muted-foreground">No origins added yet</div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Integrations
            </>
          )}
        </Button>
      </div>
    </div>
  )
}