import React from 'react'
import { ServiceTicket } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { useToast } from '@/hooks/use-toast'

interface ServiceTicketPDFProps {
  ticket: ServiceTicket
}

export function generateServiceTicketPDF(ticket: ServiceTicket) {
  // Create a new PDF document
  const doc = new jsPDF()
  
  // Add company header
  doc.setFontSize(20)
  doc.setTextColor(59, 130, 246) // Primary blue color
  doc.text('Renter Insight RV', 105, 20, { align: 'center' })
  
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text('Service Ticket', 105, 30, { align: 'center' })
  
  // Add ticket information
  doc.setFontSize(12)
  doc.text(`Ticket #: ${ticket.id}`, 20, 45)
  doc.text(`Status: ${ticket.status.replace('_', ' ').toUpperCase()}`, 20, 52)
  doc.text(`Priority: ${ticket.priority.toUpperCase()}`, 20, 59)
  doc.text(`Customer: ${ticket.customerId}`, 20, 66)
  
  if (ticket.vehicleId) {
    doc.text(`Vehicle: ${ticket.vehicleId}`, 20, 73)
  }
  
  doc.text(`Created: ${formatDate(ticket.createdAt)}`, 120, 45)
  
  if (ticket.scheduledDate) {
    doc.text(`Scheduled: ${formatDate(ticket.scheduledDate)}`, 120, 52)
  }
  
  if (ticket.assignedTo) {
    doc.text(`Technician: ${ticket.assignedTo}`, 120, 59)
  }
  
  if (ticket.completedDate) {
    doc.text(`Completed: ${formatDate(ticket.completedDate)}`, 120, 66)
  }
  
  // Add description
  doc.setFontSize(14)
  doc.text('Description', 20, 85)
  
  doc.setFontSize(10)
  const descriptionLines = doc.splitTextToSize(ticket.description, 170)
  doc.text(descriptionLines, 20, 92)
  
  // Calculate the Y position after the description
  let yPos = 92 + (descriptionLines.length * 5)
  
  // Add notes if available
  if (ticket.notes) {
    yPos += 10
    doc.setFontSize(14)
    doc.text('Notes', 20, yPos)
    
    yPos += 7
    doc.setFontSize(10)
    const notesLines = doc.splitTextToSize(ticket.notes, 170)
    doc.text(notesLines, 20, yPos)
    
    yPos += (notesLines.length * 5)
  }
  
  // Add parts table
  if (ticket.parts && ticket.parts.length > 0) {
    yPos += 15
    doc.setFontSize(14)
    doc.text('Parts', 20, yPos)
    
    yPos += 5
    
    // @ts-ignore - jspdf-autotable types
    doc.autoTable({
      startY: yPos,
      head: [['Part Number', 'Description', 'Quantity', 'Unit Cost', 'Total']],
      body: ticket.parts.map(part => [
        part.partNumber,
        part.description,
        part.quantity.toString(),
        formatCurrency(part.unitCost),
        formatCurrency(part.total)
      ]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 }
    })
    
    // @ts-ignore - jspdf-autotable types
    yPos = doc.lastAutoTable.finalY + 10
  }
  
  // Add labor table
  if (ticket.labor && ticket.labor.length > 0) {
    doc.setFontSize(14)
    doc.text('Labor', 20, yPos)
    
    yPos += 5
    
    // @ts-ignore - jspdf-autotable types
    doc.autoTable({
      startY: yPos,
      head: [['Description', 'Hours', 'Rate', 'Total']],
      body: ticket.labor.map(labor => [
        labor.description,
        labor.hours.toString(),
        formatCurrency(labor.rate),
        formatCurrency(labor.total)
      ]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 }
    })
    
    // @ts-ignore - jspdf-autotable types
    yPos = doc.lastAutoTable.finalY + 10
  }
  
  // Add totals
  const partsTotal = ticket.parts?.reduce((sum, part) => sum + part.total, 0) || 0
  const laborTotal = ticket.labor?.reduce((sum, labor) => sum + labor.total, 0) || 0
  const total = partsTotal + laborTotal
  
  doc.setFontSize(12)
  doc.text(`Parts Total: ${formatCurrency(partsTotal)}`, 140, yPos)
  doc.text(`Labor Total: ${formatCurrency(laborTotal)}`, 140, yPos + 7)
  
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text(`Total: ${formatCurrency(total)}`, 140, yPos + 17)
  
  // Add footer
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Thank you for your business!', 105, 280, { align: 'center' })
  doc.text('For questions about this service ticket, please contact our service department.', 105, 285, { align: 'center' })
  
  return doc
}

export function ServiceTicketPDF({ ticket }: ServiceTicketPDFProps) {
  const { toast } = useToast()

  const handleGeneratePDF = () => {
    try {
      const doc = generateServiceTicketPDF(ticket)
      doc.save(`service-ticket-${ticket.id}.pdf`)
      
      toast({
        title: 'PDF Generated',
        description: 'Service ticket PDF has been downloaded',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate PDF',
        variant: 'destructive'
      })
    }
  }

  return (
    <Button onClick={handleGeneratePDF}>
      Download PDF
    </Button>
  )
}