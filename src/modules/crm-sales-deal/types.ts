export enum DealStage {
  PROSPECTING = 'prospecting',
  QUALIFICATION = 'qualification',
  NEEDS_ANALYSIS = 'needs_analysis',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

export enum DealStatus {
  ACTIVE = 'active',
  WON = 'won',
  LOST = 'lost',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled'
}

export enum DealPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ESCALATED = 'escalated'
}

export enum TerritoryType {
  GEOGRAPHIC = 'geographic',
  INDUSTRY = 'industry',
  ACCOUNT_SIZE = 'account_size',
  PRODUCT_LINE = 'product_line'
}

export interface Deal {
  id: string
  name: string
  customerId: string
  customerName: string
  stage: DealStage
  status: DealStatus
  priority: DealPriority
  value: number
  probability: number
  expectedCloseDate: Date
  actualCloseDate?: Date
  assignedTo: string
  territoryId: string
  sourceId?: string
  competitorIds: string[]
  products: DealProduct[]
  stageHistory: DealStageHistory[]
  notes: string
  lossReason?: string
  winReason?: string
  requiresApproval: boolean
  approvalStatus?: ApprovalStatus
  approvalWorkflow?: ApprovalWorkflow
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface DealProduct {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
}

export interface DealStageHistory {
  id: string
  dealId: string
  fromStage?: DealStage
  toStage: DealStage
  changedBy: string
  changedAt: Date
  duration?: number // hours in previous stage
  notes?: string
}

export interface Territory {
  id: string
  name: string
  type: TerritoryType
  description: string
  assignedTo: string[]
  rules: TerritoryRule[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TerritoryRule {
  id: string
  field: string
  operator: 'equals' | 'contains' | 'starts_with' | 'in_range' | 'greater_than' | 'less_than'
  value: any
  priority: number
}

export interface ApprovalWorkflow {
  id: string
  dealId: string
  workflowType: 'discount' | 'deal_value' | 'custom'
  currentStep: number
  totalSteps: number
  steps: ApprovalStep[]
  status: ApprovalStatus
  requestedBy: string
  requestedAt: Date
  completedAt?: Date
  notes?: string
}

export interface ApprovalStep {
  id: string
  stepNumber: number
  approverRole: string
  approverIds: string[]
  requiredApprovals: number
  currentApprovals: ApprovalAction[]
  status: ApprovalStatus
  dueDate?: Date
}

export interface ApprovalAction {
  id: string
  approverId: string
  action: 'approve' | 'reject' | 'escalate'
  comments?: string
  actionDate: Date
}

export interface DealMetrics {
  totalDeals: number
  totalValue: number
  wonDeals: number
  wonValue: number
  lostDeals: number
  lostValue: number
  winRate: number
  averageDealSize: number
  averageSalesCycle: number
  conversionRates: StageConversionRate[]
}

export interface StageConversionRate {
  fromStage: DealStage
  toStage: DealStage
  rate: number
  averageDuration: number
}

export interface WinLossReport {
  id: string
  dealId: string
  outcome: 'won' | 'lost'
  primaryReason: string
  secondaryReasons: string[]
  competitorWon?: string
  feedback: string
  lessonsLearned: string[]
  actionItems: string[]
  reportedBy: string
  reportedAt: Date
}

export interface DealForecast {
  period: string
  totalPipeline: number
  weightedPipeline: number
  bestCase: number
  worstCase: number
  mostLikely: number
  deals: DealForecastItem[]
}

export interface DealForecastItem {
  dealId: string
  dealName: string
  value: number
  probability: number
  weightedValue: number
  expectedCloseDate: Date
  stage: DealStage
  confidence: 'high' | 'medium' | 'low'
}