export enum CommissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export enum CommissionType {
  FLAT = 'flat',
  PERCENTAGE = 'percentage',
  TIERED = 'tiered'
}

export interface Commission {
  id: string;
  salesPersonId: string;
  dealId: string;
  type: CommissionType;
  rate: number;
  amount: number;
  status: CommissionStatus;
  paidDate?: Date;
  notes?: string;
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesPerson {
  id: string;
  name: string;
  email: string;
  territory?: string;
  isActive: boolean;
}

export interface CommissionTier {
  id: string;
  minAmount: number;
  maxAmount: number | null;
  rate: number;
  isPercentage: boolean;
}

export interface CommissionReport {
  period: string;
  salesPerson: string;
  totalCommissions: number;
  paidCommissions: number;
  pendingCommissions: number;
  dealCount: number;
  commissions: Commission[];
}

export interface AuditEntry {
  id: string;
  dealId: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'manual_note';
  description: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
  notes?: string;
}

export interface TierLevel {
  id: string;
  minAmount: number;
  maxAmount: number | null;
  rate: number;
  isPercentage: boolean;
}