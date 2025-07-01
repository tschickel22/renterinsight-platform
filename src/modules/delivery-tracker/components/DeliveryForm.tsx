import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Plus, Truck, Calendar, MapPin, Clock, User } from 'lucide-react'
import { Delivery, DeliveryStatus, Vehicle } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { useDropzone } from 'react-dropzone'
import { NewLeadForm } from '@/modules/crm-prospecting/components/NewLeadForm'

interface DeliveryFormProps {
  delivery?: Delivery
  vehicles: Vehicle[]
  customers: any[] // Using existing customer data
  onSave: (deliveryData: Partial<Delivery>) => Promise<void>
  onCancel: () => void
}

export function DeliveryForm({ delivery, vehicles, customers, onSave, onCancel }: DeliveryFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
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
    customFields: {
      contactPhone: '',
      contactEmail: '',
      sendSMSUpdates: true,
      sendEmailUpdates: true,
      estimatedArrival: '',
      departureTime: '',
      departureNotes: '',
      deliveryNotes: '',
      deliveryPhotos: []
    }
  })

  // Initialize form with delivery data if editing
  useEffect(() => {
    if (delivery) {
      setFormData({
        ...delivery,
        customFields: {
          ...delivery.customFields,
          contactPhone: delivery.customFields?.contactPhone || '',
          contactEmail: delivery.customFields?.contactEmail || '',
          sendSMSUpdates: delivery.customFields?.sendSMSUpdates !== false,
          sendEmailUpdates: delivery.customFields?.sendEmailUpdates !== false,
          estimatedArrival: delivery.customFields?.estimatedArrival || '',
          departureTime: delivery.customFields?.departureTime || '',
          departureNotes: delivery.customFields?.departureNotes || '',
          deliveryNotes: delivery.customFields?.deliveryNotes || '',
          deliveryPhotos: delivery.customFields?.deliveryPhotos || []
        }
      })
    }
  }, [delivery])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      // In a real app, you would upload these files to a storage service
      // For this demo, we'll create object URLs
      const newPhotos = acceptedFiles.map(file => 
        URL.createObjectURL(file)
      )
      
      setFormData(prev => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          deliveryPhotos: [...(prev.customFields?.deliveryPhotos || []), ...newPhotos]
        }
      }))
      
      toast({
        title: 'Photos Added',
        description: `Added ${acceptedFiles.length} delivery photos`,
      })
    }
  })

  const handleCustomerSelect = (value: string) => {
    if (value === '__add_new_customer__') {
      setShowNewCustomerForm(true)
    } else {
      setFormData(prev => ({ ...prev, customerId: value }))
    }
  }

  const handleNewCustomerSuccess = (newCustomer: any) => {
    setFormData(prev => ({
      ...prev,
      customerId: newCustomer.id
    }))
    setShowNewCustomerForm(false)
    
    toast({
      title: 'Customer Added',
      description: `${newCustomer.firstName} ${newCustomer.lastName} has been added as a customer.`,
    })
  }

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

  const removePhoto = (photoUrl: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        deliveryPhotos: prev.customFields?.deliveryPhotos?.filter(p => p !== photoUrl) || []
      }
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* New Customer Form Modal */}
      {showNewCustomerForm && (
        <NewLeadForm
          onClose={() => setShowNewCustomerForm(false)}
          onSuccess={handleNewCustomerSuccess}
        />
      )}
      
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select value={formData.customerId} onValueChange={handleCustomerSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <div className="px-2 py-1.5">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start" 
                          onClick={() => handleCustomerSelect('__add_new_customer__')}
                        >
                          <Plus className="h-3.5 w-3.5 mr-2" />
                          Add New Customer
                        </Button>
                      </div>
                      <div className="px-2 py-1 border-t"></div>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex flex-col">
                            <span>{customer.firstName} {customer.lastName}</span>
                            <span className="text-xs text-muted-foreground">{customer.phone}</span>
                          </div>
                        </SelectItem>
                      ))}
                      {customers.length === 0 && (
                        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                          No customers found
                        </div>
                      )}
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
                    <SelectContent className="z-50">
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate ? new Date(formData.scheduledDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      scheduledDate: e.target.value ? new Date(e.target.value) : new Date() 
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="estimatedArrival">Estimated Arrival Time</Label>
                  <Input
                    id="estimatedArrival"
                    type="time"
                    value={formData.customFields?.estimatedArrival || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      customFields: {
                        ...prev.customFields,
                        estimatedArrival: e.target.value
                      }
                    }))}
                  />
                </div>
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
                  <SelectContent className="z-50">
                    <SelectItem value={DeliveryStatus.SCHEDULED}>Scheduled</SelectItem>
                    <SelectItem value={DeliveryStatus.IN_TRANSIT}>In Transit</SelectItem>
                    <SelectItem value={DeliveryStatus.DELIVERED}>Delivered</SelectItem>
                    <SelectItem value={DeliveryStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="driver">Driver</Label>
                <Input
                  id="driver"
                  value={formData.driver || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, driver: e.target.value }))}
                  placeholder="Driver name"
                />
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
                    address: { ...prev.address, street: e.target.value } 
                  }))}
                  placeholder="123 Main St"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.address?.city || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value } 
                    }))}
                    placeholder="City"
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.address?.state || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, state: e.target.value } 
                    }))}
                    placeholder="State"
                  />
                </div>
                
                <div>
                  <Label htmlFor="zipCode">Zip Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, zipCode: e.target.value } 
                    }))}
                    placeholder="Zip Code"
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
                    address: { ...prev.address, country: e.target.value } 
                  }))}
                  placeholder="Country"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.customFields?.contactPhone || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      customFields: {
                        ...prev.customFields,
                        contactPhone: e.target.value
                      }
                    }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.customFields?.contactEmail || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      customFields: {
                        ...prev.customFields,
                        contactEmail: e.target.value
                      }
                    }))}
                    placeholder="customer@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendSMSUpdates"
                    checked={formData.customFields?.sendSMSUpdates !== false}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      customFields: {
                        ...prev.customFields,
                        sendSMSUpdates: !!checked
                      }
                    }))}
                  />
                  <Label htmlFor="sendSMSUpdates">Send SMS updates</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendEmailUpdates"
                    checked={formData.customFields?.sendEmailUpdates !== false}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      customFields: {
                        ...prev.customFields,
                        sendEmailUpdates: !!checked
                      }
                    }))}
                  />
                  <Label htmlFor="sendEmailUpdates">Send email updates</Label>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Delivery Details</h3>
              
              {(formData.status === DeliveryStatus.IN_TRANSIT || formData.status === DeliveryStatus.DELIVERED) && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="departureTime">Departure Time</Label>
                    <Input
                      id="departureTime"
                      type="datetime-local"
                      value={formData.customFields?.departureTime || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        customFields: {
                          ...prev.customFields,
                          departureTime: e.target.value
                        }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="departureNotes">Departure Notes</Label>
                    <Input
                      id="departureNotes"
                      value={formData.customFields?.departureNotes || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        customFields: {
                          ...prev.customFields,
                          departureNotes: e.target.value
                        }
                      }))}
                      placeholder="Notes about departure"
                    />
                  </div>
                </div>
              )}
              
              {formData.status === DeliveryStatus.DELIVERED && (
                <div>
                  <Label htmlFor="deliveredDate">Delivery Date</Label>
                  <Input
                    id="deliveredDate"
                    type="datetime-local"
                    value={formData.deliveredDate ? new Date(formData.deliveredDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      deliveredDate: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="notes">Delivery Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this delivery"
                  rows={3}
                />
              </div>
            </div>

            {/* Delivery Photos */}
            {(formData.status === DeliveryStatus.DELIVERED || formData.status === DeliveryStatus.IN_TRANSIT) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Delivery Photos</h3>
                
                <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/10">
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center">
                    <Camera className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop photos here, or click to select files
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload photos for delivery verification
                    </p>
                  </div>
                </div>
                
                {formData.customFields?.deliveryPhotos && formData.customFields.deliveryPhotos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.customFields.deliveryPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={photo} 
                          alt={`Delivery photo ${index + 1}`} 
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(photo)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
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