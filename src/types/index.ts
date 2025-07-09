// Core entity types
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  SALES = 'sales',
  SERVICE = 'service',
  USER = 'user'
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
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
  status: LeadStatus
  score: number
  assignedTo: string
  createdAt: Date
  updatedAt: Date
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed-won',
  CLOSED_LOST = 'closed-lost'
}

export interface Deal {
  id: string
  title: string
  leadId: string
  value: number
  stage: DealStage
  probability: number
  expectedCloseDate: Date
  assignedTo: string
  createdAt: Date
  updatedAt: Date
}

export enum DealStage {
  PROSPECTING = 'prospecting',
  QUALIFICATION = 'qualification',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed-won',
  CLOSED_LOST = 'closed-lost'
}

// Inventory Types
export interface Vehicle {
  id: string
  vin: string
  make: string
  model: string
  year: number
  type: VehicleType
  status: VehicleStatus
  price: number
  location: string
  features: string[]
  images: string[]
  createdAt: Date
  updatedAt: Date
}

// Re-export vehicle types
export { VehicleStatus, VehicleType } from './vehicle';
export type { VehicleStatus as VehicleStatusType, VehicleType as VehicleTypeType } from './vehicle';

// Finance Types
export interface Loan {
  id: string
  vehicleId: string
  customerId: string
  amount: number
  interestRate: number
  termMonths: number
  monthlyPayment: number
  status: LoanStatus
  createdAt: Date
  updatedAt: Date
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  ACTIVE = 'active',
  PAID_OFF = 'paid-off',
  DEFAULTED = 'defaulted'
}

// Service Types
export interface ServiceTicket {
  id: string
  vehicleId: string
  customerId: string
  title: string
  description: string
  priority: Priority
  status: ServiceStatus
  assignedTo: string
  createdAt: Date
  updatedAt: Date
}

export enum ServiceStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  WAITING_PARTS = 'waiting-parts',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Invoice Types
export interface Invoice {
  id: string
  customerId: string
  amount: number
  status: InvoiceStatus
  dueDate: Date
  items: InvoiceItem[]
  createdAt: Date
  updatedAt: Date
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  CHECK = 'check',
  FINANCING = 'financing'
}

// Delivery Types
export enum DeliveryStatus {
  SCHEDULED = 'scheduled',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface Delivery {
  id: string
  vehicleId: string
  customerId: string
  scheduledDate: Date
  actualDate?: Date
  status: DeliveryStatus
  driverName: string
  trackingNumber: string
  createdAt: Date
  updatedAt: Date
}

// Report Types
export enum ReportType {
  SALES = 'sales',
  INVENTORY = 'inventory',
  SERVICE = 'service',
  FINANCIAL = 'financial',
  CUSTOM = 'custom'
}

export interface Report {
  id: string
  name: string
  type: ReportType
  module: string
  filters: any[]
  columns: any[]
  data: any[]
  generatedAt: Date
  generatedBy: string
}

export interface ReportConfig {
  reportType: ReportType
  reportName: string
  startDate?: Date
  endDate?: Date
  filters: any[]
  columns: any[]
}

export interface ReportColumn {
  id: string
  header: string
  accessorKey: string
  type?: 'string' | 'number' | 'date' | 'currency'
}

// Agreement Types
export interface Agreement {
  id: string
  customerId: string
  vehicleId: string
  quoteId?: string
  type: AgreementType
  status: AgreementStatus
  signedDate?: Date
  effectiveDate: Date
  expirationDate?: Date
  terms: string
  documents: AgreementDocument[]
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface AgreementDocument {
  id: string
  name: string
  type: string
  url: string
  size: number
  uploadedAt: Date
}

// Quote Types
export interface Quote {
  id: string
  customerId: string
  vehicleId: string
  items: QuoteItem[]
  subtotal: number
  tax: number
  total: number
  status: QuoteStatus
  validUntil: Date
  notes: string
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

// Payment Types
export interface Payment {
  id: string
  invoiceId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  processedDate: Date
  notes?: string
  customFields: Record<string, any>
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