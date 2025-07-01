import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Wrench, Calendar, Clock, Download, Printer } from 'lucide-react'
import { ServiceTicket, ServiceStatus, Priority } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

interface CustomerPortalViewProps {
  ticket: ServiceTicket
  onClose: () => void
}

export function CustomerPortalView({ ticket, onClose }: CustomerPortalViewProps) {
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

  const calculateTotals = () => {
    const partsTotal = ticket.parts.reduce((sum, part) => sum + part.total, 0)
    const laborTotal = ticket.labor.reduce((sum, labor) => sum + labor.total, 0)
    return {
      partsTotal,
      laborTotal,
      grandTotal: partsTotal + laborTotal
    }
  }

  const totals = calculateTotals()

  const handlePrintPDF = () => {
    try {
      const doc = new jsPDF()
      
      // Add header
      doc.setFontSize(20)
      doc.text('Service Ticket', 105, 15, { align: 'center' })
      
      doc.setFontSize(12)
      doc.text(`Ticket #: ${ticket.id}`, 20, 30)
      doc.text(`Date: ${formatDate(ticket.createdAt)}`, 20, 40)
      doc.text(`Status: ${ticket.status.replace('_', ' ')}`, 20, 50)
      
      // Add service details
      doc.setFontSize(16)
      doc.text('Service Details', 20, 65)
      
      doc.setFontSize(12)
      doc.text(`Title: ${ticket.title}`, 20, 75)
      
      // Description (with word wrap)
      const splitDescription = doc.splitTextToSize(ticket.description, 170)
      doc.text(splitDescription, 20, 85)
      
      // Parts table
      if (ticket.parts.length > 0) {
        doc.setFontSize(16)
        doc.text('Parts', 20, 110)
        
        // @ts-ignore
        doc.autoTable({
          startY: 115,
          head: [['Description', 'Quantity', 'Unit Cost', 'Total']],
          body: ticket.parts.map(part => [
            part.description,
            part.quantity,
            formatCurrency(part.unitCost),
            formatCurrency(part.total)
          ]),
          foot: [['', '', 'Parts Total:', formatCurrency(totals.partsTotal)]],
        })
      }
      
      // Labor table
      if (ticket.labor.length > 0) {
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY || 115
        
        doc.setFontSize(16)
        doc.text('Labor', 20, finalY + 15)
        
        // @ts-ignore
        doc.autoTable({
          startY: finalY + 20,
          head: [['Description', 'Hours', 'Rate', 'Total']],
          body: ticket.labor.map(labor => [
            labor.description,
            labor.hours,
            formatCurrency(labor.rate),
            formatCurrency(labor.total)
          ]),
          foot: [['', '', 'Labor Total:', formatCurrency(totals.laborTotal)]],
        })
      }
      
      // Grand total
      // @ts-ignore
      const finalY = doc.lastAutoTable.finalY || 115
      doc.setFontSize(14)
      doc.text(`Grand Total: ${formatCurrency(totals.grandTotal)}`, 150, finalY + 20, { align: 'right' })
      
      // Notes
      if (ticket.notes) {
        doc.setFontSize(16)
        doc.text('Notes', 20, finalY + 35)
        
        doc.setFontSize(12)
        const splitNotes = doc.splitTextToSize(ticket.notes, 170)
        doc.text(splitNotes, 20, finalY + 45)
      }
      
      // Save the PDF
      doc.save(`service-ticket-${ticket.id}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Service Ticket</CardTitle>
              <CardDescription>
                Ticket #{ticket.id}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Customer Portal Banner */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-700">Customer Portal View</h3>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                This is how your service ticket appears in the customer portal
              </p>
            </div>

            {/* Ticket Header */}
            <div>
              <h2 className="text-2xl font-bold">{ticket.title}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge className={cn("ri-badge-status", getStatusColor(ticket.status))}>
                  {ticket.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge className={cn("ri-badge-status", getPriorityColor(ticket.priority))}>
                  {ticket.priority.toUpperCase()} PRIORITY
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="details" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="parts-labor">Parts & Labor</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{ticket.description}</p>
                  </CardContent>
                </Card>

                {/* Schedule Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Schedule Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                        <p className="font-medium">{formatDate(ticket.createdAt)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Scheduled Date</label>
                        <p className="font-medium">{ticket.scheduledDate ? formatDate(ticket.scheduledDate) : 'Not scheduled'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Estimated Completion</label>
                        <p className="font-medium">{ticket.customFields?.estimatedCompletionDate || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Completed Date</label>
                        <p className="font-medium">{ticket.completedDate ? formatDate(ticket.completedDate) : 'Not completed'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {ticket.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{ticket.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="parts-labor" className="space-y-6">
                {/* Parts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Parts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ticket.parts.length > 0 ? (
                      <div className="space-y-3">
                        {ticket.parts.map((part) => (
                          <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{part.description}</div>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {part.quantity} × {formatCurrency(part.unitCost)}
                              </p>
                            </div>
                            <div className="font-bold">
                              {formatCurrency(part.total)}
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-end p-2">
                          <span className="font-medium">Parts Total: {formatCurrency(totals.partsTotal)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>No parts added to this service ticket</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Labor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Labor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ticket.labor.length > 0 ? (
                      <div className="space-y-3">
                        {ticket.labor.map((labor) => (
                          <div key={labor.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{labor.description}</div>
                              <p className="text-sm text-muted-foreground">
                                {labor.hours} hours × {formatCurrency(labor.rate)}/hr
                              </p>
                            </div>
                            <div className="font-bold">
                              {formatCurrency(labor.total)}
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-end p-2">
                          <span className="font-medium">Labor Total: {formatCurrency(totals.laborTotal)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>No labor added to this service ticket</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Totals */}
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
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative pl-6 pb-6 border-l-2 border-muted">
                        <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                        <div className="font-medium">Ticket Created</div>
                        <div className="text-sm text-muted-foreground">{formatDate(ticket.createdAt)}</div>
                      </div>
                      
                      {ticket.status !== ServiceStatus.OPEN && (
                        <div className="relative pl-6 pb-6 border-l-2 border-muted">
                          <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-yellow-500"></div>
                          <div className="font-medium">Work Started</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(ticket.createdAt.getTime() + 86400000).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      
                      {ticket.status === ServiceStatus.WAITING_PARTS && (
                        <div className="relative pl-6 pb-6 border-l-2 border-muted">
                          <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-orange-500"></div>
                          <div className="font-medium">Waiting for Parts</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(ticket.createdAt.getTime() + 172800000).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      
                      {ticket.status === ServiceStatus.COMPLETED && (
                        <div className="relative pl-6">
                          <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                          <div className="font-medium">Service Completed</div>
                          <div className="text-sm text-muted-foreground">
                            {ticket.completedDate ? formatDate(ticket.completedDate) : 'Date not recorded'}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="outline" onClick={handlePrintPDF}>
                <Printer className="h-4 w-4 mr-2" />
                Print PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}