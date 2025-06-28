import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Building } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AddTenantFormProps {
  onSave: (tenantData: any) => Promise<void>
  onCancel: () => void
}

export function AddTenantForm({ onSave, onCancel }: AddTenantFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/dd/yyyy',
      features: {
        crm: true,
        inventory: true,
        quotes: true,
        agreements: true,
        service: true,
        delivery: true,
        commissions: true,
        portal: true,
        invoices: true,
        reports: true
      }
    },
    branding: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      fontFamily: 'Inter'
    },
    isActive: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.domain) {
      toast({
        title: 'Validation Error',
        description: 'Tenant name and domain are required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: 'Tenant created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create tenant',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                Add New Tenant
              </CardTitle>
              <CardDescription>
                Create a new tenant organization
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tenant Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Tenant Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Sunshine RV Dealership"
                  />
                </div>
                
                <div>
                  <Label htmlFor="domain">Domain *</Label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                    placeholder="e.g., sunshine.renterinsight.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be used for tenant-specific access
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.settings.timezone}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, timezone: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.settings.currency}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, currency: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={formData.settings.dateFormat}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, dateFormat: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Enabled Features</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(formData.settings.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={enabled}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          features: {
                            ...prev.settings.features,
                            [feature]: !!checked
                          }
                        }
                      }))}
                    />
                    <Label htmlFor={`feature-${feature}`} className="capitalize">
                      {feature === 'crm' ? 'CRM & Prospecting' : 
                       feature === 'invoices' ? 'Invoice & Payments' : 
                       feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Branding */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Branding</h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type="color"
                      id="primaryColor"
                      value={formData.branding.primaryColor}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        branding: { ...prev.branding, primaryColor: e.target.value }
                      }))}
                      className="w-16 h-10 shadow-sm"
                    />
                    <Input 
                      value={formData.branding.primaryColor} 
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        branding: { ...prev.branding, primaryColor: e.target.value }
                      }))}
                      className="shadow-sm" 
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type="color"
                      id="secondaryColor"
                      value={formData.branding.secondaryColor}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        branding: { ...prev.branding, secondaryColor: e.target.value }
                      }))}
                      className="w-16 h-10 shadow-sm"
                    />
                    <Input 
                      value={formData.branding.secondaryColor} 
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        branding: { ...prev.branding, secondaryColor: e.target.value }
                      }))}
                      className="shadow-sm" 
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select
                    value={formData.branding.fontFamily}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      branding: { ...prev.branding, fontFamily: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
              />
              <Label htmlFor="isActive">Active tenant</Label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Tenant
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}