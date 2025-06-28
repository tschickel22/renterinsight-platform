import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Wrench, Plus, Clock, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { ServiceTicket, ServiceStatus, Priority } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface ServiceRequestListProps {
  customerId: string
}

export function ServiceRequestList({ customerId }: ServiceRequestListProps) {
  const { toast } = useToast()
  const [tickets, setTickets] = useState<ServiceTicket[]>([])
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null)
  const [showTicketDetail, setShowTicketDetail] = useState(false)
  
  // Form state for new service request
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: Priority.MEDIUM
  })

  // Fetch service tickets on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    // For this demo, we'll use mock data
    const mockTickets: ServiceTicket[] = [
      {
        id: 'S-001',
        customerId: customerId,
        vehicleId: 'veh-1',
        title: 'Annual Maintenance Service',
        description: 'Regular annual maintenance including oil change, filter replacement, and system checks',
        priority: Priority.MEDIUM,
        status: ServiceStatus.IN_PROGRESS,
        assignedTo: 'Tech-001',
        scheduledDate: new Date('2024-01-20'),
        parts: [
          {
            id: '1',
            partNumber: 'OIL-001',
            description: 'Engine Oil Filter',
            quantity: 1,
            unitCost: 25.99,
            total: 25.99
          }
        ],
        labor: [
          {
            id: '1',
            description: 'Annual Maintenance',
            hours: 3,
            rate: 85,
            total: 255
          }
        ],
        notes: 'Technician will contact you when service is complete',
        customFields: {
          estimatedCompletionDate: '2024-01-22',
          customerPortalAccess: true
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-18')
      }
    ]
    
    setTickets(mockTickets)
  }, [customerId])

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.OPEN:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case ServiceStatus.IN_PROGRESS:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case ServiceStatus.WAITING_PARTS:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case ServiceStatus.COMPLETED:
        return 'bg-green-50 text-green-700 border-green-200'
      case ServiceStatus.CANCELLED:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW:
        return 'bg-green-50 text-green-700 border-green-200'
      case Priority.MEDIUM:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case Priority.HIGH:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case Priority.URGENT:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleViewTicket = (ticket: ServiceTicket) => {
    setSelectedTicket(ticket)
    setShowTicketDetail(true)
  }

  const handleSubmitRequest = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }
    
    // In a real app, this would be an API call
    // For this demo, we'll just add it to the local state
    const newTicket: ServiceTicket = {
      id: `S-00${tickets.length + 1}`,
      customerId: customerId,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: ServiceStatus.OPEN,
      parts: [],
      labor: [],
      notes: '',
      customFields: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setTickets([...tickets, newTicket])
    setShowNewRequestForm(false)
    setFormData({
      title: '',
      description: '',
      priority: Priority.MEDIUM
    })
    
    toast({
      title: 'Service Request Submitted',
      description: 'Your service request has been submitted successfully.',
    })
  }

  return (
    <div className="space-y-6">
      {/* Service Ticket Detail Modal */}
      {showTicketDetail && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedTicket.title}</CardTitle>
                  <CardDescription>
                    Service Ticket #{selectedTicket.id}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={cn("ri-badge-status", getStatusColor(selectedTicket.status))}>
                    {selectedTicket.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => setShowTicketDetail(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <div className="mt-1 p-3 bg-muted/30 rounded-md">
                  <p className="whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Schedule Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                  <p className="font-medium">{formatDate(selectedTicket.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Scheduled Date</label>
                  <p className="font-medium">{selectedTicket.scheduledDate ? formatDate(selectedTicket.scheduledDate) : 'Not scheduled'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estimated Completion</label>
                  <p className="font-medium">{selectedTicket.customFields?.estimatedCompletionDate || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <div className="mt-1">
                    <Badge className={cn("ri-badge-status", getPriorityColor(selectedTicket.priority))}>
                      {selectedTicket.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Service Timeline */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Service Timeline</h3>
                <div className="space-y-4">
                  <div className="relative pl-6 pb-6 border-l-2 border-muted">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                    <div className="font-medium">Ticket Created</div>
                    <div className="text-sm text-muted-foreground">{formatDate(selectedTicket.createdAt)}</div>
                  </div>
                  
                  {selectedTicket.status !== ServiceStatus.OPEN && (
                    <div className="relative pl-6 pb-6 border-l-2 border-muted">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-yellow-500"></div>
                      <div className="font-medium">Work Started</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(selectedTicket.createdAt.getTime() + 86400000).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  
                  {selectedTicket.status === ServiceStatus.WAITING_PARTS && (
                    <div className="relative pl-6 pb-6 border-l-2 border-muted">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-orange-500"></div>
                      <div className="font-medium">Waiting for Parts</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(selectedTicket.createdAt.getTime() + 172800000).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  
                  {selectedTicket.status === ServiceStatus.COMPLETED && (
                    <div className="relative pl-6">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                      <div className="font-medium">Service Completed</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedTicket.completedDate ? formatDate(selectedTicket.completedDate) : 'Date not recorded'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedTicket.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <div className="mt-1 p-3 bg-muted/30 rounded-md">
                    <p className="whitespace-pre-wrap">{selectedTicket.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setShowTicketDetail(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Service Request Form */}
      {showNewRequestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>New Service Request</CardTitle>
                  <CardDescription>
                    Submit a new service or repair request
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowNewRequestForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., AC Repair, Annual Maintenance"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Please describe the issue or service needed"
                    rows={4}
                  />
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
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setShowNewRequestForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitRequest}>
                    Submit Request
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Service Requests</h2>
        <Button onClick={() => setShowNewRequestForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Service Request
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-primary" />
            Your Service Tickets
          </CardTitle>
          <CardDescription>
            View and track your service and repair requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{ticket.title}</h3>
                      <Badge className={cn("ri-badge-status", getStatusColor(ticket.status))}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={cn("ri-badge-status", getPriorityColor(ticket.priority))}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Created:</span> {formatDate(ticket.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Scheduled:</span> {ticket.scheduledDate ? formatDate(ticket.scheduledDate) : 'Not scheduled'}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket)}>
                    View Details
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No service requests found</p>
                <p className="text-sm">Create a new service request to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}