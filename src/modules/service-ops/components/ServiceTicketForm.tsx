import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X, Save, Plus, Trash2, Wrench, Calendar, Clock } from 'lucide-react'
import { ServiceTicket, ServiceStatus, Priority, ServicePart, ServiceLabor } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'
import { NewLeadForm } from '@/modules/crm-prospecting/components/NewLeadForm'

interface ServiceTicketFormProps {
  ticket?: ServiceTicket
  onSave: (ticketData: Partial<ServiceTicket>) => Promise<void>
  onCancel: () => void
}

export function ServiceTicketForm({ ticket, onSave, onCancel }: ServiceTicketFormProps) {
  const { toast } = useToast()
  const { vehicles } = useInventoryManagement()
  const { leads } = useLeadManagement()
  const [loading, setLoading] = useState(false)
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
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
    customFields: {
      warrantyStatus: 'not_covered',
      estimatedCompletionDate: '',
      customerAuthorization: false,
      technicianNotes: '',
      customerPortalAccess: true
    }
  })

  const [showAddPart, setShowAddPart] = useState(false)
  const [showAddLabor, setShowAddLabor] = useState(false)
  const [newPart, setNewPart] = useState<Partial<ServicePart>>({
    partNumber: '',
    description: '',
    quantity: 1,
    unitCost: 0,
    total: 0
  })
  const [newLabor, setNewLabor] = useState<Partial<ServiceLabor>>({
    description: '',
    hours: 1,
    rate: 85,
    total: 85
  })

  // Initialize form with ticket data if editing
  useEffect(() => {
    if (ticket) {
      setFormData({
        ...ticket,
        customFields: {
          ...ticket.customFields,
          warrantyStatus: ticket.customFields?.warrantyStatus || 'not_covered',
          estimatedCompletionDate: ticket.customFields?.estimatedCompletionDate || '',
          customerAuthorization: ticket.customFields?.customerAuthorization || false,
          technicianNotes: ticket.customFields?.technicianNotes || '',
          customerPortalAccess: ticket.customFields?.customerPortalAccess !== false
        }
      })
    }
  }, [ticket])

  // Update part total when quantity or unit cost changes
  useEffect(() => {
    const quantity = newPart.quantity || 1
    const unitCost = newPart.unitCost || 0
    setNewPart(prev => ({
      ...prev,
      total: quantity * unitCost
    }))
  }, [newPart.quantity, newPart.unitCost])

  // Update labor total when hours or rate changes
  useEffect(() => {
    const hours = newLabor.hours || 1
    const rate = newLabor.rate || 85
    setNewLabor(prev => ({
      ...prev,
      total: hours * rate
    }))
  }, [newLabor.hours, newLabor.rate])

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
      await onSave(formData)
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

  const handleCustomerSelect = (value: string) => {
    if (value === 'add-new') {
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

  const addPart = () => {
    if (!newPart.partNumber || !newPart.description) {
      toast({
        title: 'Validation Error',
        description: 'Part number and description are required',
        variant: 'destructive'
      })
      return
    }

    const part: ServicePart = {
      id: Math.random().toString(36).substr(2, 9),
      partNumber: newPart.partNumber || '',
      description: newPart.description || '',
      quantity: newPart.quantity || 1,
      unitCost: newPart.unitCost || 0,
      total: newPart.total || 0
    }

    setFormData(prev => ({
      ...prev,
      parts: [...(prev.parts || []), part]
    }))

    setNewPart({
      partNumber: '',
      description: '',
      quantity: 1,
      unitCost: 0,
      total: 0
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
    if (!newLabor.description) {
      toast({
        title: 'Validation Error',
        description: 'Labor description is required',
        variant: 'destructive'
      })
      return
    }

    const labor: ServiceLabor = {
      id: Math.random().toString(36).substr(2, 9),
      description: newLabor.description || '',
      hours: newLabor.hours || 1,
      rate: newLabor.rate || 85,
      total: newLabor.total || 85
    }

    setFormData(prev => ({
      ...prev,
      labor: [...(prev.labor || []), labor]
    }))

    setNewLabor({
      description: '',
      hours: 1,
      rate: 85,
      total: 85
    })
    setShowAddLabor(false)
  }

  const removeLabor = (laborId: string) => {
    setFormData(prev => ({
      ...prev,
      labor: prev.labor?.filter(l => l.id !== laborId) || []
    }))
  }

  const calculateTotals = () => {
    const partsTotal = formData.parts?.reduce((sum, part) => sum + part.total, 0) || 0
    const laborTotal = formData.labor?.reduce((sum, labor) => sum + labor.total, 0) || 0
    return {
      partsTotal,
      laborTotal,
      grandTotal: partsTotal + laborTotal
    }
  }

  const totals = calculateTotals()

  // List of technicians (in a real app, this would come from a database)
  const technicians = [
    { id: 'Tech-001', name: 'John Smith' },
    { id: 'Tech-002', name: 'Sarah Johnson' },
    { id: 'Tech-003', name: 'Mike Davis' }
  ]

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
              <h3 className="text-lg font-semibold">Ticket Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={handleCustomerSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start" 
                          onClick={() => handleCustomerSelect('add-new')}
                        >
                          <Plus className="h-3.5 w-3.5 mr-2" />
                          Add New Customer
                        </Button>
                      </div>
                      <div className="px-2 py-1 border-t"></div>
                      {leads.map(lead => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.firstName} {lead.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="vehicleId">Vehicle</Label>
                  <Select 
                    value={formData.vehicleId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Vehicle</SelectItem>
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
                <Label htmlFor="title">Service Title *</Label>
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
                  <Label htmlFor="assignedTo">Assigned Technician</Label>
                  <Select 
                    value={formData.assignedTo} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {technicians.map(tech => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
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
                  <Label htmlFor="estimatedCompletionDate">Estimated Completion</Label>
                  <Input
                    id="estimatedCompletionDate"
                    type="date"
                    value={formData.customFields?.estimatedCompletionDate || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      customFields: {
                        ...prev.customFields,
                        estimatedCompletionDate: e.target.value
                      }
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Warranty Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Warranty Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="warrantyStatus">Warranty Status</Label>
                  <Select 
                    value={formData.customFields?.warrantyStatus || 'not_covered'} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      customFields: {
                        ...prev.customFields,
                        warrantyStatus: value
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="covered">Covered by Warranty</SelectItem>
                      <SelectItem value="partial">Partially Covered</SelectItem>
                      <SelectItem value="not_covered">Not Covered</SelectItem>
                      <SelectItem value="extended">Extended Warranty</SelectItem>
                      <SelectItem value="expired">Warranty Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="customerAuthorization"
                    checked={formData.customFields?.customerAuthorization || false}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      customFields: {
                        ...prev.customFields,
                        customerAuthorization: !!checked
                      }
                    }))}
                  />
                  <Label htmlFor="customerAuthorization">Customer has authorized work</Label>
                </div>
              </div>
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
                        <Label htmlFor="partNumber">Part Number *</Label>
                        <Input
                          id="partNumber"
                          value={newPart.partNumber}
                          onChange={(e) => setNewPart(prev => ({ ...prev, partNumber: e.target.value }))}
                          placeholder="e.g., AC-COMP-001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="partDescription">Description *</Label>
                        <Input
                          id="partDescription"
                          value={newPart.description}
                          onChange={(e) => setNewPart(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="e.g., AC Compressor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="partQuantity">Quantity</Label>
                        <Input
                          id="partQuantity"
                          type="number"
                          min="1"
                          value={newPart.quantity}
                          onChange={(e) => setNewPart(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="partUnitCost">Unit Cost</Label>
                        <Input
                          id="partUnitCost"
                          type="number"
                          step="0.01"
                          min="0"
                          value={newPart.unitCost}
                          onChange={(e) => setNewPart(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <span className="text-sm font-medium">Total: </span>
                        <span className="font-bold">{formatCurrency(newPart.total || 0)}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowAddPart(false)}>
                          Cancel
                        </Button>
                        <Button type="button" onClick={addPart}>
                          Add Part
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Parts List */}
              <div className="space-y-3">
                {formData.parts && formData.parts.length > 0 ? (
                  formData.parts.map((part) => (
                    <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{part.description}</span>
                          <Badge variant="outline">
                            {part.partNumber}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {part.quantity} × {formatCurrency(part.unitCost)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold">{formatCurrency(part.total)}</span>
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
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No parts added yet</p>
                    <p className="text-sm">Add parts needed for this service</p>
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
                      <div className="md:col-span-3">
                        <Label htmlFor="laborDescription">Description *</Label>
                        <Input
                          id="laborDescription"
                          value={newLabor.description}
                          onChange={(e) => setNewLabor(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="e.g., Diagnostic and Repair"
                        />
                      </div>
                      <div>
                        <Label htmlFor="laborHours">Hours</Label>
                        <Input
                          id="laborHours"
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={newLabor.hours}
                          onChange={(e) => setNewLabor(prev => ({ ...prev, hours: parseFloat(e.target.value) || 1 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="laborRate">Hourly Rate</Label>
                        <Input
                          id="laborRate"
                          type="number"
                          step="0.01"
                          min="0"
                          value={newLabor.rate}
                          onChange={(e) => setNewLabor(prev => ({ ...prev, rate: parseFloat(e.target.value) || 85 }))}
                        />
                      </div>
                      <div>
                        <Label>Total</Label>
                        <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted/50 flex items-center">
                          {formatCurrency(newLabor.total || 0)}
                        </div>
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
                {formData.labor && formData.labor.length > 0 ? (
                  formData.labor.map((labor) => (
                    <div key={labor.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{labor.description}</div>
                        <p className="text-sm text-muted-foreground">
                          {labor.hours} hours × {formatCurrency(labor.rate)}/hr
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold">{formatCurrency(labor.total)}</span>
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
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No labor added yet</p>
                    <p className="text-sm">Add labor for this service</p>
                  </div>
                )}
              </div>
            </div>

            {/* Totals */}
            {(formData.parts?.length > 0 || formData.labor?.length > 0) && (
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Parts Total:</span>
                      <span>{formatCurrency(totals.partsTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor Total:</span>
                      <span>{formatCurrency(totals.laborTotal)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Grand Total:</span>
                      <span>{formatCurrency(totals.grandTotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div>
                <Label htmlFor="technicianNotes">Technician Notes</Label>
                <Textarea
                  id="technicianNotes"
                  value={formData.customFields?.technicianNotes || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    customFields: {
                      ...prev.customFields,
                      technicianNotes: e.target.value
                    }
                  }))}
                  placeholder="Notes for technicians only (not visible to customer)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes">Customer Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes visible to the customer"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="customerPortalAccess"
                  checked={formData.customFields?.customerPortalAccess !== false}
                  onCheckedChange={(checked) => setFormData(prev => ({ 
                    ...prev, 
                    customFields: {
                      ...prev.customFields,
                      customerPortalAccess: !!checked
                    }
                  }))}
                />
                <Label htmlFor="customerPortalAccess">Allow customer to view this ticket in portal</Label>
              </div>
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