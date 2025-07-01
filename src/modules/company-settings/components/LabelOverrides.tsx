import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tag, Save, RefreshCw } from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { useToast } from '@/hooks/use-toast'

export function LabelOverrides() {
  const { tenant, updateTenantSettings } = useTenant()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [labelOverrides, setLabelOverrides] = useState<Record<string, string>>(
    tenant?.settings?.labelOverrides || {}
  )
  const [platformType, setPlatformType] = useState<string>(
    tenant?.settings?.platformType || 'both'
  )

  // Default labels for each module
  const defaultLabels = {
    general: {
      'vehicle': 'Home/RV',
      'customer': 'Customer',
      'deal': 'Deal',
      'quote': 'Quote',
      'service': 'Service',
      'inventory': 'Inventory'
    },
    crm: {
      'lead': 'Lead',
      'prospect': 'Prospect',
      'contact': 'Contact',
      'activity': 'Activity',
      'source': 'Source'
    },
    inventory: {
      'vin': 'VIN',
      'make': 'Make',
      'model': 'Model',
      'year': 'Year',
      'type': 'Type',
      'price': 'Price',
      'cost': 'Cost',
      'features': 'Features'
    },
    sales: {
      'salesperson': 'Sales Rep',
      'commission': 'Commission',
      'deal_stage': 'Deal Stage',
      'close_date': 'Close Date',
      'financing': 'Financing'
    },
    service: {
      'technician': 'Technician',
      'service_ticket': 'Service Ticket',
      'parts': 'Parts',
      'labor': 'Labor',
      'warranty': 'Warranty'
    }
  }

  const handleLabelChange = (module: string, key: string, value: string) => {
    setLabelOverrides({
      ...labelOverrides,
      [`${module}.${key}`]: value
    })
  }

  const getOverrideValue = (module: string, key: string) => {
    return labelOverrides[`${module}.${key}`] || ''
  }

  const resetLabels = (module: string) => {
    const updatedOverrides = { ...labelOverrides }
    
    // Remove all overrides for the specified module
    Object.keys(updatedOverrides).forEach(key => {
      if (key.startsWith(`${module}.`)) {
        delete updatedOverrides[key]
      }
    })
    
    setLabelOverrides(updatedOverrides)
    
    toast({
      title: 'Labels Reset',
      description: `Default labels restored for ${module} module.`,
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateTenantSettings({
        labelOverrides,
        platformType
      })
      
      toast({
        title: 'Labels Updated',
        description: 'Your label overrides have been saved successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update label overrides.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="h-5 w-5 mr-2 text-primary" />
          Label Overrides
        </CardTitle>
        <CardDescription>
          Customize terminology throughout the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform Type Selection */}
        <div>
          <Label htmlFor="platformType">Platform Type</Label>
          <Select
            value={platformType}
            onValueChange={setPlatformType}
          >
            <SelectTrigger className="shadow-sm">
              <SelectValue placeholder="Select platform type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rv">RV Dealership</SelectItem>
              <SelectItem value="mh">Manufactured Housing</SelectItem>
              <SelectItem value="both">Both RV & Manufactured Housing</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            This setting affects terminology and features throughout the platform
          </p>
        </div>

        {/* Label Override Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="crm">CRM</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
          </TabsList>

          {Object.entries(defaultLabels).map(([module, labels]) => (
            <TabsContent key={module} value={module} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold capitalize">{module} Labels</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => resetLabels(module)}
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(labels).map(([key, defaultValue]) => {
                  // Special handling for 'vehicle' label based on platformType
                  let placeholderText = defaultValue
                  if (key === 'vehicle') {
                    if (platformType === 'rv') placeholderText = 'RV'
                    else if (platformType === 'mh') placeholderText = 'Home'
                    else placeholderText = 'Home/RV'
                  }
                  
                  return (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`${module}-${key}`} className="capitalize">
                        {key.replace(/_/g, ' ')}
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id={`${module}-${key}`}
                          value={getOverrideValue(module, key)}
                          onChange={(e) => handleLabelChange(module, key, e.target.value)}
                          placeholder={placeholderText}
                          className="shadow-sm"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Default: <span className="font-medium">{placeholderText}</span>
                      </p>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Preview */}
        <div className="border rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="space-y-4">
            <p className="text-sm">
              Here's how your customized labels will appear in the application:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(defaultLabels.general).map(([key, defaultValue]) => {
                const overrideValue = getOverrideValue('general', key)
                const displayValue = overrideValue || defaultValue
                
                // Special handling for 'vehicle' label based on platformType
                let finalValue = displayValue
                if (key === 'vehicle' && !overrideValue) {
                  if (platformType === 'rv') finalValue = 'RV'
                  else if (platformType === 'mh') finalValue = 'Home'
                  else finalValue = 'Home/RV'
                }
                
                return (
                  <div key={key} className="p-2 bg-muted/30 rounded-md">
                    <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                    <span>{finalValue}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

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
                Save Labels
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}