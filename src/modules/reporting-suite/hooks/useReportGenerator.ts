// src/modules/reporting-suite/hooks/useReportGenerator.ts
import { useState, useCallback } from 'react'
import { Report, ReportType } from '@/types' // Assuming these types are defined in src/types/index.ts
import { formatDate } from '@/lib/utils'

// Define the structure for a report configuration
interface ReportConfig {
  reportType: ReportType
  reportName: string
  startDate?: Date
  endDate?: Date
  filters?: any[] // Placeholder for filter definitions
  columns?: any[] // Placeholder for column definitions
}

// Define the structure for a report column
interface ReportColumn {
  id: string
  header: string
  accessorKey: string
}

// Mock data generation function
const generateMockReportData = (config: ReportConfig) => {
  console.log('🔍 generateMockReportData called with config:', config)
  console.log('📊 Report type received:', config.reportType)
  console.log('📅 Date range:', { startDate: config.startDate, endDate: config.endDate })

  const data: any[] = []
  const columns: ReportColumn[] = []

  // Common columns
  columns.push({ id: 'id', header: 'ID', accessorKey: 'id' })
  columns.push({ id: 'date', header: 'Date', accessorKey: 'date' })
  columns.push({ id: 'value', header: 'Value', accessorKey: 'value' })

  console.log('📋 Initial columns:', columns)

  // Generate some mock data based on report type
  for (let i = 1; i <= 10; i++) {
    const date = new Date(config.startDate || new Date())
    date.setDate(date.getDate() + i) // Increment date for mock data
    let value = 0
    let itemSpecificData: any = {}

    console.log(`🔄 Processing row ${i}, report type: ${config.reportType}`)

    switch (config.reportType) {
      case ReportType.SALES:
        console.log('💰 Generating SALES data')
        value = Math.floor(Math.random() * 1000) + 100
        itemSpecificData = {
          product: `Product ${Math.floor(Math.random() * 5) + 1}`,
          customer: `Customer ${Math.floor(Math.random() * 10) + 1}`,
        }
        // Add specific columns if not already present
        if (!columns.some(col => col.id === 'product')) columns.push({ id: 'product', header: 'Product', accessorKey: 'product' })
        if (!columns.some(col => col.id === 'customer')) columns.push({ id: 'customer', header: 'Customer', accessorKey: 'customer' })
        break
      case ReportType.INVENTORY:
        console.log('📦 Generating INVENTORY data')
        value = Math.floor(Math.random() * 50) + 1
        itemSpecificData = {
          item: `Item ${Math.floor(Math.random() * 20) + 1}`,
          location: `Warehouse ${Math.floor(Math.random() * 3) + 1}`,
        }
        if (!columns.some(col => col.id === 'item')) columns.push({ id: 'item', header: 'Item', accessorKey: 'item' })
        if (!columns.some(col => col.id === 'location')) columns.push({ id: 'location', header: 'Location', accessorKey: 'location' })
        break
      case ReportType.SERVICE:
        console.log('🔧 Generating SERVICE data')
        value = Math.floor(Math.random() * 500) + 50
        itemSpecificData = {
          serviceType: `Service ${Math.floor(Math.random() * 4) + 1}`,
          technician: `Tech ${Math.floor(Math.random() * 5) + 1}`,
        }
        if (!columns.some(col => col.id === 'serviceType')) columns.push({ id: 'serviceType', header: 'Service Type', accessorKey: 'serviceType' })
        if (!columns.some(col => col.id === 'technician')) columns.push({ id: 'technician', header: 'Technician', accessorKey: 'technician' })
        break
      case ReportType.FINANCIAL:
        console.log('💳 Generating FINANCIAL data')
        value = Math.floor(Math.random() * 2000) + 200
        itemSpecificData = {
          category: `Category ${Math.floor(Math.random() * 6) + 1}`,
          transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        }
        if (!columns.some(col => col.id === 'category')) columns.push({ id: 'category', header: 'Category', accessorKey: 'category' })
        if (!columns.some(col => col.id === 'transactionId')) columns.push({ id: 'transactionId', header: 'Transaction ID', accessorKey: 'transactionId' })
        break
      case ReportType.CUSTOM:
        console.log('⚙️ Generating CUSTOM data')
        value = Math.floor(Math.random() * 100) + 10
        break
      default:
        console.log('❓ Unknown report type, using default data generation')
        value = Math.floor(Math.random() * 100) + 10
        break
    }

    const rowData = {
      id: `mock-${i}`,
      date: formatDate(date),
      value: value,
      ...itemSpecificData,
    }

    console.log(`📝 Generated row ${i}:`, rowData)
    data.push(rowData)
  }

  // Ensure unique columns and maintain order
  const uniqueColumnsMap = new Map<string, ReportColumn>();
  columns.forEach(col => uniqueColumnsMap.set(col.id, col));
  const uniqueColumns = Array.from(uniqueColumnsMap.values());

  console.log('✅ Final generated data:', data)
  console.log('📋 Final columns:', uniqueColumns)
  console.log('📊 Data count:', data.length)

  return { data, columns: uniqueColumns }
}

export function useReportGenerator() {
  const [reportData, setReportData] = useState<any[]>([])
  const [reportColumns, setReportColumns] = useState<ReportColumn[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [currentReportConfig, setCurrentReportConfig] = useState<ReportConfig | null>(null)

  const generateReport = useCallback(async (config: ReportConfig) => {
    console.log('🚀 generateReport called with config:', config)
    console.log('🔄 Setting loading to true')
    
    setLoading(true)
    setCurrentReportConfig(config)
    
    // Simulate API call or heavy computation
    console.log('⏳ Simulating API call delay...')
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('📊 Calling generateMockReportData...')
    const { data, columns } = generateMockReportData(config)
    
    console.log('📥 Received data from generateMockReportData:', data)
    console.log('📋 Received columns from generateMockReportData:', columns)
    
    console.log('💾 Setting report data and columns in state...')
    setReportData(data)
    setReportColumns(columns)
    
    console.log('✅ Setting loading to false')
    setLoading(false)
    
    console.log('🎉 Report generation complete!')
  }, [])

  const exportToCSV = useCallback(() => {
    console.log('📤 exportToCSV called')
    console.log('📊 Current reportData:', reportData)
    console.log('📋 Current reportColumns:', reportColumns)
    
    if (reportData.length === 0 || reportColumns.length === 0) {
      console.warn('⚠️ No data to export.')
      return
    }

    const header = reportColumns.map(col => col.header).join(',')
    const rows = reportData.map(row =>
      reportColumns.map(col => {
        const value = row[col.accessorKey]
        // Handle commas and quotes in CSV
        return typeof value === 'string' && value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value
      }).join(',')
    )

    const csvContent = [header, ...rows].join('\n')
    console.log('📄 Generated CSV content:', csvContent)
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) { // Feature detection for download attribute
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${currentReportConfig?.reportName || 'report'}_${formatDate(new Date())}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      console.log('✅ CSV export completed')
    }
  }, [reportData, reportColumns, currentReportConfig])

  console.log('🔍 useReportGenerator hook state:', {
    reportDataLength: reportData.length,
    reportColumnsLength: reportColumns.length,
    loading,
    currentReportConfig
  })

  return {
    reportData,
    reportColumns,
    loading,
    currentReportConfig,
    generateReport,
    exportToCSV,
  }
}