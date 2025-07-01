import { useState, useEffect } from 'react'
import { Lead, LeadStatus, LeadSource, LeadActivity, LeadScore, LeadReminder, SalesRep } from '../types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useLeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [sources, setSources] = useState<LeadSource[]>([])
  const [activities, setActivities] = useState<LeadActivity[]>([])
  const [scores, setScores] = useState<LeadScore[]>([])
  const [reminders, setReminders] = useState<LeadReminder[]>([])
  const [salesReps, setSalesReps] = useState<SalesRep[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data initialization
  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Mock lead sources
    const mockSources: LeadSource[] = [
      {
        id: '1',
        name: 'Website Contact Form',
        type: 'website',
        isActive: true,
        trackingCode: 'WEB_CONTACT',
        conversionRate: 15.5,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Facebook Ads',
        type: 'advertising',
        isActive: true,
        trackingCode: 'FB_ADS',
        conversionRate: 8.2,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '3',
        name: 'Customer Referral',
        type: 'referral',
        isActive: true,
        conversionRate: 35.8,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '4',
        name: 'RV Show',
        type: 'event',
        isActive: true,
        trackingCode: 'RV_SHOW_2024',
        conversionRate: 22.1,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '5',
        name: 'Google Ads',
        type: 'advertising',
        isActive: true,
        trackingCode: 'GOOGLE_ADS',
        conversionRate: 12.3,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '6',
        name: 'Walk-in',
        type: 'other',
        isActive: true,
        conversionRate: 45.2,
        createdAt: new Date('2024-01-01')
      }
    ]

    // Mock sales reps
    const mockReps: SalesRep[] = [
      {
        id: 'rep-001',
        name: 'John Smith',
        email: 'john.smith@dealership.com',
        phone: '(555) 123-4567',
        territory: 'North Region',
        isActive: true,
        targets: {
          monthly: 10,
          quarterly: 30,
          annual: 120
        }
      },
      {
        id: 'rep-002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@dealership.com',
        phone: '(555) 987-6543',
        territory: 'South Region',
        isActive: true,
        targets: {
          monthly: 12,
          quarterly: 36,
          annual: 144
        }
      },
      {
        id: 'rep-003',
        name: 'Mike Davis',
        email: 'mike.davis@dealership.com',
        phone: '(555) 456-7890',
        territory: 'East Region',
        isActive: true,
        targets: {
          monthly: 8,
          quarterly: 24,
          annual: 96
        }
      }
    ]

    // Load existing leads from localStorage or use mock data
    const mockLeads: Lead[] = loadFromLocalStorage('renter-insight-leads', [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        source: 'Website Contact Form',
        sourceId: '1',
        status: LeadStatus.NEW,
        assignedTo: 'rep-001',
        notes: 'Interested in Class A Motorhome, budget $150k-200k',
        score: 85,
        lastActivity: new Date('2024-01-20'),
        customFields: {
          budget: '$150k-200k',
          timeframe: '3-6 months',
          experience: 'First-time buyer'
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@email.com',
        phone: '(555) 987-6543',
        source: 'Customer Referral',
        sourceId: '3',
        status: LeadStatus.QUALIFIED,
        assignedTo: 'rep-002',
        notes: 'Looking for travel trailer under $50k, referred by Mike Davis',
        score: 92,
        lastActivity: new Date('2024-01-18'),
        customFields: {
          budget: 'Under $50k',
          timeframe: '1-3 months',
          experience: 'Experienced RVer'
        },
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-18')
      }
    ])

    // Load existing activities from localStorage or use mock data
    const mockActivities: LeadActivity[] = loadFromLocalStorage('renter-insight-activities', [
      {
        id: '1',
        leadId: '1',
        type: 'call',
        description: 'Initial qualification call',
        outcome: 'positive',
        duration: 25,
        completedDate: new Date('2024-01-20'),
        userId: 'rep-001',
        createdAt: new Date('2024-01-20')
      },
      {
        id: '2',
        leadId: '2',
        type: 'email',
        description: 'Sent product brochures',
        outcome: 'positive',
        completedDate: new Date('2024-01-18'),
        userId: 'rep-002',
        createdAt: new Date('2024-01-18')
      }
    ])

    // Mock scores
    const mockScores: LeadScore[] = [
      {
        leadId: '1',
        totalScore: 85,
        demographicScore: 30,
        behaviorScore: 25,
        engagementScore: 30,
        lastCalculated: new Date('2024-01-20'),
        factors: [
          { factor: 'Budget Match', points: 25, reason: 'Budget aligns with inventory' },
          { factor: 'Response Time', points: 20, reason: 'Quick response to outreach' },
          { factor: 'Engagement Level', points: 15, reason: 'High email open rates' }
        ]
      }
    ]

    // Mock reminders
    const mockReminders: LeadReminder[] = [
      {
        id: '1',
        leadId: '1',
        userId: 'rep-001',
        type: 'follow_up',
        title: 'Follow up on motorhome interest',
        description: 'Schedule showroom visit',
        dueDate: new Date('2024-01-25'),
        isCompleted: false,
        priority: 'high',
        createdAt: new Date('2024-01-20')
      }
    ]

    setSources(mockSources)
    setSalesReps(mockReps)
    setLeads(mockLeads)
    setActivities(mockActivities)
    setScores(mockScores)
    setReminders(mockReminders)
  }

  const saveLeadsToStorage = (updatedLeads: Lead[]) => {
    saveToLocalStorage('renter-insight-leads', updatedLeads)
  }

  const saveActivitiesToStorage = (updatedActivities: LeadActivity[]) => {
    saveToLocalStorage('renter-insight-activities', updatedActivities)
  }

  const createLead = async (leadData: Partial<Lead>) => {
    setLoading(true)
    try {
      const newLead: Lead = {
        id: Math.random().toString(36).substr(2, 9),
        firstName: leadData.firstName || '',
        lastName: leadData.lastName || '',
        email: leadData.email || '',
        phone: leadData.phone || '',
        source: leadData.source || '',
        sourceId: leadData.sourceId || '',
        status: LeadStatus.NEW,
        assignedTo: leadData.assignedTo,
        notes: leadData.notes || '',
        score: 0,
        lastActivity: new Date(),
        customFields: leadData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const updatedLeads = [...leads, newLead]
      setLeads(updatedLeads)
      saveLeadsToStorage(updatedLeads)
      
      // Log initial activity
      await logActivity({
        leadId: newLead.id,
        type: 'note',
        description: `Lead created from ${newLead.source}`,
        userId: 'current-user'
      })
      
      // Calculate initial score
      await calculateLeadScore(newLead.id)
      
      return newLead
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status, updatedAt: new Date() }
        : lead
    )
    setLeads(updatedLeads)
    saveLeadsToStorage(updatedLeads)

    // Log activity
    await logActivity({
      leadId,
      type: 'status_change',
      description: `Status changed to ${status}`,
      userId: 'current-user'
    })
  }

  const assignLead = async (leadId: string, repId: string) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, assignedTo: repId, updatedAt: new Date() }
        : lead
    )
    setLeads(updatedLeads)
    saveLeadsToStorage(updatedLeads)

    await logActivity({
      leadId,
      type: 'note',
      description: `Lead assigned to ${salesReps.find(r => r.id === repId)?.name}`,
      userId: 'current-user'
    })
  }

  const logActivity = async (activityData: Partial<LeadActivity>) => {
    const newActivity: LeadActivity = {
      id: Math.random().toString(36).substr(2, 9),
      leadId: activityData.leadId || '',
      type: activityData.type || 'note',
      description: activityData.description || '',
      outcome: activityData.outcome,
      duration: activityData.duration,
      scheduledDate: activityData.scheduledDate,
      completedDate: activityData.completedDate || new Date(),
      userId: activityData.userId || 'current-user',
      metadata: activityData.metadata,
      createdAt: new Date()
    }

    const updatedActivities = [...activities, newActivity]
    setActivities(updatedActivities)
    saveActivitiesToStorage(updatedActivities)

    // Update lead's last activity
    const updatedLeads = leads.map(lead => 
      lead.id === newActivity.leadId 
        ? { ...lead, lastActivity: new Date(), updatedAt: new Date() }
        : lead
    )
    setLeads(updatedLeads)
    saveLeadsToStorage(updatedLeads)

    // Recalculate score
    await calculateLeadScore(newActivity.leadId)
  }

  const calculateLeadScore = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
    if (!lead) return

    const leadActivities = activities.filter(a => a.leadId === leadId)
    
    let demographicScore = 0
    let behaviorScore = 0
    let engagementScore = 0
    const factors: ScoreFactor[] = []

    // Demographic scoring
    if (lead.customFields?.budget) {
      demographicScore += 20
      factors.push({ factor: 'Budget Provided', points: 20, reason: 'Customer provided budget information' })
    }

    if (lead.customFields?.timeframe === '1-3 months') {
      demographicScore += 25
      factors.push({ factor: 'Short Timeframe', points: 25, reason: 'Ready to purchase soon' })
    } else if (lead.customFields?.timeframe === '3-6 months') {
      demographicScore += 15
      factors.push({ factor: 'Medium Timeframe', points: 15, reason: 'Moderate purchase timeline' })
    }

    // Behavior scoring
    const callActivities = leadActivities.filter(a => a.type === 'call')
    if (callActivities.length > 0) {
      behaviorScore += 30
      factors.push({ factor: 'Phone Engagement', points: 30, reason: 'Participated in phone calls' })
    }

    const emailActivities = leadActivities.filter(a => a.type === 'email')
    if (emailActivities.length > 2) {
      behaviorScore += 20
      factors.push({ factor: 'Email Engagement', points: 20, reason: 'Active email communication' })
    }

    // Engagement scoring
    const recentActivities = leadActivities.filter(a => 
      new Date(a.createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
    )
    if (recentActivities.length > 0) {
      engagementScore += 25
      factors.push({ factor: 'Recent Activity', points: 25, reason: 'Active in the last 7 days' })
    }

    const positiveOutcomes = leadActivities.filter(a => a.outcome === 'positive').length
    if (positiveOutcomes > 0) {
      engagementScore += positiveOutcomes * 10
      factors.push({ factor: 'Positive Interactions', points: positiveOutcomes * 10, reason: `${positiveOutcomes} positive interactions` })
    }

    const totalScore = demographicScore + behaviorScore + engagementScore

    const newScore: LeadScore = {
      leadId,
      totalScore,
      demographicScore,
      behaviorScore,
      engagementScore,
      lastCalculated: new Date(),
      factors
    }

    setScores(prev => prev.filter(s => s.leadId !== leadId).concat(newScore))
    
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, score: totalScore, updatedAt: new Date() }
        : lead
    )
    setLeads(updatedLeads)
    saveLeadsToStorage(updatedLeads)
  }

  const createReminder = async (reminderData: Partial<LeadReminder>) => {
    const newReminder: LeadReminder = {
      id: Math.random().toString(36).substr(2, 9),
      leadId: reminderData.leadId || '',
      userId: reminderData.userId || 'current-user',
      type: reminderData.type || 'follow_up',
      title: reminderData.title || '',
      description: reminderData.description || '',
      dueDate: reminderData.dueDate || new Date(),
      isCompleted: false,
      priority: reminderData.priority || 'medium',
      createdAt: new Date()
    }

    setReminders(prev => [...prev, newReminder])
    return newReminder
  }

  const completeReminder = async (reminderId: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, isCompleted: true }
        : reminder
    ))
  }

  const getLeadsByRep = (repId: string) => {
    return leads.filter(lead => lead.assignedTo === repId)
  }

  const getActivitiesByLead = (leadId: string) => {
    return activities.filter(activity => activity.leadId === leadId)
  }

  const getRemindersByUser = (userId: string) => {
    return reminders.filter(reminder => reminder.userId === userId && !reminder.isCompleted)
  }

  const getLeadScore = (leadId: string) => {
    return scores.find(score => score.leadId === leadId)
  }

  return {
    leads,
    sources,
    activities,
    scores,
    reminders,
    salesReps,
    loading,
    createLead,
    updateLeadStatus,
    assignLead,
    logActivity,
    calculateLeadScore,
    createReminder,
    completeReminder,
    getLeadsByRep,
    getActivitiesByLead,
    getRemindersByUser,
    getLeadScore
  }
}

interface ScoreFactor {
  factor: string
  points: number
  reason: string
}