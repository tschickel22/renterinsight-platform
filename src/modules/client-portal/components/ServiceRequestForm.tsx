import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Wrench, Calendar, CheckCircle } from 'lucide-react'
import { ServiceTicket, Priority, Vehicle } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface ServiceRequestFormProps {
  customerId: string
  vehicles: Vehicle[]
  onSubmitRequest: (ticketData: Partial<ServiceTicket>) => Promise<void>
}

export function ServiceRequestForm({ customerId, vehicles, onSubmitRequest }: ServiceRequestFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<Partial<ServiceTicket>>({
    customerId,
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    scheduledDate: undefined,
    notes: '',
    customFields: {
      customerPortalAccess: true
    }
  })

  const customerVehicles = vehicles.filter(vehicle => 
    // In a real app, this would filter based on a relationship between customers and vehicles
    // For now, we'll just return all vehicles
    true
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSubmitRequest(formData)
      toast({
        title: 'Service Request Submitted',
        description: 'Your service request has been submitted successfully.',
      })
      setSubmitted(true)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit service request. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Service Request Submitted</h3>
          <p className="text-muted-foreground text-center mb-6">
            Your service request has been submitted successfully. Our team will review it and get back to you soon.
          </p>
          <Button onClick={() => setSubmitted(false)}>Submit Another Request</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Request Service</h2>
        <p className="text-muted-foreground">
          Submit a service request for your Home/RV
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-primary" />
            Service Request Form
          </CardTitle>
          <CardDescription>
            Please provide details about the service you need
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Annual Maintenance Service"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Please describe the service needed in detail"
                rows={4}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="vehicleId">Home/RV</Label>
                <Select 
                  value={formData.vehicleId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Home/RV (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Home/RV Selected</SelectItem>
                    {customerVehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
            </div>

            <div>
              <Label htmlFor="scheduledDate">Preferred Service Date</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate ? new Date(formData.scheduledDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    scheduledDate: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  min={new Date().toISOString().split('T')[0]} // Can't select dates in the past
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional information that might help us with your service request"
                rows={3}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Service Request'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}