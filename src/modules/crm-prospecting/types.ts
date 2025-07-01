export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  source: string
  sourceId: string
  status: LeadStatus
  assignedTo?: string
  notes: string
  score: number
  lastActivity: Date
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface LeadSource {
  id: string
  name: string
  type: 'website' | 'referral' | 'social' | 'advertising' | 'event' | 'cold_call' | 'email' | 'other'
  isActive: boolean
  trackingCode?: string
  conversionRate: number
  createdAt: Date
}

export interface LeadFormField {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'phone' | 'select' | 'multiselect' | 'textarea' | 'number' | 'date' | 'checkbox'
  required: boolean
  options?: string[]
  placeholder?: string
  validation?: string
  order: number
  isActive: boolean
}

export interface LeadIntakeForm {
  id: string
  name: string
  description: string
  sourceId: string
  fields: LeadFormField[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LeadActivity {
  id: string
  leadId: string
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change' | 'form_submission' | 'website_visit' | 'sms' | 'nurture_email' | 'ai_suggestion'
  description: string
  outcome?: 'positive' | 'neutral' | 'negative'
  duration?: number // in minutes
  scheduledDate?: Date
  completedDate?: Date
  userId: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface LeadScore {
  leadId: string
  totalScore: number
  demographicScore: number
  behaviorScore: number
  engagementScore: number
  lastCalculated: Date
  factors: ScoreFactor[]
}

export interface ScoreFactor {
  factor: string
  points: number
  reason: string
}

export interface SalesRep {
  id: string
  name: string
  email: string
  phone: string
  territory?: string
  isActive: boolean
  targets: {
    monthly: number
    quarterly: number
    annual: number
  }
}

export interface LeadReminder {
  id: string
  leadId: string
  userId: string
  type: 'follow_up' | 'call' | 'email' | 'meeting' | 'deadline'
  title: string
  description: string
  dueDate: Date
  isCompleted: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
}

export interface PipelineStage {
  id: string
  name: string
  order: number
  probability: number // 0-100
  isActive: boolean
  color: string
  requirements?: string[]
}

export interface PipelineMetrics {
  stage: string
  count: number
  value: number
  averageTime: number // days in stage
  conversionRate: number
}

export interface SalesRepMetrics {
  repId: string
  repName: string
  totalLeads: number
  qualifiedLeads: number
  closedWon: number
  closedLost: number
  pipelineValue: number
  conversionRate: number
  averageDealSize: number
  activitiesThisWeek: number
}

// Nurturing and Automation Types
export interface NurtureSequence {
  id: string
  name: string
  description: string
  triggerConditions: TriggerCondition[]
  steps: NurtureStep[]
  isActive: boolean
  targetAudience: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface TriggerCondition {
  type: 'lead_status' | 'lead_score' | 'time_since_activity' | 'custom_field' | 'source'
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains'
  value: any
  logicalOperator?: 'AND' | 'OR'
}

export interface NurtureStep {
  id: string
  sequenceId: string
  order: number
  type: 'email' | 'sms' | 'task' | 'wait' | 'condition'
  delay: number // hours
  content: StepContent
  conditions?: TriggerCondition[]
  isActive: boolean
}

export interface StepContent {
  subject?: string
  body: string
  template?: string
  variables?: Record<string, string>
  attachments?: string[]
}

export interface NurtureEnrollment {
  id: string
  leadId: string
  sequenceId: string
  currentStepId: string
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  enrolledAt: Date
  completedAt?: Date
  nextActionAt: Date
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: 'nurture' | 'follow_up' | 'welcome' | 'proposal' | 'custom'
  variables: string[]
  isActive: boolean
  createdAt: Date
}

export interface SMSTemplate {
  id: string
  name: string
  message: string
  type: 'nurture' | 'follow_up' | 'reminder' | 'custom'
  variables: string[]
  isActive: boolean
  createdAt: Date
}

export interface CommunicationLog {
  id: string
  leadId: string
  type: 'email' | 'sms'
  direction: 'outbound' | 'inbound'
  subject?: string
  content: string
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'failed'
  sentAt: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date
  metadata?: Record<string, any>
}

export interface AIInsight {
  id: string
  leadId: string
  type: 'next_action' | 'communication_style' | 'timing' | 'content_suggestion' | 'risk_assessment'
  title: string
  description: string
  confidence: number // 0-100
  actionable: boolean
  suggestedActions?: string[]
  metadata?: Record<string, any>
  generatedAt: Date
  isRead: boolean
}

export interface AutomationRule {
  id: string
  name: string
  description: string
  triggers: TriggerCondition[]
  actions: AutomationAction[]
  isActive: boolean
  createdAt: Date
}

export interface AutomationAction {
  type: 'send_email' | 'send_sms' | 'create_task' | 'update_status' | 'assign_rep' | 'add_tag' | 'enroll_sequence'
  parameters: Record<string, any>
  delay?: number // minutes
}

export interface NurtureAnalytics {
  sequenceId: string
  totalEnrollments: number
  activeEnrollments: number
  completedEnrollments: number
  averageCompletionTime: number // days
  stepPerformance: StepPerformance[]
  conversionRate: number
  generatedLeads: number
}

export interface StepPerformance {
  stepId: string
  stepName: string
  deliveryRate: number
  openRate?: number
  clickRate?: number
  responseRate?: number
  conversionRate: number
}