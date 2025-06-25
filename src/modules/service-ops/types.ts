import { User, Vehicle, Priority, ServiceStatus } from '@/types'

export interface Technician {
  id: string
  name: string
  email: string
  specialties: string[]
  isActive: boolean
  currentLoad: number
  maxCapacity: number
  createdAt: Date
  updatedAt: Date
}

export interface ServiceTicketWorkflow {
  id: string
  ticketId: string
  currentStage: ServiceStage
  stages: ServiceStageHistory[]
  estimatedCompletionDate?: Date
  actualCompletionDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ServiceStageHistory {
  id: string
  workflowId: string
  stage: ServiceStage
  startedAt: Date
  completedAt?: Date
  assignedTo?: string
  notes?: string
}

export enum ServiceStage {
  INTAKE = 'intake',
  DIAGNOSIS = 'diagnosis',
  ESTIMATE_APPROVAL = 'estimate_approval',
  PARTS_ORDERING = 'parts_ordering',
  REPAIR = 'repair',
  QUALITY_CHECK = 'quality_check',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface WarrantyInfo {
  id: string
  ticketId: string
  warrantyType: WarrantyType
  warrantyProvider: string
  contractNumber?: string
  coverageStartDate: Date
  coverageEndDate: Date
  isActive: boolean
  deductible?: number
  coverageDetails: string
  claimNumber?: string
  claimStatus?: WarrantyClaimStatus
  claimSubmittedDate?: Date
  claimApprovedDate?: Date
  approvedAmount?: number
  createdAt: Date
  updatedAt: Date
}

export enum WarrantyType {
  MANUFACTURER = 'manufacturer',
  EXTENDED = 'extended',
  DEALER = 'dealer',
  NONE = 'none',
  FACTORY = 'factory'
}

export enum WarrantyClaimStatus {
  NOT_SUBMITTED = 'not_submitted',
  PENDING = 'pending',
  APPROVED = 'approved',
  PARTIAL_APPROVED = 'partial_approved',
  DENIED = 'denied',
  CANCELLED = 'cancelled'
}

export interface ServiceNote {
  id: string
  ticketId: string
  userId: string
  content: string
  isCustomerVisible: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ServiceDocument {
  id: string
  ticketId: string
  name: string
  type: string
  url: string
  size: number
  isCustomerVisible: boolean
  uploadedBy: string
  uploadedAt: Date
}

export interface ServiceTimeLog {
  id: string
  ticketId: string
  technicianId: string
  startTime: Date
  endTime?: Date
  duration?: number
  description: string
  billable: boolean
  createdAt: Date
  updatedAt: Date
}