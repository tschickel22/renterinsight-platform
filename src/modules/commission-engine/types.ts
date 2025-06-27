import { Commission, CommissionType } from '@/types'

export interface CommissionRule {
  id: string
  name: string
  type: CommissionType
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FlatCommissionRule extends CommissionRule {
  type: 'flat'
  amount: number
}

export interface PercentageCommissionRule extends CommissionRule {
  type: 'percentage'
  rate: number
}

export interface TieredCommissionRule extends CommissionRule {
  type: 'tiered'
  tiers: CommissionTier[]
}

export interface CommissionTier {
  id: string
  ruleId: string
  minAmount: number
  maxAmount?: number
  rate: number
}

export interface CommissionAuditEntry {
  id: string
  commissionId: string
  userId: string
  userName: string
  action: 'created' | 'updated' | 'approved' | 'rejected' | 'paid'
  previousValue?: Partial<Commission>
  newValue?: Partial<Commission>
  notes?: string
  timestamp: Date
}

export interface CommissionReportFilters {
  startDate?: Date
  endDate?: Date
  salesPersonId?: string
  status?: string
  type?: string
}

export interface CommissionReportSummary {
  totalCommissions: number
  totalAmount: number
  pendingAmount: number
  approvedAmount: number
  paidAmount: number
  byType: {
    flat: number
    percentage: number
    tiered: number
  }
}