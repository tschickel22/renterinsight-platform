import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  X, 
  Edit, 
  Wrench, 
  DollarSign, 
  Calendar, 
  User, 
  Clock, 
  FileText, 
  MessageSquare, 
  Download,
  Printer,
  ShieldCheck,
  Timer,
  CheckCircle
} from 'lucide-react'
import { ServiceTicket, ServiceStatus, Priority } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { ServiceStage, WarrantyInfo, WarrantyType, WarrantyClaimStatus } from '../types'
import { ServiceWorkflowTimeline } from './ServiceWorkflowTimeline'
import { ServiceNotes } from './ServiceNotes'
import { ServiceDocuments } from './ServiceDocuments'
import { ServiceTimeLogs } from './ServiceTimeLogs'
import { WarrantyDetails } from './WarrantyDetails'

interface ServiceTicketDetailProps {
  ticket: ServiceTicket
  onClose: () => void
  onEdit: (ticket: ServiceTicket) => void
  onGeneratePDF: (ticketId: string) => void
  onShareWithCustomer: (ticketId: string) => void
}

export function ServiceTicketDetail({ 
  ticket, 
  onClose, 
  onEdit, 
  onGeneratePDF,
  onShareWithCustomer
}: ServiceTicketDetailProps) {
  const [activeTab, setActiveTab] = useState('details')

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

  // Mock warranty info for demo
  const warrantyInfo: WarrantyInfo = {
    id: '1',
    ticketId: ticket.id,
    warrantyType: WarrantyType.MANUFACTURER,
    warrantyProvider: 'Forest River',
    contractNumber: 'WC-12345',
    coverageStartDate: new Date('2023-01-01'),
    coverageEndDate: new Date('2026-01-01'),
    isActive: true,
    deductible: 100,
    coverageDetails: 'Full coverage for all mechanical and structural components',
    claimNumber: 'CLM-98765',
    claimStatus: WarrantyClaimStatus.APPROVED,
    claimSubmittedDate: new Date('2024-01-16'),
    claimApprovedDate: new Date('2024-01-18'),
    approvedAmount: 450,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-18')
  }

  // Mock workflow stages for demo
  const workflowStages = [
    { 
      stage: ServiceStage.INTAKE, 
      startedAt: new Date('2024-01-15T09:00:00'), 
      completedAt: new Date('2024-01-15T10:30:00'),
      assignedTo: 'Service Advisor'
    },
    { 
      stage: ServiceStage.DIAGNOSIS, 
      startedAt: new Date('2024-01-15T10:30:00'), 
      completedAt: new Date('2024-01-15T14:00:00'),
      assignedTo: 'Tech-001'
    },
    { 
      stage: ServiceStage.ESTIMATE_APPROVAL, 
      startedAt: new Date('2024-01-15T14:00:00'), 
      completedAt: new Date('2024-01-16T09:30:00'),
      assignedTo: 'Service Advisor'
    },
    { 
      stage: ServiceStage.PARTS_ORDERING, 
      startedAt: new Date('2024-01-16T09:30:00'), 
      completedAt: new Date('2024-01-18T11:00:00'),
      assignedTo: 'Parts Dept'
    },
    { 
      stage: ServiceStage.REPAIR, 
      startedAt: new Date('2024-01-18T11:00:00'), 
      completedAt: ticket.status === ServiceStatus.COMPLETED ? new Date('2024-01-20T15:00:00') : undefined,
      assignedTo: 'Tech-001'
    }
  ]

  // Mock service notes
  const serviceNotes = [
    {
      id: '1',
      ticketId: ticket.id,
      userId: 'user-001',
      userName: 'Service Advisor',
      content: 'Initial inspection completed. Found issues with AC compressor.',
      isCustomerVisible: true,
      createdAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: '2',
      ticketId: ticket.id,
      userId: 'user-002',
      userName: 'Technician',
      content: 'Diagnosed AC system. Compressor needs replacement. Submitted warranty claim.',
      isCustomerVisible: true,
      createdAt: new Date('2024-01-15T14:00:00')
    },
    {
      id: '3',
      ticketId: ticket.id,
      userId: 'user-001',
      userName: 'Service Advisor',
      content: 'Customer approved repair. Ordering parts.',
      isCustomerVisible: true,
      createdAt: new Date('2024-01-16T09:30:00')
    },
    {
      id: '4',
      ticketId: ticket.id,
      userId: 'user-003',
      userName: 'Parts Department',
      content: 'Parts arrived. Ready for repair.',
      isCustomerVisible: false,
      createdAt: new Date('2024-01-18T11:00:00')
    }
  ]

  // Mock documents
  const documents = [
    {
      id: '1',
      ticketId: ticket.id,
      name: 'Initial Diagnosis Report.pdf',
      type: 'application/pdf',
      url: '/documents/diagnosis.pdf',
      size: 245760,
      isCustomerVisible: true,
      uploadedBy: 'Tech-001',
      uploadedAt: new Date('2024-01-15T14:00:00')
    },
    {
      id: '2',
      ticketId: ticket.id,
      name: 'Warranty Claim Form.pdf',
      type: 'application/pdf',
      url: '/documents/warranty-claim.pdf',
      size: 189440,
      isCustomerVisible: false,
      uploadedBy: 'Service Advisor',
      uploadedAt: new Date('2024-01-16T09:30:00')
    },
    {
      id: '3',
      ticketId: ticket.id,
      name: 'Parts Invoice.pdf',
      type: 'application/pdf',
      url: '/documents/parts-invoice.pdf',
      size: 156672,
      isCustomerVisible: false,
      uploadedBy: 'Parts Dept',
      uploadedAt: new Date('2024-01-18T11:00:00')
    }
  ]

  // Mock time logs
  const timeLogs = [
    {
      id: '1',
      ticketId: ticket.id,
      technicianId: 'Tech-001',
      technicianName: 'John Smith',
      startTime: new Date('2024-01-15T10:30:00'),
      endTime: new Date('2024-01-15T12:30:00'),
      duration: 2,
      description: 'Initial diagnosis',
      billable: true,
      createdAt: new Date('2024-01-15T12:30:00')
    },
    {
      id: '2',
      ticketId: ticket.id,
      technicianId: 'Tech-001',
      technicianName: 'John Smith',
      startTime: new Date('2024-01-18T13:00:00'),
      endTime: new Date('2024-01-18T16:00:00'),
      duration: 3,
      description: 'AC compressor replacement',
      billable: true,
      createdAt: new Date('2024-01-18T16:00:00')
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{ticket.title}</CardTitle>
              <CardDescription>
                Service Ticket #{ticket.id}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => onEdit(ticket)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Ticket
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ticket Header */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("ri-badge-status", getStatusColor(ticket.status))}>
              {ticket.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge className={cn("ri-badge-status", getPriorityColor(ticket.priority))}>
              {ticket.priority.toUpperCase()} PRIORITY
            </Badge>
            {warrantyInfo.isActive && (
              <Badge className="bg-green-50 text-green-700 border-green-200">
                <ShieldCheck className="h-3 w-3 mr-1" />
                WARRANTY COVERED
              </Badge>
            )}
            <div className="ml-auto font-bold text-lg text-primary">
              {formatCurrency(
                ticket.parts.reduce((sum, p) => sum + p.total, 0) + 
                ticket.labor.reduce((sum, l) => sum + l.total, 0)
              )}
            </div>
          </div>

          {/* Ticket Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="warranty">Warranty</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Basic Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer</label>
                  <p className="font-medium">{ticket.customerId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vehicle</label>
                  <p className="font-medium">{ticket.vehicleId || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                  <p className="font-medium">{ticket.assignedTo || 'Unassigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Scheduled Date</label>
                  <p className="font-medium">{ticket.scheduledDate ? formatDate(ticket.scheduledDate) : 'Not scheduled'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="font-medium">{formatDate(ticket.createdAt)}</p>
                </div>
                {ticket.completedDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Completed</label>
                    <p className="font-medium">{formatDate(ticket.completedDate)}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <div className="mt-1 p-3 bg-muted/30 rounded-md">
                  <p className="whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>

              {/* Notes */}
              {ticket.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <div className="mt-1 p-3 bg-muted/30 rounded-md">
                    <p className="whitespace-pre-wrap">{ticket.notes}</p>
                  </div>
                </div>
              )}

              {/* Parts and Labor */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Parts & Labor</h3>
                
                {/* Parts */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Parts</h4>
                  {ticket.parts.length > 0 ? (
                    <div className="space-y-2">
                      {ticket.parts.map((part) => (
                        <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{part.description}</div>
                            <div className="text-sm text-muted-foreground">
                              Part #: {part.partNumber} • Quantity: {part.quantity}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(part.total)}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(part.unitCost)} each
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground p-3 border rounded-lg border-dashed">
                      No parts added to this service ticket
                    </div>
                  )}
                </div>
                
                {/* Labor */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Labor</h4>
                  {ticket.labor.length > 0 ? (
                    <div className="space-y-2">
                      {ticket.labor.map((labor) => (
                        <div key={labor.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{labor.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {labor.hours} hours @ {formatCurrency(labor.rate)}/hr
                            </div>
                          </div>
                          <div className="text-right font-medium">
                            {formatCurrency(labor.total)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground p-3 border rounded-lg border-dashed">
                      No labor charges added to this service ticket
                    </div>
                  )}
                </div>
                
                {/* Total */}
                <div className="flex justify-end p-3 bg-muted/30 rounded-lg">
                  <div className="text-right">
                    <div className="flex justify-between items-center mb-1 w-48">
                      <span className="text-sm">Parts:</span>
                      <span className="font-medium">{formatCurrency(ticket.parts.reduce((sum, p) => sum + p.total, 0))}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1 w-48">
                      <span className="text-sm">Labor:</span>
                      <span className="font-medium">{formatCurrency(ticket.labor.reduce((sum, l) => sum + l.total, 0))}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t w-48">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-primary">{formatCurrency(
                        ticket.parts.reduce((sum, p) => sum + p.total, 0) + 
                        ticket.labor.reduce((sum, l) => sum + l.total, 0)
                      )}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-4">
              <ServiceWorkflowTimeline stages={workflowStages} />
              <ServiceTimeLogs timeLogs={timeLogs} />
            </TabsContent>

            <TabsContent value="warranty" className="space-y-4">
              <WarrantyDetails warranty={warrantyInfo} />
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <ServiceNotes notes={serviceNotes} ticketId={ticket.id} />
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <ServiceDocuments documents={documents} ticketId={ticket.id} />
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" onClick={() => onShareWithCustomer(ticket.id)}>
              <User className="h-4 w-4 mr-2" />
              Share with Customer
            </Button>
            <Button variant="outline" onClick={() => onGeneratePDF(ticket.id)}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => onEdit(ticket)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}