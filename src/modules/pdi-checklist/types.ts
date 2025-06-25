import { User, Vehicle } from '@/types'

export enum PDIInspectionStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface PDITemplate {
  id: string
  name: string
  description: string
  vehicleType: string
  isActive: boolean
  sections: PDITemplateSection[]
  createdAt: Date
  updatedAt: Date
}

export interface PDITemplateSection {
  id: string
  templateId: string
  name: string
  description: string
  orderIndex: number
  items: PDITemplateItem[]
  createdAt: Date
}

export interface PDITemplateItem {
  id: string
  sectionId: string
  name: string
  description: string
  itemType: 'checkbox' | 'text' | 'number' | 'photo'
  isRequired: boolean
  orderIndex: number
  createdAt: Date
}

export interface PDIInspection {
  id: string
  templateId: string
  template?: PDITemplate
  vehicleId: string
  vehicle?: Vehicle
  inspectorId: string
  inspector?: User
  status: string
  startedAt: Date
  completedAt?: Date
  notes?: string
  items: PDIInspectionItem[]
  defects: PDIDefect[]
  photos: PDIPhoto[]
  signoffs: PDISignoff[]
  createdAt: Date
  updatedAt: Date
}

export interface PDIInspectionItem {
  id: string
  inspectionId: string
  templateItemId: string
  templateItem?: PDITemplateItem
  status: PDIInspectionItemStatus
  value?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export enum PDIInspectionItemStatus {
  PENDING = 'pending',
  PASSED = 'passed',
  FAILED = 'failed',
  NA = 'na'
}

export interface PDIDefect {
  id: string
  inspectionId: string
  inspectionItemId?: string
  title: string
  description: string
  severity: PDIDefectSeverity
  status: PDIDefectStatus
  assignedTo?: string
  resolvedAt?: Date
  resolutionNotes?: string
  photos?: PDIPhoto[]
  createdAt: Date
  updatedAt: Date
}

export enum PDIDefectSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum PDIDefectStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  VERIFIED = 'verified'
}

export interface PDIPhoto {
  id: string
  inspectionId: string
  inspectionItemId?: string
  defectId?: string
  url: string
  caption?: string
  createdAt: Date
}

export interface PDISignoff {
  id: string
  inspectionId: string
  userId: string
  user?: User
  role: PDISignoffRole
  signatureUrl?: string
  notes?: string
  signedAt: Date
  createdAt: Date
}

export enum PDISignoffRole {
  INSPECTOR = 'inspector',
  MANAGER = 'manager',
  QUALITY_CONTROL = 'quality_control'
}