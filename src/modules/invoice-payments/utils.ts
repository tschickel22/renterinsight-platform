import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { Invoice, Tenant } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export const generateInvoicePDF = (invoice: Invoice, tenant: Tenant | null) => {
  try {
    const doc = new jsPDF()
    let currentY = 10 // Initial Y position

    // Function to add header (logo and company name)
    const addHeader = (callback: () => void) => {
      const logoUrl = tenant?.branding?.logo
      const companyName = tenant?.name
      const logoWidth = 30
      const logoHeight = 15
      const logoX = 10
      const logoY = 10
      const textX = logoX + logoWidth + 5 // Space after logo

      if (logoUrl) {
        const img = new Image()
        img.src = logoUrl
        img.onload = () => {
          doc.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight)
          if (companyName) {
            doc.setFontSize(16)
            doc.text(companyName, textX, logoY + (logoHeight / 2) + 2) // Vertically center with logo
          }
          currentY = Math.max(currentY, logoY + logoHeight + 10) // Update Y after header
          callback()
        }
        img.onerror = () => {
          // If logo fails to load, add company name only
          if (companyName) {
            doc.setFontSize(16)
            doc.text(companyName, logoX, logoY + 5) // Add company name at logo position
            currentY = Math.max(currentY, logoY + 15 + 10) // Update Y after company name
          } else {
            currentY = Math.max(currentY, logoY + 10) // Just move Y down if no logo or name
          }
          callback()
        }
      } else if (companyName) {
        doc.setFontSize(16)
        doc.text(companyName, logoX, logoY + 5)
        currentY = Math.max(currentY, logoY + 15 + 10)
        callback()
      } else {
        currentY = Math.max(currentY, logoY + 10) // Just move Y down if no logo or name
        callback()
      }
    }

    // Function to generate the rest of the service ticket content
    const generateTicketContent = () => {
      doc.setFontSize(20)
      doc.text('INVOICE', 105, currentY + 10, { align: 'center' })
      currentY += 30

      doc.setFontSize(12)
      doc.text(`Invoice #: ${invoice.number}`, 20, currentY)
      currentY += 7
      doc.text(`Date: ${formatDate(invoice.createdAt)}`, 20, currentY)
      currentY += 7
      doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 20, currentY)
      currentY += 7
      doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, currentY)
      currentY += 15

      // Add customer info
      doc.setFontSize(14)
      doc.text('Bill To:', 20, currentY)
      currentY += 10

      doc.setFontSize(12)
      doc.text(`Customer ID: ${invoice.customerId}`, 20, currentY)
      currentY += 15

      // Items table
      doc.setFontSize(14)
      doc.text('Invoice Items', 20, currentY)
      currentY += 5

      // @ts-ignore
      doc.autoTable({
        startY: currentY,
        head: [['Description', 'Quantity', 'Unit Price', 'Total']],
        body: invoice.items.map(item => [
          item.description,
          item.quantity,
          formatCurrency(item.unitPrice),
          formatCurrency(item.total)
        ]),
        foot: [
          ['', '', 'Subtotal:', formatCurrency(invoice.subtotal)],
          ['', '', 'Tax:', formatCurrency(invoice.tax)],
          ['', '', 'Total:', formatCurrency(invoice.total)]
        ],
        theme: 'striped',
        headStyles: { fillColor: [66, 139, 202] }
      })

      // @ts-ignore
      currentY = doc.lastAutoTable.finalY + 15

      // Notes
      if (invoice.notes) {
        doc.setFontSize(14)
        doc.text('Notes', 20, currentY)
        currentY += 10

        doc.setFontSize(12)
        const splitNotes = doc.splitTextToSize(invoice.notes, 170)
        doc.text(splitNotes, 20, currentY)
        currentY += (splitNotes.length * 7) + 10
      }

      doc.save(`invoice-${invoice.number}.pdf`)
    }

    // Start by adding the header, then generate the rest of the content
    addHeader(generateTicketContent)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF')
  }
}