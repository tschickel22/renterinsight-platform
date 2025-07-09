// Core entity types
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'sales' | 'service' | 'finance'
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export interface Tenant {
  id: string
  name: string
  domain: string
  settings: TenantSettings
  createdAt: Date
  updatedAt: Date
}

export interface TenantSettings {
  branding: {
    logo?: string
    primaryColor: string
    secondaryColor: string
  }
  features: {
    crmEnabled: boolean
    inventoryEnabled: boolean
    financeEnabled: boolean
    serviceEnabled: boolean
  }
}

// CRM Types
export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  score: number
  assignedTo: string
  createdAt: Date
  updatedAt: Date
}

export interface Deal {
  id: string
  title: string
  leadId: string
  value: number
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  probability: number
  expectedCloseDate: Date
  assignedTo: string
  createdAt: Date
  updatedAt: Date
}

// Inventory Types
export interface Vehicle {
  id: string
  vin: string
  make: string
  model: string
  year: number
  type: 'rv' | 'motorhome' | 'trailer' | 'fifth-wheel'
  status: 'available' | 'sold' | 'reserved' | 'service'
  price: number
  location: string
  features: string[]
  images: string[]
  createdAt: Date
  updatedAt: Date
}

// Finance Types
export interface Loan {
  id: string
  vehicleId: string
  customerId: string
  amount: number
  interestRate: number
  termMonths: number
  monthlyPayment: number
  status: 'pending' | 'approved' | 'active' | 'paid-off' | 'defaulted'
  createdAt: Date
  updatedAt: Date
}

// Service Types
export interface ServiceTicket {
  id: string
  vehicleId: string
  customerId: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  assignedTo: string
  createdAt: Date
  updatedAt: Date
}

// Invoice Types
export interface Invoice {
  id: string
  customerId: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: Date
  items: InvoiceItem[]
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Report Types
export enum ReportType {
  SALES = 'SALES',
  INVENTORY = 'INVENTORY',
  SERVICE = 'SERVICE',
  FINANCIAL = 'FINANCIAL',
  CUSTOM = 'CUSTOM'
}

export interface Report {
  id: string
  name: string
  type: ReportType
  config: ReportConfig
  data: any[]
  columns: ReportColumn[]
  createdAt: Date
  updatedAt: Date
}

export interface ReportConfig {
  reportType: ReportType
  reportName: string
  startDate?: Date
  endDate?: Date
  filters?: ReportFilter[]
  columns?: ReportColumn[]
}

export interface ReportColumn {
  id: string
  header: string
  accessorKey: string
  type?: 'string' | 'number' | 'date' | 'currency'
}

export interface ReportFilter {
  id: string
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between'
  value: any
}

// PDI Types
export interface PDIInspection {
  id: string
  vehicleId: string
  inspectorId: string
  templateId: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  items: PDIItem[]
  createdAt: Date
  updatedAt: Date
}

export interface PDIItem {
  id: string
  category: string
  description: string
  status: 'pass' | 'fail' | 'na'
  notes?: string
  photos?: string[]
}

// Delivery Types
export interface Delivery {
  id: string
  vehicleId: string
  customerId: string
  scheduledDate: Date
  actualDate?: Date
  status: 'scheduled' | 'in-transit' | 'delivered' | 'cancelled'
  driverName: string
  trackingNumber: string
  createdAt: Date
  updatedAt: Date
}

// Commission Types
export interface Commission {
  id: string
  salesPersonId: string
  dealId: string
  amount: number
  rate: number
  status: 'pending' | 'approved' | 'paid'
  paidDate?: Date
  createdAt: Date
  updatedAt: Date
}

// Common utility types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SelectOption {
  value: string
  label: string
}

export interface TableColumn {
  id: string
  header: string
  accessorKey: string
  cell?: (value: any) => React.ReactNode
}

export interface FilterOption {
  field: string
  operator: string
  value: any
}