import { useState } from 'react'
import { ReportType } from '@/types'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { useServiceManagement } from '@/modules/service-ops/hooks/useServiceManagement'
import { useInvoiceManagement } from '@/modules/invoice-payments/hooks/useInvoiceManagement'
import Papa from 'papaparse'

export interface ReportConfig {
  type: ReportType
  name: string
  dateRange: {
    startDate: string
    endDate: string
  }
  filters: {
    salesRep?: string
    status?: string
    location?: string
  }
}

export interface ReportColumn {
  key: string
  label: string
  type?: 'text' | 'number' | 'currency' | 'date' | 'boolean'
}

export function useReportGenerator() {
  const [reportData, setReportData] = useState<any[]>([])
  const [reportColumns, setReportColumns] = useState<ReportColumn[]>([])
  const [loading, setLoading] = useState(false)
  const [currentReportConfig, setCurrentReportConfig] = useState<ReportConfig | null>(null)
  
  const { leads, salesReps } = useLeadManagement()
  const { vehicles } = useInventoryManagement()
  const { tickets } = useServiceManagement()
  const { invoices, payments } = useInvoiceManagement()

  const generateReport = async (config: ReportConfig) => {
    setLoading(true)
    setCurrentReportConfig(config)
    
    try {
      const startDate = new Date(config.dateRange.startDate)
      const endDate = new Date(config.dateRange.endDate)
      
      let data: any[] = []
      let columns: ReportColumn[] = []
      
      switch (config.type) {
        case ReportType.SALES:
          data = generateSalesReport(startDate, endDate, config.filters)
          columns = [
            { key: 'id', label: 'ID' },
            { key: 'customerName', label: 'Customer' },
            { key: 'date', label: 'Date', type: 'date' },
            { key: 'product', label: 'Product' },
            { key: 'salesRep', label: 'Sales Rep' },
            { key: 'amount', label: 'Amount', type: 'currency' },
            { key: 'status', label: 'Status' }
          ]
          break
          
        case ReportType.INVENTORY:
          data = generateInventoryReport(config.filters)
          columns = [
            { key: 'id', label: 'ID' },
            { key: 'vin', label: 'VIN' },
            { key: 'make', label: 'Make' },
            { key: 'model', label: 'Model' },
            { key: 'year', label: 'Year', type: 'number' },
            { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status' },
            { key: 'price', label: 'Price', type: 'currency' },
            { key: 'cost', label: 'Cost', type: 'currency' },
            { key: 'location', label: 'Location' }
          ]
          break
          
        case ReportType.SERVICE:
          data = generateServiceReport(startDate, endDate, config.filters)
          columns = [
            { key: 'id', label: 'Ticket ID' },
            { key: 'title', label: 'Title' },
            { key: 'customer', label: 'Customer' },
            { key: 'vehicle', label: 'Vehicle' },
            { key: 'status', label: 'Status' },
            { key: 'createdAt', label: 'Created', type: 'date' },
            { key: 'completedAt', label: 'Completed', type: 'date' },
            { key: 'partsTotal', label: 'Parts Total', type: 'currency' },
            { key: 'laborTotal', label: 'Labor Total', type: 'currency' },
            { key: 'total', label: 'Total', type: 'currency' }
          ]
          break
          
        case ReportType.FINANCIAL:
          data = generateFinancialReport(startDate, endDate, config.filters)
          columns = [
            { key: 'date', label: 'Date', type: 'date' },
            { key: 'type', label: 'Type' },
            { key: 'reference', label: 'Reference' },
            { key: 'customer', label: 'Customer' },
            { key: 'description', label: 'Description' },
            { key: 'income', label: 'Income', type: 'currency' },
            { key: 'expense', label: 'Expense', type: 'currency' },
            { key: 'balance', label: 'Balance', type: 'currency' }
          ]
          break
          
        default:
          data = []
          columns = []
      }
      
      setReportData(data)
      setReportColumns(columns)
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSalesReport = (startDate: Date, endDate: Date, filters: any) => {
    // Filter leads by date and status
    const filteredLeads = leads.filter(lead => {
      const leadDate = new Date(lead.createdAt)
      const isInDateRange = leadDate >= startDate && leadDate <= endDate
      
      // Apply sales rep filter if provided
      const matchesSalesRep = !filters.salesRep || lead.assignedTo === filters.salesRep
      
      // Apply status filter if provided
      const matchesStatus = !filters.status || lead.status === filters.status
      
      return isInDateRange && matchesSalesRep && matchesStatus
    })
    
    // Transform leads into report data
    return filteredLeads.map(lead => {
      const salesRep = salesReps.find(rep => rep.id === lead.assignedTo)
      
      return {
        id: lead.id,
        customerName: `${lead.firstName} ${lead.lastName}`,
        date: lead.createdAt,
        product: lead.customFields?.interests || 'N/A',
        salesRep: salesRep?.name || 'Unassigned',
        amount: lead.customFields?.budget ? parseFloat(lead.customFields.budget.replace(/[^0-9.]/g, '')) || 0 : 0,
        status: lead.status
      }
    })
  }

  const generateInventoryReport = (filters: any) => {
    // Filter vehicles
    const filteredVehicles = vehicles.filter(vehicle => {
      // Apply location filter if provided
      const matchesLocation = !filters.location || vehicle.location.toLowerCase().includes(filters.location.toLowerCase())
      
      // Apply status filter if provided
      const matchesStatus = !filters.status || vehicle.status === filters.status
      
      return matchesLocation && matchesStatus
    })
    
    // Transform vehicles into report data
    return filteredVehicles.map(vehicle => ({
      id: vehicle.id,
      vin: vehicle.vin,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      status: vehicle.status,
      price: vehicle.price,
      cost: vehicle.cost,
      location: vehicle.location
    }))
  }

  const generateServiceReport = (startDate: Date, endDate: Date, filters: any) => {
    // Filter service tickets by date
    const filteredTickets = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt)
      const isInDateRange = ticketDate >= startDate && ticketDate <= endDate
      
      // Apply status filter if provided
      const matchesStatus = !filters.status || ticket.status === filters.status
      
      return isInDateRange && matchesStatus
    })
    
    // Transform tickets into report data
    return filteredTickets.map(ticket => {
      const partsTotal = ticket.parts.reduce((sum, part) => sum + part.total, 0)
      const laborTotal = ticket.labor.reduce((sum, labor) => sum + labor.total, 0)
      
      return {
        id: ticket.id,
        title: ticket.title,
        customer: ticket.customerId,
        vehicle: ticket.vehicleId || 'N/A',
        status: ticket.status,
        createdAt: ticket.createdAt,
        completedAt: ticket.completedDate,
        partsTotal,
        laborTotal,
        total: partsTotal + laborTotal
      }
    })
  }

  const generateFinancialReport = (startDate: Date, endDate: Date, filters: any) => {
    // Combine invoices and payments into financial transactions
    const transactions: any[] = []
    
    // Add invoices
    invoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.createdAt)
      if (invoiceDate >= startDate && invoiceDate <= endDate) {
        transactions.push({
          date: invoice.createdAt,
          type: 'Invoice',
          reference: invoice.number,
          customer: invoice.customerId,
          description: `Invoice #${invoice.number}`,
          income: invoice.total,
          expense: 0,
          balance: invoice.total
        })
      }
    })
    
    // Add payments
    payments.forEach(payment => {
      const paymentDate = new Date(payment.processedDate)
      if (paymentDate >= startDate && paymentDate <= endDate) {
        transactions.push({
          date: payment.processedDate,
          type: 'Payment',
          reference: payment.id,
          customer: invoices.find(i => i.id === payment.invoiceId)?.customerId || 'Unknown',
          description: `Payment for Invoice #${payment.invoiceId}`,
          income: 0,
          expense: payment.amount,
          balance: -payment.amount
        })
      }
    })
    
    // Sort by date
    return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const exportToCSV = () => {
    if (!reportData.length || !reportColumns.length) return
    
    // Prepare CSV data
    const headers = reportColumns.map(col => col.label)
    const rows = reportData.map(row => 
      reportColumns.map(col => {
        const value = row[col.key]
        
        // Format values based on column type
        switch (col.type) {
          case 'currency':
            return typeof value === 'number' ? value.toFixed(2) : value
          case 'date':
            return value instanceof Date ? value.toISOString().split('T')[0] : value
          default:
            return value
        }
      })
    )
    
    // Generate CSV
    const csv = Papa.unparse({
      fields: headers,
      data: rows
    })
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${currentReportConfig?.name || 'report'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    reportData,
    reportColumns,
    loading,
    currentReportConfig,
    generateReport,
    exportToCSV
  }
}