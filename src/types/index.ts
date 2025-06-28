export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  tenantId: string
  permissions: Permission[]
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Tenant {
  id: string
  name: string
  domain: string
  settings: TenantSettings
  customFields: CustomField[]
  branding: TenantBranding
  createdAt: Date
  updatedAt: Date
}

export interface TenantSettings {
  timezone: string
  currency: string
  dateFormat: string
  businessHours: BusinessHours
  features: FeatureFlags
  labelOverrides?: Record<string, string>
  platformType?: string
  emailProvider?: string
  emailApiKey?: string
  emailFromAddress?: string
  emailFromName?: string
  smsProvider?: string
  smsApiKey?: string
  smsFromNumber?: string
  webhooks?: Array<{id: string, event: string, url: string, active: boolean}>
  apiEnabled?: boolean
  apiKey?: string
  allowedOrigins?: string[]
  emailTemplates?: Array<any>
  smsTemplates?: Array<any>
}

export interface TenantBranding {
  logo?: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

export interface BusinessHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export interface DayHours {
  open: string
  close: string
  closed: boolean
}

export interface FeatureFlags {
  [key: string]: boolean
}

export interface CustomField {
  id: string
  name: string
  type: CustomFieldType
  required: boolean
  options?: string[]
  defaultValue?: any
  module: string
  section: string
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  source: string
  sourceId?: string
  status: LeadStatus
  assignedTo?: string
  notes: string
  score?: number
  lastActivity?: Date
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Vehicle {
  id: string
  vin: string
  make: string
  model: string
  year: number
  type: VehicleType
  status: VehicleStatus
  price: number
  cost: number
  location: string
  features: string[]
  images: string[]
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

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

export interface Agreement {
  id: string
  type: AgreementType
  customerId: string
  vehicleId?: string
  quoteId?: string
  status: AgreementStatus
  signedDate?: Date
  effectiveDate: Date
  expirationDate?: Date
  terms: string
  documents: Document[]
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  name: string
  type: string
  url: string
  size: number
  uploadedAt: Date
}

export interface ServiceTicket {
  id: string
  customerId: string
  vehicleId?: string
  title: string
  description: string
  priority: Priority
  status: ServiceStatus
  assignedTo?: string
  scheduledDate?: Date
  completedDate?: Date
  parts: ServicePart[]
  labor: ServiceLabor[]
  notes: string
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface ServicePart {
  id: string
  partNumber: string
  description: string
  quantity: number
  unitCost: number
  total: number
}

export interface ServiceLabor {
  id: string
  description: string
  hours: number
  rate: number
  total: number
}

export interface Delivery {
  id: string
  customerId: string
  vehicleId: string
  status: DeliveryStatus
  scheduledDate: Date
  deliveredDate?: Date
  address: Address
  driver?: string
  notes: string
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Commission {
  id: string
  salesPersonId: string
  dealId: string
  type: CommissionType
  rate: number
  amount: number
  status: CommissionStatus
  paidDate?: Date
  notes: string
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Invoice {
  id: string
  customerId: string
  number: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: InvoiceStatus
  dueDate: Date
  paidDate?: Date
  paymentMethod?: string
  notes: string
  customFields: Record<string, any>
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

export interface Payment {
  id: string
  invoiceId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  processedDate: Date
  notes: string
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Report {
  id: string
  name: string
  type: ReportType
  module: string
  filters: ReportFilter[]
  columns: ReportColumn[]
  data: any[]
  generatedAt: Date
  generatedBy: string
}

export interface ReportFilter {
  field: string
  operator: FilterOperator
  value: any
}

export interface ReportColumn {
  field: string
  label: string
  type: ColumnType
  width?: number
}

// Enums
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  SALES = 'sales',
  SERVICE = 'service',
  USER = 'user'
}

export enum CustomFieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTISELECT = 'multiselect'
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

export enum VehicleType {
  RV = 'rv',
  MOTORHOME = 'motorhome',
  TRAVEL_TRAILER = 'travel_trailer',
  FIFTH_WHEEL = 'fifth_wheel',
  TOY_HAULER = 'toy_hauler',
  SINGLE_WIDE = 'single_wide',
  DOUBLE_WIDE = 'double_wide',
  TRIPLE_WIDE = 'triple_wide',
  PARK_MODEL = 'park_model',
  MODULAR_HOME = 'modular_home'
}

export enum VehicleStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  SERVICE = 'service',
  DELIVERED = 'delivered'
}

export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum AgreementType {
  PURCHASE = 'purchase',
  LEASE = 'lease',
  SERVICE = 'service',
  WARRANTY = 'warranty'
}

export enum AgreementStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SIGNED = 'signed',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum ServiceStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_PARTS = 'waiting_parts',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum DeliveryStatus {
  SCHEDULED = 'scheduled',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum CommissionType {
  FLAT = 'flat',
  PERCENTAGE = 'percentage',
  TIERED = 'tiered'
}

export enum CommissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CASH = 'cash',
  CHECK = 'check',
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  FINANCING = 'financing'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum ReportType {
  SALES = 'sales',
  INVENTORY = 'inventory',
  SERVICE = 'service',
  FINANCIAL = 'financial',
  CUSTOM = 'custom'
}

export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  BETWEEN = 'between',
  IN = 'in',
  NOT_IN = 'not_in'
}

export enum ColumnType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  CURRENCY = 'currency',
  BOOLEAN = 'boolean'
}