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
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change' | 'form_submission' | 'website_visit'
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