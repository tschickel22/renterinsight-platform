import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X, Save, Plus, Trash2, Wrench, ShieldCheck } from 'lucide-react'
import { ServiceTicket, ServiceStatus, Priority } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Technician, WarrantyType } from '../types'
import { cn } from '@/lib/utils'

interface ServiceTicketFormProps {
  ticket?: ServiceTicket
  customers: any[] // Using existing customer data
  vehicles: any[] // Using existing vehicle data
  technicians: Technician[]
  onSave: (ticketData: Partial<ServiceTicket>) => Promise<void>
  onCancel: () => void
}

export function ServiceTicketForm({
  ticket,
  customers,
  vehicles,
  technicians,
  onSave,
  onCancel
}: ServiceTicketFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<ServiceTicket>>({
    customerId: '',
    vehicleId: '',
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    status: ServiceStatus.OPEN,
    assignedTo: '',
    scheduledDate: undefined,
    notes: '',
    parts: [],
    labor: [],
    customFields: {}
  })

  const [showAddPart, setShowAddPart] = useState(false)
  const [showAddLabor, setShowAddLabor] = useState(false)
  const [newPart, setNewPart] = useState({
    partNumber: '',
    description: '',
    quantity: 1,
    unitCost: 0
  })
  const [newLabor, setNewLabor] = useState({
    description: '',
    hours: 1,
    rate: 85
  })
  const [hasWarranty, setHasWarranty] = useState(false)
  const [warrantyType, setWarrantyType] = useState<WarrantyType>(WarrantyType.NONE)

  // Initialize form with ticket data if editing
  useEffect(() => {
    if (ticket) {
      setFormData({
        ...ticket,
        scheduledDate: ticket.scheduledDate ? new Date(ticket.scheduledDate).toISOString().split('T')[0] : undefined
      })
      
      // Check if this ticket has warranty info
      setHasWarranty(!!ticket.customFields?.warrantyType)
      if (ticket.customFields?.warrantyType) {
        setWarrantyType(ticket.customFields.warrantyType as WarrantyType)
      }
    }
  }, [ticket])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerId || !formData.title || !formData.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      // Add warranty information to custom fields if applicable
      const updatedFormData = {
        ...formData,
        customFields: {
          ...formData.customFields,
          warrantyType: hasWarranty ? warrantyType : WarrantyType.NONE,
          isWarrantyCovered: hasWarranty
        }
      }
      
      await onSave(updatedFormData)
      toast({
        title: 'Success',
        description: `Service ticket ${ticket ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${ticket ? 'update' : 'create'} service ticket`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addPart = () => {
    if (!newPart.partNumber || !newPart.description || newPart.quantity < 1 || newPart.unitCost <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all part details correctly',
        variant: 'destructive'
      })
      return
    }

    const part = {
      id: Math.random().toString(36).substr(2, 9),
      partNumber: newPart.partNumber,
      description: newPart.description,
      quantity: newPart.quantity,
      unitCost: newPart.unitCost,
      total: newPart.quantity * newPart.unitCost
    }

    setFormData(prev => ({
      ...prev,
      parts: [...(prev.parts || []), part]
    }))

    setNewPart({
      partNumber: '',
      description: '',
      quantity: 1,
      unitCost: 0
    })
    setShowAddPart(false)
  }

  const removePart = (partId: string) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts?.filter(p => p.id !== partId) || []
    }))
  }

  const addLabor = () => {
    if (!newLabor.description || newLabor.hours <= 0 || newLabor.rate <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all labor details correctly',
        variant: 'destructive'
      })
      return
    }

    const labor = {
      id: Math.random().toString(36).substr(2, 9),
      description: newLabor.description,
      hours: newLabor.hours,
      rate: newLabor.rate,
      total: newLabor.hours * newLabor.rate
    }

    setFormData(prev => ({
      ...prev,
      labor: [...(prev.labor || []), labor]
    }))

    setNewLabor({
      description: '',
      hours: 1,
      rate: 85
    })
    setShowAddLabor(false)
  }

  const removeLabor = (laborId: string) => {
    setFormData(prev => ({
      ...prev,
      labor: prev.labor?.filter(l => l.id !== laborId) || []
    }))
  }

  const calculateTotal = () => {
    const partsTotal = formData.parts?.reduce((sum, part) => sum + part.total, 0) || 0
    const laborTotal = formData.labor?.reduce((sum, labor) => sum + labor.total, 0) || 0
    return partsTotal + laborTotal
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{ticket ? 'Edit Service Ticket' : 'Create Service Ticket'}</CardTitle>
              <CardDescription>
                {ticket ? 'Update service ticket details' : 'Create a new service ticket'}
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
              <h3 className="text-lg font-semibold flex items-center">
                <Wrench className="h-4 w-4 mr-2" />
                Ticket Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
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
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.firstName} {customer.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="vehicleId">Vehicle</Label>
                  <Select 
                    value={formData.vehicleId || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Annual Maintenance Service"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the service needed"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: Priority) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Priority.LOW}>Low</SelectItem>
                      <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={Priority.HIGH}>High</SelectItem>
                      <SelectItem value={Priority.URGENT}>Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: ServiceStatus) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ServiceStatus.OPEN}>Open</SelectItem>
                      <SelectItem value={ServiceStatus.IN_PROGRESS}>In Progress</SelectItem>
                      <SelectItem value={ServiceStatus.WAITING_PARTS}>Waiting for Parts</SelectItem>
                      <SelectItem value={ServiceStatus.COMPLETED}>Completed</SelectItem>
                      <SelectItem value={ServiceStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value || undefined }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="assignedTo">Assigned Technician</Label>
                <Select 
                  value={formData.assignedTo || ''} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {technicians.map(tech => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name} ({tech.currentLoad}/{tech.maxCapacity} jobs)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Warranty Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Warranty Information
              </h3>
              
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="hasWarranty"
                  checked={hasWarranty}
                  onChange={(e) => setHasWarranty(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="hasWarranty">Service is covered under warranty</Label>
              </div>
              
              {hasWarranty && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="warrantyType">Warranty Type</Label>
                    <Select 
                      value={warrantyType} 
                      onValueChange={(value: WarrantyType) => setWarrantyType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={WarrantyType.MANUFACTURER}>Manufacturer</SelectItem>
                        <SelectItem value={WarrantyType.EXTENDED}>Extended</SelectItem>
                        <SelectItem value={WarrantyType.DEALER}>Dealer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="warrantyProvider">Provider</Label>
                    <Input
                      id="warrantyProvider"
                      value={formData.customFields?.warrantyProvider || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          warrantyProvider: e.target.value
                        }
                      }))}
                      placeholder="e.g., Forest River, Good Sam"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contractNumber">Contract Number</Label>
                    <Input
                      id="contractNumber"
                      value={formData.customFields?.contractNumber || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          contractNumber: e.target.value
                        }
                      }))}
                      placeholder="e.g., WC-12345"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Parts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Parts</h3>
                <Button type="button" onClick={() => setShowAddPart(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Part
                </Button>
              </div>

              {/* Add Part Form */}
              {showAddPart && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="partNumber">Part Number</Label>
                        <Input
                          id="partNumber"
                          value={newPart.partNumber}
                          onChange={(e) => setNewPart(prev => ({ ...prev, partNumber: e.target.value }))}
                          placeholder="e.g., AC-COMP-001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="partDescription">Description</Label>
                        <Input
                          id="partDescription"
                          value={newPart.description}
                          onChange={(e) => setNewPart(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="e.g., AC Compressor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={newPart.quantity}
                          onChange={(e) => setNewPart(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="unitCost">Unit Cost</Label>
                        <Input
                          id="unitCost"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newPart.unitCost}
                          onChange={(e) => setNewPart(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button type="button" variant="outline" onClick={() => setShowAddPart(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={addPart}>
                        Add Part
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Parts List */}
              <div className="space-y-3">
                {formData.parts?.map((part) => (
                  <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{part.description}</div>
                      <div className="text-sm text-muted-foreground">
                        Part #: {part.partNumber} • Quantity: {part.quantity} × {formatCurrency(part.unitCost)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(part.total)}</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePart(part.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                {(!formData.parts || formData.parts.length === 0) && (
                  <div className="text-center py-4 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                    No parts added yet
                  </div>
                )}
              </div>
            </div>

            {/* Labor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Labor</h3>
                <Button type="button" onClick={() => setShowAddLabor(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Labor
                </Button>
              </div>

              {/* Add Labor Form */}
              {showAddLabor && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <Label htmlFor="laborDescription">Description</Label>
                        <Input
                          id="laborDescription"
                          value={newLabor.description}
                          onChange={(e) => setNewLabor(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="e.g., AC System Diagnostic"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hours">Hours</Label>
                        <Input
                          id="hours"
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={newLabor.hours}
                          onChange={(e) => setNewLabor(prev => ({ ...prev, hours: parseFloat(e.target.value) || 1 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rate">Hourly Rate</Label>
                        <Input
                          id="rate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newLabor.rate}
                          onChange={(e) => setNewLabor(prev => ({ ...prev, rate: parseFloat(e.target.value) || 85 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="laborTotal">Total</Label>
                        <Input
                          id="laborTotal"
                          type="text"
                          value={formatCurrency(newLabor.hours * newLabor.rate)}
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button type="button" variant="outline" onClick={() => setShowAddLabor(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={addLabor}>
                        Add Labor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Labor List */}
              <div className="space-y-3">
                {formData.labor?.map((labor) => (
                  <div key={labor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{labor.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {labor.hours} hours @ {formatCurrency(labor.rate)}/hr
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(labor.total)}</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLabor(labor.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                {(!formData.labor || formData.labor.length === 0) && (
                  <div className="text-center py-4 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                    No labor added yet
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notes</h3>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes about this service ticket..."
                rows={3}
              />
            </div>

            {/* Total */}
            {(formData.parts?.length || formData.labor?.length) && (
              <div className="flex justify-end p-3 bg-muted/30 rounded-lg">
                <div className="text-right">
                  <div className="flex justify-between items-center mb-1 w-48">
                    <span className="text-sm">Parts:</span>
                    <span className="font-medium">{formatCurrency(formData.parts?.reduce((sum, part) => sum + part.total, 0) || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1 w-48">
                    <span className="text-sm">Labor:</span>
                    <span className="font-medium">{formatCurrency(formData.labor?.reduce((sum, labor) => sum + labor.total, 0) || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t w-48">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-primary">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
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
                    {ticket ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {ticket ? 'Update' : 'Create'} Ticket
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