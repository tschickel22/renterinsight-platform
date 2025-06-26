export enum CommissionType {
  FLAT = 'flat',
  TIERED = 'tiered'
}

export enum CommissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export interface Commission {
  id: string
  salesPersonId: string
  dealId: string
  amount: number
  rate?: number
  notes?: string
  type: CommissionType
  status: CommissionStatus
  createdAt: Date
  updatedAt: Date
  paidDate?: Date
  customFields?: Record<string, any>
}

export interface AuditEntry {
  id?: string
  userId: string
  userName: string
  action: 'created' | 'updated' | 'approved' | 'paid' | 'cancelled' | 'manual_note'
  description: string
  timestamp: Date
  dealId: string
}
