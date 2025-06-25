import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Wrench, 
  Clock, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Download, 
  ShieldCheck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { ServiceTicket, ServiceStatus, Priority } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { ServiceStage } from '../types'
import { ServiceWorkflowTimeline } from './ServiceWorkflowTimeline'
import { useToast } from '@/hooks/use-toast'

interface CustomerPortalViewProps {
  ticket: ServiceTicket
  onClose: () => void
  onDownloadPDF: (ticketId: string) => void
  onSubmitFeedback: (ticketId: string, feedback: string, rating: number) => void
}

export function CustomerPortalView({ 
  ticket, 
  onClose, 
  onDownloadPDF,
  onSubmitFeedback
}: CustomerPortalViewProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('details')
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState(0)

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
      assignedTo: 'Technician'
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
      assignedTo: 'Technician'
    }
  ]

  // Filter notes to only show customer-visible ones
  const customerVisibleNotes = [
    {
      id: '1',
      content: 'Initial inspection completed. Found issues with AC compressor.',
      createdAt: new Date('2024-01-15T10:30:00'),
      createdBy: 'Service Advisor'
    },
    {
      id: '2',
      content: 'Diagnosed AC system. Compressor needs replacement. Submitted warranty claim.',
      createdAt: new Date('2024-01-15T14:00:00'),
      createdBy: 'Technician'
    },
    {
      id: '3',
      content: 'Customer approved repair. Ordering parts.',
      createdAt: new Date('2024-01-16T09:30:00'),
      createdBy: 'Service Advisor'
    }
  ]

  // Filter documents to only show customer-visible ones
  const customerVisibleDocuments = [
    {
      id: '1',
      name: 'Initial Diagnosis Report.pdf',
      type: 'application/pdf',
      url: '/documents/diagnosis.pdf',
      size: 245760,
      uploadedAt: new Date('2024-01-15T14:00:00')
    }
  ]

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      toast({
        title: 'Error',
        description: 'Please select a rating',
        variant: 'destructive'
      })
      return
    }

    onSubmitFeedback(ticket.id, feedback, rating)
    toast({
      title: 'Feedback Submitted',
      description: 'Thank you for your feedback!',
    })
    setFeedback('')
    setRating(0)
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{ticket.title}</CardTitle>
              <CardDescription>
                Service Ticket #{ticket.id}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={cn("ri-badge-status", getStatusColor(ticket.status))}>
                {ticket.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className={cn("ri-badge-status", getPriorityColor(ticket.priority))}>
                {ticket.priority.toUpperCase()} PRIORITY
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Basic Details */}
              <div className="grid gap-4 md:grid-cols-2">
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
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estimated Completion</label>
                  <p className="font-medium">{formatDate(new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000))}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <div className="mt-1 p-3 bg-muted/30 rounded-md">
                  <p className="whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>

              {/* Warranty Info */}
              {ticket.customFields?.isWarrantyCovered && (
                <div className="p-3 bg-green-50 rounded-lg flex items-start space-x-3">
                  <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Warranty Coverage</p>
                    <p className="text-sm text-green-700 mt-1">
                      This service is covered under your {ticket.customFields?.warrantyType?.replace('_', ' ')} warranty.
                    </p>
                  </div>
                </div>
              )}

              {/* Parts and Labor Summary */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold">Parts & Labor Summary</h3>
                
                <div className="space-y-2">
                  {ticket.parts.map((part) => (
                    <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{part.description}</div>
                        <div className="text-sm text-muted-foreground">
                          Quantity: {part.quantity}
                        </div>
                      </div>
                      <div className="text-right font-medium">
                        {formatCurrency(part.total)}
                      </div>
                    </div>
                  ))}
                  
                  {ticket.labor.map((labor) => (
                    <div key={labor.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{labor.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {labor.hours} hours
                        </div>
                      </div>
                      <div className="text-right font-medium">
                        {formatCurrency(labor.total)}
                      </div>
                    </div>
                  ))}
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

            <TabsContent value="status" className="space-y-4">
              <ServiceWorkflowTimeline stages={workflowStages} />
              
              {ticket.status === ServiceStatus.COMPLETED && (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Service Completed</p>
                      <p className="text-sm text-green-700 mt-1">
                        Your service has been completed. Please provide your feedback below.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 p-4 border rounded-lg">
                    <h3 className="font-medium">Service Feedback</h3>
                    <div>
                      <label className="text-sm font-medium">Rating</label>
                      <div className="flex items-center space-x-2 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={cn(
                              "text-2xl",
                              rating >= star ? "text-yellow-500" : "text-gray-300"
                            )}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Comments</label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Please share your experience with our service..."
                        className="w-full p-2 border rounded-md mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSubmitFeedback}>
                        Submit Feedback
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {ticket.status === ServiceStatus.WAITING_PARTS && (
                <div className="p-3 bg-yellow-50 rounded-lg flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Waiting for Parts</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      We're currently waiting for parts to arrive. We'll update you when they're in and we can continue with your service.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="updates" className="space-y-4">
              <div className="space-y-4">
                {customerVisibleNotes.length > 0 ? (
                  customerVisibleNotes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="font-medium">{note.createdBy}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No updates available</p>
                    <p className="text-sm">Check back later for updates on your service</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="space-y-4">
                {customerVisibleDocuments.length > 0 ? (
                  customerVisibleDocuments.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <div className="font-medium">{document.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Uploaded on {formatDate(document.uploadedAt)}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No documents available</p>
                    <p className="text-sm">Any shared documents will appear here</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" onClick={() => onDownloadPDF(ticket.id)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}