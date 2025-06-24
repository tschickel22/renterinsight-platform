import { useState, useEffect } from 'react'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { 
  NurtureSequence, 
  NurtureEnrollment, 
  EmailTemplate, 
  SMSTemplate, 
  CommunicationLog,
  AIInsight,
  AutomationRule,
  NurtureAnalytics,
  Lead
} from '../types'

export function useNurturing() {
  const [sequences, setSequences] = useState<NurtureSequence[]>([])
  const [enrollments, setEnrollments] = useState<NurtureEnrollment[]>([])
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
  const [smsTemplates, setSmsTemplates] = useState<SMSTemplate[]>([])
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])
  const [analytics, setAnalytics] = useState<NurtureAnalytics[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Load existing data from localStorage or use mock data
    const savedEmailTemplates = loadFromLocalStorage('renter-insight-email-templates', [])
    const savedSmsTemplates = loadFromLocalStorage('renter-insight-sms-templates', [])
    const savedSequences = loadFromLocalStorage('renter-insight-sequences', [])
    const savedEnrollments = loadFromLocalStorage('renter-insight-enrollments', [])
    const savedCommunicationLogs = loadFromLocalStorage('renter-insight-communication-logs', [])
    const savedAiInsights = loadFromLocalStorage('renter-insight-ai-insights', [])

    // Only initialize with mock data if localStorage is empty
    if (savedEmailTemplates.length === 0) {
    // Mock email templates
    const mockEmailTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Welcome New Lead',
        subject: 'Welcome to {{company_name}}, {{first_name}}!',
        body: `Hi {{first_name}},

Thank you for your interest in our RV inventory! We're excited to help you find the perfect recreational vehicle for your adventures.

Here's what happens next:
- One of our RV specialists will contact you within 24 hours
- We'll schedule a personalized tour of our showroom
- You'll receive our latest inventory updates and special offers

In the meantime, feel free to browse our current inventory at {{website_url}}.

Best regards,
{{rep_name}}
{{company_name}}`,
        type: 'welcome',
        variables: ['first_name', 'company_name', 'website_url', 'rep_name'],
        isActive: true,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Follow-up After 3 Days',
        subject: 'Still looking for the perfect RV, {{first_name}}?',
        body: `Hi {{first_name}},

I wanted to follow up on your recent inquiry about our RV inventory. Have you had a chance to think about what type of RV would best suit your needs?

Based on your interests, I'd love to show you:
- {{suggested_models}}

We also have some exciting financing options that might interest you. Would you like to schedule a call this week to discuss your options?

You can reply to this email or call me directly at {{rep_phone}}.

Best regards,
{{rep_name}}`,
        type: 'follow_up',
        variables: ['first_name', 'suggested_models', 'rep_phone', 'rep_name'],
        isActive: true,
        createdAt: new Date('2024-01-01')
      }
    ]
      setEmailTemplates(mockEmailTemplates)
      saveToLocalStorage('renter-insight-email-templates', mockEmailTemplates)
    } else {
      setEmailTemplates(savedEmailTemplates)
    }

    if (savedSmsTemplates.length === 0) {
    // Mock SMS templates
    const mockSmsTemplates: SMSTemplate[] = [
      {
        id: '1',
        name: 'Quick Follow-up',
        message: 'Hi {{first_name}}! This is {{rep_name}} from {{company_name}}. Just wanted to check if you have any questions about the RVs you viewed. Reply STOP to opt out.',
        type: 'follow_up',
        variables: ['first_name', 'rep_name', 'company_name'],
        isActive: true,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Appointment Reminder',
        message: 'Hi {{first_name}}! Reminder: Your RV showroom appointment is tomorrow at {{appointment_time}}. See you then! - {{rep_name}}',
        type: 'reminder',
        variables: ['first_name', 'appointment_time', 'rep_name'],
        isActive: true,
        createdAt: new Date('2024-01-01')
      }
    ]
      setSmsTemplates(mockSmsTemplates)
      saveToLocalStorage('renter-insight-sms-templates', mockSmsTemplates)
    } else {
      setSmsTemplates(savedSmsTemplates)
    }

    if (savedSequences.length === 0) {
    // Mock nurture sequences
    const mockSequences: NurtureSequence[] = [
      {
        id: '1',
        name: 'New Lead Welcome Series',
        description: 'Automated welcome sequence for new leads',
        triggerConditions: [
          {
            type: 'lead_status',
            operator: 'equals',
            value: 'new'
          }
        ],
        steps: [
          {
            id: '1',
            sequenceId: '1',
            order: 1,
            type: 'email',
            delay: 0,
            content: {
              subject: 'Welcome to {{company_name}}, {{first_name}}!',
              body: mockEmailTemplates[0].body,
              template: '1'
            },
            isActive: true
          },
          {
            id: '2',
            sequenceId: '1',
            order: 2,
            type: 'wait',
            delay: 72, // 3 days
            content: {
              body: 'Wait 3 days'
            },
            isActive: true
          },
          {
            id: '3',
            sequenceId: '1',
            order: 3,
            type: 'email',
            delay: 0,
            content: {
              subject: 'Still looking for the perfect RV, {{first_name}}?',
              body: mockEmailTemplates[1].body,
              template: '2'
            },
            isActive: true
          },
          {
            id: '4',
            sequenceId: '1',
            order: 4,
            type: 'sms',
            delay: 48, // 2 days after email
            content: {
              body: mockSmsTemplates[0].message
            },
            isActive: true
          }
        ],
        isActive: true,
        targetAudience: 'New website leads',
        createdBy: 'admin',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ]
      setSequences(mockSequences)
      saveToLocalStorage('renter-insight-sequences', mockSequences)
    } else {
      setSequences(savedSequences)
    }

    if (savedAiInsights.length === 0) {
    // Mock AI insights
    const mockAiInsights: AIInsight[] = [
      {
        id: '1',
        leadId: '1',
        type: 'next_action',
        title: 'Optimal Contact Time Identified',
        description: 'Based on lead behavior patterns, the best time to contact this lead is Tuesday-Thursday between 2-4 PM.',
        confidence: 85,
        actionable: true,
        suggestedActions: [
          'Schedule call for Tuesday 2-4 PM',
          'Send follow-up email on Wednesday morning',
          'Avoid Friday afternoon contact'
        ],
        metadata: {
          timeZone: 'EST',
          preferredDays: ['Tuesday', 'Wednesday', 'Thursday'],
          preferredHours: [14, 15, 16]
        },
        generatedAt: new Date('2024-01-20'),
        isRead: false
      },
      {
        id: '2',
        leadId: '1',
        type: 'communication_style',
        title: 'Communication Preference Analysis',
        description: 'This lead responds better to detailed, educational content rather than high-pressure sales tactics.',
        confidence: 78,
        actionable: true,
        suggestedActions: [
          'Share educational RV buying guides',
          'Focus on features and benefits',
          'Provide comparison charts',
          'Avoid aggressive closing techniques'
        ],
        metadata: {
          preferredStyle: 'educational',
          responseRate: 0.65,
          engagementType: 'content-focused'
        },
        generatedAt: new Date('2024-01-20'),
        isRead: false
      }
    ]
      setAiInsights(mockAiInsights)
      saveToLocalStorage('renter-insight-ai-insights', mockAiInsights)
    } else {
      setAiInsights(savedAiInsights)
    }

    // Set other data from localStorage
    setEnrollments(savedEnrollments)
    setCommunicationLogs(savedCommunicationLogs)
  }

  const enrollLeadInSequence = async (leadId: string, sequenceId: string) => {
    setLoading(true)
    try {
      const enrollment: NurtureEnrollment = {
        id: Math.random().toString(36).substr(2, 9),
        leadId,
        sequenceId,
        currentStepId: sequences.find(s => s.id === sequenceId)?.steps[0]?.id || '',
        status: 'active',
        enrolledAt: new Date(),
        nextActionAt: new Date()
      }

      setEnrollments(prev => [...prev, enrollment])
      
      // Start the sequence
      await processNextStep(enrollment)
      
      return enrollment
    } finally {
      setLoading(false)
    }
  }

  const processNextStep = async (enrollment: NurtureEnrollment) => {
    const sequence = sequences.find(s => s.id === enrollment.sequenceId)
    if (!sequence) return

    const currentStep = sequence.steps.find(s => s.id === enrollment.currentStepId)
    if (!currentStep) return

    switch (currentStep.type) {
      case 'email':
        await sendNurtureEmail(enrollment.leadId, currentStep)
        break
      case 'sms':
        await sendNurtureSMS(enrollment.leadId, currentStep)
        break
      case 'wait':
        // Schedule next step
        const nextActionAt = new Date()
        nextActionAt.setHours(nextActionAt.getHours() + currentStep.delay)
        
        setEnrollments(prev => prev.map(e => 
          e.id === enrollment.id 
            ? { ...e, nextActionAt }
            : e
        ))
        break
    }

    // Move to next step
    const nextStepIndex = sequence.steps.findIndex(s => s.id === currentStep.id) + 1
    if (nextStepIndex < sequence.steps.length) {
      const nextStep = sequence.steps[nextStepIndex]
      setEnrollments(prev => prev.map(e => 
        e.id === enrollment.id 
          ? { ...e, currentStepId: nextStep.id }
          : e
      ))
    } else {
      // Complete sequence
      setEnrollments(prev => prev.map(e => 
        e.id === enrollment.id 
          ? { ...e, status: 'completed', completedAt: new Date() }
          : e
      ))
    }
  }

  const sendNurtureEmail = async (leadId: string, step: any) => {
    // Simulate sending email
    const log: CommunicationLog = {
      id: Math.random().toString(36).substr(2, 9),
      leadId,
      type: 'email',
      direction: 'outbound',
      subject: step.content.subject,
      content: step.content.body,
      status: 'sent',
      sentAt: new Date(),
      metadata: {
        sequenceStep: step.id,
        template: step.content.template
      }
    }

    setCommunicationLogs(prev => [...prev, log])

    // Simulate delivery and open tracking
    setTimeout(() => {
      setCommunicationLogs(prev => prev.map(l => 
        l.id === log.id 
          ? { ...l, status: 'delivered', deliveredAt: new Date() }
          : l
      ))
    }, 2000)

    setTimeout(() => {
      setCommunicationLogs(prev => prev.map(l => 
        l.id === log.id 
          ? { ...l, status: 'opened', openedAt: new Date() }
          : l
      ))
    }, 5000)
  }

  const sendNurtureSMS = async (leadId: string, step: any) => {
    // Simulate sending SMS
    const log: CommunicationLog = {
      id: Math.random().toString(36).substr(2, 9),
      leadId,
      type: 'sms',
      direction: 'outbound',
      content: step.content.body,
      status: 'sent',
      sentAt: new Date(),
      metadata: {
        sequenceStep: step.id
      }
    }

    setCommunicationLogs(prev => [...prev, log])

    // Simulate delivery
    setTimeout(() => {
      setCommunicationLogs(prev => prev.map(l => 
        l.id === log.id 
          ? { ...l, status: 'delivered', deliveredAt: new Date() }
          : l
      ))
    }, 1000)
  }

  const generateAIInsights = async (leadId: string, leadData: Lead) => {
    setLoading(true)
    try {
      // Simulate AI analysis
      const insights: AIInsight[] = []

      // Next action suggestion based on lead score and activity
      if (leadData.score > 70) {
        insights.push({
          id: Math.random().toString(36).substr(2, 9),
          leadId,
          type: 'next_action',
          title: 'High-Priority Lead - Immediate Action Recommended',
          description: 'This lead has a high score and recent activity. Schedule a personal call within 24 hours.',
          confidence: 92,
          actionable: true,
          suggestedActions: [
            'Schedule personal phone call',
            'Send personalized video message',
            'Invite to exclusive showroom tour'
          ],
          generatedAt: new Date(),
          isRead: false
        })
      }

      // Communication timing analysis
      const lastActivity = new Date(leadData.lastActivity)
      const daysSinceActivity = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysSinceActivity > 7) {
        insights.push({
          id: Math.random().toString(36).substr(2, 9),
          leadId,
          type: 'timing',
          title: 'Re-engagement Opportunity',
          description: `No activity for ${daysSinceActivity} days. Consider a re-engagement campaign.`,
          confidence: 75,
          actionable: true,
          suggestedActions: [
            'Send "We miss you" email',
            'Offer special incentive',
            'Share new inventory updates'
          ],
          generatedAt: new Date(),
          isRead: false
        })
      }

      // Content suggestion based on lead interests
      if (leadData.customFields?.budget) {
        insights.push({
          id: Math.random().toString(36).substr(2, 9),
          leadId,
          type: 'content_suggestion',
          title: 'Personalized Content Recommendation',
          description: `Based on budget range ${leadData.customFields.budget}, suggest specific RV models and financing options.`,
          confidence: 88,
          actionable: true,
          suggestedActions: [
            'Send budget-specific inventory',
            'Share financing calculator',
            'Provide trade-in valuation'
          ],
          generatedAt: new Date(),
          isRead: false
        })
      }

      setAiInsights(prev => [...prev.filter(i => i.leadId !== leadId), ...insights])
      return insights
    } finally {
      setLoading(false)
    }
  }

  const createEmailTemplate = async (templateData: Partial<EmailTemplate>) => {
    const template: EmailTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: templateData.name || '',
      subject: templateData.subject || '',
      body: templateData.body || '',
      type: templateData.type || 'custom',
      variables: templateData.variables || [],
      isActive: true,
      createdAt: new Date()
    }

    const updatedTemplates = [...emailTemplates, template]
    setEmailTemplates(updatedTemplates)
    saveToLocalStorage('renter-insight-email-templates', updatedTemplates)
    return template
  }

  const createSMSTemplate = async (templateData: Partial<SMSTemplate>) => {
    const template: SMSTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: templateData.name || '',
      message: templateData.message || '',
      type: templateData.type || 'custom',
      variables: templateData.variables || [],
      isActive: true,
      createdAt: new Date()
    }

    const updatedTemplates = [...smsTemplates, template]
    setSmsTemplates(updatedTemplates)
    saveToLocalStorage('renter-insight-sms-templates', updatedTemplates)
    return template
  }

  const createNurtureSequence = async (sequenceData: Partial<NurtureSequence>) => {
    const sequence: NurtureSequence = {
      id: Math.random().toString(36).substr(2, 9),
      name: sequenceData.name || '',
      description: sequenceData.description || '',
      triggerConditions: sequenceData.triggerConditions || [],
      steps: sequenceData.steps || [],
      isActive: true,
      targetAudience: sequenceData.targetAudience || '',
      createdBy: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updatedSequences = [...sequences, sequence]
    setSequences(updatedSequences)
    saveToLocalStorage('renter-insight-sequences', updatedSequences)
    return sequence
  }

  const updateNurtureSequence = async (sequenceId: string, sequenceData: Partial<NurtureSequence>) => {
    const updatedSequences = sequences.map(s => 
      s.id === sequenceId 
        ? { ...s, ...sequenceData, updatedAt: new Date() }
        : s
    )
    setSequences(updatedSequences)
    saveToLocalStorage('renter-insight-sequences', updatedSequences)
  }

  const updateEmailTemplate = async (templateId: string, templateData: Partial<EmailTemplate>) => {
    const updatedTemplates = emailTemplates.map(t => 
      t.id === templateId 
        ? { ...t, ...templateData }
        : t
    )
    setEmailTemplates(updatedTemplates)
    saveToLocalStorage('renter-insight-email-templates', updatedTemplates)
  }

  const updateSMSTemplate = async (templateId: string, templateData: Partial<SMSTemplate>) => {
    const updatedTemplates = smsTemplates.map(t => 
      t.id === templateId 
        ? { ...t, ...templateData }
        : t
    )
    setSmsTemplates(updatedTemplates)
    saveToLocalStorage('renter-insight-sms-templates', updatedTemplates)
  }

  const getEnrollmentsByLead = (leadId: string) => {
    return enrollments.filter(e => e.leadId === leadId)
  }

  const getCommunicationHistory = (leadId: string) => {
    return communicationLogs.filter(l => l.leadId === leadId)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
  }

  const getAIInsightsByLead = (leadId: string) => {
    return aiInsights.filter(i => i.leadId === leadId && !i.isRead)
  }

  const markInsightAsRead = async (insightId: string) => {
    setAiInsights(prev => prev.map(i => 
      i.id === insightId ? { ...i, isRead: true } : i
    ))
  }

  const pauseEnrollment = async (enrollmentId: string) => {
    setEnrollments(prev => prev.map(e => 
      e.id === enrollmentId ? { ...e, status: 'paused' } : e
    ))
  }

  const resumeEnrollment = async (enrollmentId: string) => {
    setEnrollments(prev => prev.map(e => 
      e.id === enrollmentId ? { ...e, status: 'active' } : e
    ))
  }

  return {
    sequences,
    enrollments,
    emailTemplates,
    smsTemplates,
    communicationLogs,
    aiInsights,
    automationRules,
    analytics,
    loading,
    enrollLeadInSequence,
    processNextStep,
    generateAIInsights,
    createEmailTemplate,
    createSMSTemplate,
    createNurtureSequence,
    updateNurtureSequence,
    updateEmailTemplate,
    updateSMSTemplate,
    getEnrollmentsByLead,
    getCommunicationHistory,
    getAIInsightsByLead,
    markInsightAsRead,
    pauseEnrollment,
    resumeEnrollment
  }
}