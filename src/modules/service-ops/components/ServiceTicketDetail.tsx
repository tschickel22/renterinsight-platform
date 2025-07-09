// src/modules/service-ops/components/ServiceTicketDetail.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Edit, Wrench, DollarSign, Calendar, Clock, User, Printer, Download, FileText } from 'lucide-react'
import { ServiceTicket, ServiceStatus, Priority } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { useTenant } from '@/contexts/TenantContext' // Import useTenant

interface ServiceTicketDetailProps {
  ticket: ServiceTicket
  onClose: () => void
  onEdit: (ticket: ServiceTicket) => void
}

export function ServiceTicketDetail({ ticket, onClose, onEdit }: ServiceTicketDetailProps) {
  const { toast } = useToast()
  const { tenant } = useTenant() // Use useTenant hook
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

  const getWarrantyStatusLabel = (status: string) => {
    switch (status) {
      case 'covered':
        return 'Covered by Warranty'
      case 'partial':
        return 'Partially Covered'
      case 'not_covered':
        return 'Not Covered'
      case 'extended':
        return 'Extended Warranty'
      case 'expired':
        return 'Warranty Expired'
      default:
        return 'Unknown'
    }
  }

  const getWarrantyStatusColor = (status: string) => {
    switch (status) {
      case 'covered':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'partial':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'not_covered':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'extended':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'expired':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const calculateTotals = () => {
    const partsTotal = Array.isArray(ticket.parts) ? ticket.parts.reduce((sum, part) => sum + (part.total || 0), 0) : 0
    const laborTotal = Array.isArray(ticket.labor) ? ticket.labor.reduce((sum, labor) => sum + (labor.total || 0), 0) : 0
    return {
      partsTotal,
      laborTotal,
      grandTotal: partsTotal + laborTotal
    }
  }

  const totals = calculateTotals()

  const handlePrintPDF = () => {
    try {
      const doc = new jsPDF();
      let currentY = 10; // Initial Y position

      // Function to add header (logo and company name)
      const addHeader = (callback: () => void) => {
        const logoUrl = tenant?.branding?.logo;
        const companyName = tenant?.name;
        const logoWidth = 30;
        const logoHeight = 15;
        const logoX = 10;
        const logoY = 10;
        const textX = logoX + logoWidth + 5; // Space after logo

        if (logoUrl) {
          const img = new Image();
          img.src = logoUrl;
          img.onload = () => {
            doc.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight);
            if (companyName) {
              doc.setFontSize(16);
              doc.text(companyName, textX, logoY + (logoHeight / 2) + 2); // Vertically center with logo
            }
            currentY = Math.max(currentY, logoY + logoHeight + 10); // Update Y after header
            callback();
          };
          img.onerror = () => {
            // If logo fails to load, add company name only
            if (companyName) {
              doc.setFontSize(16);
              doc.text(companyName, logoX, logoY + 5); // Add company name at logo position
              currentY = Math.max(currentY, logoY + 15 + 10); // Update Y after company name
            } else {
              currentY = Math.max(currentY, logoY + 10); // Just move Y down if no logo or name
            }
            callback();
          };
        } else if (companyName) {
          doc.setFontSize(16);
          doc.text(companyName, logoX, logoY + 5);
          currentY = Math.max(currentY, logoY + 15 + 10);
          callback();
        } else {
          currentY = Math.max(currentY, logoY + 10); // Just move Y down if no logo or name
          callback();
        }
      };

      // Function to generate the rest of the service ticket content
      const generateTicketContent = () => {
        doc.setFontSize(20);
        doc.text('Service Ticket', 105, currentY + 10, { align: 'center' });
        currentY += 30;

        doc.setFontSize(12);
        doc.text(`Ticket #: ${ticket.id || 'N/A'}`, 20, currentY);
        currentY += 7;
        doc.text(`Date: ${formatDate(ticket.createdAt)}`, 20, currentY);
        currentY += 7;
        doc.text(`Customer: ${ticket.customerId || 'N/A'}`, 20, currentY);
        currentY += 7;
        doc.text(`Status: ${ticket.status?.replace('_', ' ')?.toUpperCase() || 'N/A'}`, 20, currentY);
        currentY += 15;

        doc.setFontSize(16);
        doc.text('Service Details', 20, currentY);
        currentY += 10;

        doc.setFontSize(12);
        doc.text(`Title: ${ticket.title || 'N/A'}`, 20, currentY);
        currentY += 7;

        const splitDescription = doc.splitTextToSize(ticket.description || '', 170);
        doc.text(splitDescription, 20, currentY);
        currentY += (splitDescription.length * 7) + 15;

        if (Array.isArray(ticket.parts) && ticket.parts.length > 0) {
          doc.setFontSize(16);
          doc.text('Parts', 20, currentY);
          currentY += 5;

          (doc as any).autoTable({
            startY: currentY,
            head: [['Part Number', 'Description', 'Quantity', 'Unit Cost', 'Total']],
            body: ticket.parts.map(part => [
              part.partNumber || '',
              part.description || '',
              part.quantity || 0,
              formatCurrency(part.unitCost || 0),
              formatCurrency(part.total || 0)
            ]),
            foot: [['', '', '', 'Parts Total:', formatCurrency(totals.partsTotal)]],
            theme: 'striped',
            headStyles: { fillColor: [66, 139, 202] }
          });
          currentY = (doc as any).lastAutoTable.finalY + 15;
        }

        if (Array.isArray(ticket.labor) && ticket.labor.length > 0) {
          doc.setFontSize(16);
          doc.text('Labor', 20, currentY);
          currentY += 5;

          (doc as any).autoTable({
            startY: currentY,
            head: [['Description', 'Hours', 'Rate', 'Total']],
            body: ticket.labor.map(labor => [
              labor.description || '',
              labor.hours || 0,
              formatCurrency(labor.rate || 0),
              formatCurrency(labor.total || 0)
            ]),
            foot: [['', '', 'Labor Total:', formatCurrency(totals.laborTotal)]],
            theme: 'striped',
            headStyles: { fillColor: [66, 139, 202] }
          });
          currentY = (doc as any).lastAutoTable.finalY + 10;
        }

        doc.setFontSize(14);
        doc.text(`Grand Total: ${formatCurrency(totals.grandTotal)}`, 150, currentY, { align: 'right' });
        currentY += 15;

        if (ticket.notes) {
          doc.setFontSize(16);
          doc.text('Notes', 20, currentY);
          currentY += 10;

          const splitNotes = doc.splitTextToSize(ticket.notes, 170);
          doc.text(splitNotes, 20, currentY);
          currentY += (splitNotes.length * 7) + 10;
        }

        doc.save(`service-ticket-${ticket.id || 'N/A'}.pdf`);

        toast({
          title: 'PDF Generated',
          description: 'Service ticket PDF has been downloaded',
        });
      };

      // Start by adding the header, then generate the rest of the content
      addHeader(generateTicketContent);

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF',
        variant: 'destructive'
      });
    }
  };

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
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="parts-labor">Parts & Labor</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Ticket Header */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn("ri-badge-status", getStatusColor(ticket.status))}>
                  {ticket.status?.replace('_', ' ')?.toUpperCase() || 'N/A'}
                </Badge>
                <Badge className={cn("ri-badge-status", getPriorityColor(ticket.priority))}>
                  {ticket.priority?.toUpperCase() || 'N/A'} PRIORITY
                </Badge>
                {ticket.customFields?.warrantyStatus && (
                  <Badge className={cn("ri-badge-status", getWarrantyStatusColor(ticket.customFields.warrantyStatus))}>
                    {getWarrantyStatusLabel(ticket.customFields.warrantyStatus)}
                  </Badge>
                )}
                {ticket.customFields?.customerAuthorization && (
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    AUTHORIZED
                  </Badge>
                )}
              </div>

              {/* Ticket Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer</label>
                  <p className="font-medium">{ticket.customerId || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vehicle</label>
                  <p className="font-medium">{ticket.vehicleId || 'No Vehicle'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                  <p className="font-medium">{ticket.assignedTo || 'Unassigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
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
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <div className="mt-1 p-3 bg-muted/30 rounded-md">
                  <p className="whitespace-pre-wrap">{ticket.description || 'N/A'}</p>
                </div>
              </div>

              {/* Customer Portal Access */}
              <div className="p-3 bg-blue-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-700">Customer Portal Access:</span>
                  <span className="text-blue-700">
                    {ticket.customFields?.customerPortalAccess !== false ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  {ticket.customFields?.customerPortalAccess !== false 
                    ? 'Customer can view this ticket in the portal' 
                    : 'Customer cannot view this ticket in the portal'}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="parts-labor" className="space-y-6">
              {/* Parts */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Parts</h3>
                {Array.isArray(ticket.parts) && ticket.parts.length > 0 ? (
                  <div className="space-y-3">
                    {ticket.parts.map((part) => (
                      <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{part.description || 'N/A'}</div>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {part.quantity || 0} × {formatCurrency(part.unitCost || 0)}
                          </p>
                        </div>
                        <div className="font-bold">
                          {formatCurrency(part.total || 0)}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end p-2">
                      <span className="font-medium">Parts Total: {formatCurrency(totals.partsTotal)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>No parts added to this service ticket</p>
                  </div>
                )}
              </div>

              {/* Labor */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Labor</h3>
                {Array.isArray(ticket.labor) && ticket.labor.length > 0 ? (
                  <div className="space-y-3">
                    {ticket.labor.map((labor) => (
                      <div key={labor.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{labor.description || 'N/A'}</div>
                          <p className="text-sm text-muted-foreground">
                            {labor.hours || 0} hours × {formatCurrency(labor.rate || 0)}/hr
                          </p>
                        </div>
                        <div className="font-bold">
                          {formatCurrency(labor.total || 0)}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end p-2">
                      <span className="font-medium">Labor Total: {formatCurrency(totals.laborTotal)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>No labor added to this service ticket</p>
                  </div>
                )}
              </div>

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

            <TabsContent value="notes" className="space-y-6">
              {/* Customer Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Notes</h3>
                {ticket.notes ? (
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="whitespace-pre-wrap">{ticket.notes}</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>No customer notes for this service ticket</p>
                  </div>
                )}
              </div>

              {/* Technician Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Technician Notes</h3>
                {ticket.customFields?.technicianNotes ? (
                  <div className="p-3 bg-yellow-50 rounded-md">
                    <p className="whitespace-pre-wrap text-yellow-800">{ticket.customFields.technicianNotes}</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>No technician notes for this service ticket</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" onClick={handlePrintPDF}>
              <Printer className="h-4 w-4 mr-2" />
              Print PDF
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
