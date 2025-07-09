// src/tests/useReportGenerator.test.ts
import { renderHook, act } from '@testing-library/react'
import { useReportGenerator } from '../modules/reporting-suite/hooks/useReportGenerator'
import { ReportType } from '../modules/reporting-suite/hooks/useReportGenerator'

// Mock the module hooks
jest.mock('../modules/crm-prospecting/hooks/useLeadManagement', () => ({
  useLeadManagement: () => require('./mocks/useLeadManagement').useLeadManagement()
}))

jest.mock('../modules/inventory-management/hooks/useInventoryManagement', () => ({
  useInventoryManagement: () => require('./mocks/useInventoryManagement').useInventoryManagement()
}))

jest.mock('../modules/service-ops/hooks/useServiceManagement', () => ({
  useServiceManagement: () => require('./mocks/useServiceManagement').useServiceManagement()
}))

jest.mock('../modules/invoice-payments/hooks/useInvoiceManagement', () => ({
  useInvoiceManagement: () => require('./mocks/useInvoiceManagement').useInvoiceManagement()
}))

describe('useReportGenerator', () => {
  beforeEach(() => {
    // Clear any previous test state
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useReportGenerator())

    expect(result.current.reportData).toEqual([])
    expect(result.current.reportColumns).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.currentReportConfig).toBeNull()
    expect(typeof result.current.generateReport).toBe('function')
    expect(typeof result.current.exportToCSV).toBe('function')
  })

  it('should generate sales report correctly', async () => {
    const { result } = renderHook(() => useReportGenerator())

    const reportConfig = {
      name: 'Sales Report',
      type: ReportType.SALES,
      dateRange: {
        start: new Date('2025-06-01'),
        end: new Date('2025-06-30')
      },
      filters: {},
      columns: ['firstName', 'lastName', 'status', 'value', 'assignedTo']
    }

    await act(async () => {
      await result.current.generateReport(reportConfig)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.reportData.length).toBe(3)
    expect(result.current.reportColumns.length).toBe(5)
    expect(result.current.currentReportConfig).toEqual(reportConfig)
    
    // Check if data contains expected lead information
    const firstRow = result.current.reportData[0]
    expect(firstRow.firstName).toBe('John')
    expect(firstRow.lastName).toBe('Doe')
    expect(firstRow.status).toBe('qualified')
  })

  it('should generate inventory report correctly', async () => {
    const { result } = renderHook(() => useReportGenerator())

    const reportConfig = {
      name: 'Inventory Report',
      type: ReportType.INVENTORY,
      dateRange: {
        start: new Date('2025-05-01'),
        end: new Date('2025-06-30')
      },
      filters: {},
      columns: ['make', 'model', 'year', 'type', 'status', 'price']
    }

    await act(async () => {
      await result.current.generateReport(reportConfig)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.reportData.length).toBe(3)
    expect(result.current.reportColumns.length).toBe(6)
    
    // Check if data contains expected vehicle information
    const firstRow = result.current.reportData[0]
    expect(firstRow.make).toBe('Winnebago')
    expect(firstRow.model).toBe('Vista')
    expect(firstRow.type).toBe('Class A')
  })

  it('should generate service report correctly', async () => {
    const { result } = renderHook(() => useReportGenerator())

    const reportConfig = {
      name: 'Service Report',
      type: ReportType.SERVICE,
      dateRange: {
        start: new Date('2025-06-01'),
        end: new Date('2025-06-30')
      },
      filters: {},
      columns: ['ticketNumber', 'customerName', 'type', 'status', 'totalCost']
    }

    await act(async () => {
      await result.current.generateReport(reportConfig)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.reportData.length).toBe(3)
    expect(result.current.reportColumns.length).toBe(5)
    
    // Check if data contains expected service ticket information
    const firstRow = result.current.reportData[0]
    expect(firstRow.ticketNumber).toBe('SRV-001')
    expect(firstRow.customerName).toBe('John Doe')
    expect(firstRow.type).toBe('warranty')
  })

  it('should generate financial report correctly', async () => {
    const { result } = renderHook(() => useReportGenerator())

    const reportConfig = {
      name: 'Financial Report',
      type: ReportType.FINANCIAL,
      dateRange: {
        start: new Date('2025-06-01'),
        end: new Date('2025-06-30')
      },
      filters: {},
      columns: ['invoiceNumber', 'customerName', 'status', 'totalAmount', 'balanceAmount']
    }

    await act(async () => {
      await result.current.generateReport(reportConfig)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.reportData.length).toBe(3)
    expect(result.current.reportColumns.length).toBe(5)
    
    // Check if data contains expected invoice information
    const firstRow = result.current.reportData[0]
    expect(firstRow.invoiceNumber).toBe('INV-2025-001')
    expect(firstRow.customerName).toBe('John Doe')
    expect(firstRow.status).toBe('paid')
  })

  it('should handle loading state during report generation', async () => {
    const { result } = renderHook(() => useReportGenerator())

    const reportConfig = {
      name: 'Test Report',
      type: ReportType.SALES,
      dateRange: {
        start: new Date('2025-06-01'),
        end: new Date('2025-06-30')
      },
      filters: {},
      columns: ['firstName', 'lastName']
    }

    let loadingDuringGeneration = false

    act(() => {
      result.current.generateReport(reportConfig).then(() => {
        // Report generation completed
      })
      
      // Check loading state immediately after calling generateReport
      if (result.current.loading) {
        loadingDuringGeneration = true
      }
    })

    // Wait for the async operation to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(loadingDuringGeneration).toBe(true)
    expect(result.current.loading).toBe(false)
  })

  it('should export to CSV correctly', async () => {
    const { result } = renderHook(() => useReportGenerator())

    // First generate a report
    const reportConfig = {
      name: 'Export Test Report',
      type: ReportType.SALES,
      dateRange: {
        start: new Date('2025-06-01'),
        end: new Date('2025-06-30')
      },
      filters: {},
      columns: ['firstName', 'lastName', 'status']
    }

    await act(async () => {
      await result.current.generateReport(reportConfig)
    })

    // Mock URL.createObjectURL and document methods for CSV export
    const mockCreateObjectURL = jest.fn(() => 'mock-url')
    const mockRevokeObjectURL = jest.fn()
    const mockClick = jest.fn()
    const mockAppendChild = jest.fn()
    const mockRemoveChild = jest.fn()

    global.URL.createObjectURL = mockCreateObjectURL
    global.URL.revokeObjectURL = mockRevokeObjectURL

    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick
    }

    jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any)
    jest.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild)
    jest.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild)

    // Test CSV export
    act(() => {
      result.current.exportToCSV()
    })

    expect(mockCreateObjectURL).toHaveBeenCalled()
    expect(mockClick).toHaveBeenCalled()
    expect(mockAppendChild).toHaveBeenCalled()
    expect(mockRemoveChild).toHaveBeenCalled()
    expect(mockRevokeObjectURL).toHaveBeenCalled()

    // Restore mocks
    jest.restoreAllMocks()
  })

  it('should filter data by date range correctly', async () => {
    const { result } = renderHook(() => useReportGenerator())

    // Test with a narrow date range that should exclude some data
    const reportConfig = {
      name: 'Filtered Report',
      type: ReportType.SALES,
      dateRange: {
        start: new Date('2025-06-15'),
        end: new Date('2025-06-20')
      },
      filters: {},
      columns: ['firstName', 'lastName', 'createdAt']
    }

    await act(async () => {
      await result.current.generateReport(reportConfig)
    })

    expect(result.current.loading).toBe(false)
    // Should only include leads created within the date range
    expect(result.current.reportData.length).toBeLessThanOrEqual(3)
    
    // All returned data should be within the date range
    result.current.reportData.forEach(row => {
      const createdDate = new Date(row.createdAt)
      expect(createdDate >= reportConfig.dateRange.start).toBe(true)
      expect(createdDate <= reportConfig.dateRange.end).toBe(true)
    })
  })
})