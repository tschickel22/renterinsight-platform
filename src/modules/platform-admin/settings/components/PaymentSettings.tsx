import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle } from 'lucide-react'

interface PaymentSettingsProps {
  settings: any
  onChange: (values: any) => void
}

export default function PaymentSettings({ settings, onChange }: PaymentSettingsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value })
  }

  const currencies = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' },
  ]

  const paymentGateways = [
    { value: 'none', label: 'None' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'paypal', label: 'PayPal' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Currency Settings</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="currency">Default Currency</Label>
            <Select
              value={settings.currency || 'USD'}
              onValueChange={(value) => handleChange('currency', value)}
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
            <Label htmlFor="currencySymbol">Currency Symbol</Label>
            <Input
              id="currencySymbol"
              value={settings.currencySymbol || '$'}
              onChange={(e) => handleChange('currencySymbol', e.target.value)}
              className="max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              step="0.01"
              value={(settings.taxRate * 100) || 0}
              onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) / 100)}
              className="max-w-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Gateway Integration</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="paymentGateway">Select Payment Gateway</Label>
            <Select
              value={settings.paymentGateway || 'none'}
              onValueChange={(value) => handleChange('paymentGateway', value)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentGateways.map(gateway => (
                  <SelectItem key={gateway.value} value={gateway.value}>
                    {gateway.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {settings.paymentGateway === 'stripe' && (
            <div className="space-y-4 border p-4 rounded-md">
              <h4 className="font-medium">Stripe Configuration</h4>
              <div>
                <Label htmlFor="stripePublishableKey">Stripe Publishable Key</Label>
                <Input
                  id="stripePublishableKey"
                  value={settings.stripePublishableKey || ''}
                  onChange={(e) => handleChange('stripePublishableKey', e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div>
                <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                <Input
                  id="stripeSecretKey"
                  type="password"
                  value={settings.stripeSecretKey || ''}
                  onChange={(e) => handleChange('stripeSecretKey', e.target.value)}
                  className="max-w-md"
                />
              </div>
            </div>
          )}

          {settings.paymentGateway === 'paypal' && (
            <div className="space-y-4 border p-4 rounded-md">
              <h4 className="font-medium">PayPal Configuration</h4>
              <div>
                <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                <Input
                  id="paypalClientId"
                  value={settings.paypalClientId || ''}
                  onChange={(e) => handleChange('paypalClientId', e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div>
                <Label htmlFor="paypalClientSecret">PayPal Client Secret</Label>
                <Input
                  id="paypalClientSecret"
                  type="password"
                  value={settings.paypalClientSecret || ''}
                  onChange={(e) => handleChange('paypalClientSecret', e.target.value)}
                  className="max-w-md"
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="enableSubscriptions"
              checked={settings.enableSubscriptions || false}
              onCheckedChange={(checked) => handleChange('enableSubscriptions', !!checked)}
            />
            <Label htmlFor="enableSubscriptions">Enable Subscription Payments</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enableInvoiceGeneration"
              checked={settings.enableInvoiceGeneration || false}
              onCheckedChange={(checked) => handleChange('enableInvoiceGeneration', !!checked)}
            />
            <Label htmlFor="enableInvoiceGeneration">Enable Automatic Invoice Generation</Label>
          </div>
        </div>
      </div>
    </div>
  )
}