import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Save, Truck, Calendar, MapPin } from 'lucide-react'
import { Delivery, DeliveryStatus } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'

interface DeliveryFormProps {
  delivery?: Delivery
  onSave: (deliveryData: Partial<Delivery>) => Promise<void>
  onCancel: () => void
}

export function DeliveryForm({ delivery, onSave, onCancel }: DeliveryFormProps) {
  const { toast } = useToast()
  const { vehicles } = useInventoryManagement()
  const { leads } = useLeadManagement()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Delivery>>({
    customerId: '',
    vehicleId: '',
    status: DeliveryStatus.SCHEDULED,
    scheduledDate: new Date(),
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    driver: '',
    notes: '',
    customFields: {}
  })

  // Initialize form with delivery data if editing
  useEffect(() => {
    if (delivery) {
      setFormData({
        ...delivery,
        scheduledDate: new Date(delivery.scheduledDate)
      })
    }
  }, [delivery])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerId || !formData.vehicleId || !formData.scheduledDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    if (!formData.address?.street || !formData.address?.city || !formData.address?.state || !formData.address?.zipCode) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a complete delivery address',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: `Delivery ${delivery ? 'updated' : 'scheduled'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${delivery ? 'update' : 'schedule'} delivery`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // List of drivers (in a real app, this would come from a database)
  const drivers = [
    { id: 'Driver-001', name: 'John Smith' },
    { id: 'Driver-002', name: 'Sarah Johnson' },
    { id: 'Driver-003', name: 'Mike Davis' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{delivery ? 'Edit Delivery' : 'Schedule Delivery'}</CardTitle>
              <CardDescription>
                {delivery ? 'Update delivery details' : 'Schedule a new delivery'}
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
              <h3 className="text-lg font-semibold">Delivery Information</h3>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.map(lead => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.firstName} {lead.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="vehicleId">Vehicle *</Label>
                  <Select 
                    value={formData.vehicleId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate ? new Date(formData.scheduledDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      scheduledDate: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: DeliveryStatus) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DeliveryStatus.SCHEDULED}>Scheduled</SelectItem>
                      <SelectItem value={DeliveryStatus.IN_TRANSIT}>In Transit</SelectItem>
                      <SelectItem value={DeliveryStatus.DELIVERED}>Delivered</SelectItem>
                      <SelectItem value={DeliveryStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="driver">Assigned Driver</Label>
                <Select 
                  value={formData.driver} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, driver: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {drivers.map(driver => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Delivery Address</h3>
              
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.address?.street || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address!, street: e.target.value } 
                  }))}
                  placeholder="e.g., 123 Main St"
                />
              </div>
              
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.address?.city || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address!, city: e.target.value } 
                    }))}
                    placeholder="e.g., Springfield"
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.address?.state || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address!, state: e.target.value } 
                    }))}
                    placeholder="e.g., IL"
                  />
                </div>
                
                <div>
                  <Label htmlFor="zipCode">Zip Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address!, zipCode: e.target.value } 
                    }))}
                    placeholder="e.g., 62701"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.address?.country || 'USA'}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address!, country: e.target.value } 
                  }))}
                  placeholder="e.g., USA"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div>
                <Label htmlFor="notes">Delivery Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any special instructions or notes for this delivery"
                  rows={3}
                />
              </div>

              {/* Estimated delivery time */}
              <div>
                <Label htmlFor="estimatedTime">Estimated Delivery Time</Label>
                <Input
                  id="estimatedTime"
                  type="time"
                  value={formData.customFields?.estimatedTime || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    customFields: { ...prev.customFields, estimatedTime: e.target.value } 
                  }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Approximate time of day when delivery will occur
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {delivery ? 'Updating...' : 'Scheduling...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {delivery ? 'Update' : 'Schedule'} Delivery
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