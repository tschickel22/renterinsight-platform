import { useState, useEffect } from 'react'
import { Deal, DealStage, DealStatus, DealStageHistory, Territory, ApprovalWorkflow, WinLossReport, DealMetrics } from '../types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useDealManagement() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [territories, setTerritories] = useState<Territory[]>([])
  const [approvalWorkflows, setApprovalWorkflows] = useState<ApprovalWorkflow[]>([])
  const [winLossReports, setWinLossReports] = useState<WinLossReport[]>([])
  const [stageHistory, setStageHistory] = useState<DealStageHistory[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Load existing data from localStorage or use mock data
    const savedDeals = loadFromLocalStorage('renter-insight-deals', [
      {
        id: '1',
        name: 'Georgetown Class A Sale - Smith Family',
        customerId: 'cust-001',
        customerName: 'John & Mary Smith',
        stage: DealStage.PROPOSAL,
        status: DealStatus.ACTIVE,
        priority: 'high',
        value: 145000,
        probability: 75,
        expectedCloseDate: new Date('2024-02-15'),
        assignedTo: 'rep-001',
        territoryId: 'territory-001',
        sourceId: 'source-001',
        competitorIds: ['comp-001'],
        products: [
          {
            id: '1',
            productId: 'prod-001',
            productName: '2024 Forest River Georgetown',
            quantity: 1,
            unitPrice: 125000,
            discount: 5000,
            total: 120000
          },
          {
            id: '2',
            productId: 'prod-002',
            productName: 'Extended Warranty Package',
            quantity: 1,
            unitPrice: 3500,
            discount: 0,
            total: 3500
          }
        ],
        stageHistory: [],
        notes: 'Customer very interested, financing pre-approved',
        requiresApproval: true,
        approvalStatus: 'pending',
        customFields: {
          tradeInValue: 25000,
          financingType: 'bank_loan'
        },
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        name: 'Travel Trailer - Johnson Family',
        customerId: 'cust-002',
        customerName: 'Sarah Johnson',
        stage: DealStage.NEGOTIATION,
        status: DealStatus.ACTIVE,
        priority: 'medium',
        value: 75000,
        probability: 85,
        expectedCloseDate: new Date('2024-02-10'),
        assignedTo: 'rep-002',
        territoryId: 'territory-002',
        competitorIds: [],
        products: [
          {
            id: '3',
            productId: 'prod-003',
            productName: '2024 Airstream Flying Cloud',
            quantity: 1,
            unitPrice: 75000,
            discount: 2000,
            total: 73000
          }
        ],
        stageHistory: [],
        notes: 'Ready to close, just finalizing delivery details',
        requiresApproval: false,
        customFields: {},
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-18')
      }
    ])

    const savedTerritories = loadFromLocalStorage('renter-insight-territories', [
      {
        id: 'territory-001',
        name: 'North Region',
        type: 'geographic',
        description: 'Northern states territory',
        assignedTo: ['rep-001', 'rep-003'],
        rules: [
          {
            id: '1',
            field: 'state',
            operator: 'in_range',
            value: ['IL', 'WI', 'MN', 'IA'],
            priority: 1
          }
        ],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'territory-002',
        name: 'South Region',
        type: 'geographic',
        description: 'Southern states territory',
        assignedTo: ['rep-002'],
        rules: [
          {
            id: '2',
            field: 'state',
            operator: 'in_range',
            value: ['TX', 'FL', 'GA', 'NC'],
            priority: 1
          }
        ],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ])

    const savedStageHistory = loadFromLocalStorage('renter-insight-stage-history', [
      {
        id: '1',
        dealId: '1',
        fromStage: DealStage.QUALIFICATION,
        toStage: DealStage.NEEDS_ANALYSIS,
        changedBy: 'rep-001',
        changedAt: new Date('2024-01-12'),
        duration: 48,
        notes: 'Customer qualified, moving to needs analysis'
      },
      {
        id: '2',
        dealId: '1',
        fromStage: DealStage.NEEDS_ANALYSIS,
        toStage: DealStage.PROPOSAL,
        changedBy: 'rep-001',
        changedAt: new Date('2024-01-18'),
        duration: 144,
        notes: 'Proposal prepared and presented'
      }
    ])

    setDeals(savedDeals)
    setTerritories(savedTerritories)
    setStageHistory(savedStageHistory)
  }

  const saveDealsToStorage = (updatedDeals: Deal[]) => {
    saveToLocalStorage('renter-insight-deals', updatedDeals)
  }

  const saveStageHistoryToStorage = (updatedHistory: DealStageHistory[]) => {
    saveToLocalStorage('renter-insight-stage-history', updatedHistory)
  }

  const createDeal = async (dealData: Partial<Deal>) => {
    setLoading(true)
    try {
      const newDeal: Deal = {
        id: Math.random().toString(36).substr(2, 9),
        name: dealData.name || '',
        customerId: dealData.customerId || '',
        customerName: dealData.customerName || '',
        stage: DealStage.PROSPECTING,
        status: DealStatus.ACTIVE,
        priority: dealData.priority || 'medium',
        value: dealData.value || 0,
        probability: 10, // Default probability for prospecting stage
        expectedCloseDate: dealData.expectedCloseDate || new Date(),
        assignedTo: dealData.assignedTo || '',
        territoryId: dealData.territoryId || '',
        sourceId: dealData.sourceId,
        competitorIds: dealData.competitorIds || [],
        products: dealData.products || [],
        stageHistory: [],
        notes: dealData.notes || '',
        requiresApproval: (dealData.value || 0) > 100000, // Configurable threshold
        customFields: dealData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedDeals = [...deals, newDeal]
      setDeals(updatedDeals)
      saveDealsToStorage(updatedDeals)

      // Log initial stage
      await logStageChange(newDeal.id, undefined, DealStage.PROSPECTING, 'system')

      return newDeal
    } finally {
      setLoading(false)
    }
  }

  const updateDealStage = async (dealId: string, newStage: DealStage, notes?: string) => {
    const deal = deals.find(d => d.id === dealId)
    if (!deal) return
    
    const oldStage = deal.stage
    const probability = getStageProbability(newStage)
    const status = newStage === DealStage.CLOSED_WON ? DealStatus.WON : 
                   newStage === DealStage.CLOSED_LOST ? DealStatus.LOST : 
                   DealStatus.ACTIVE
    const actualCloseDate = (newStage === DealStage.CLOSED_WON || newStage === DealStage.CLOSED_LOST) ? new Date() : undefined
    
    // Update deal
    const updatedDeals = deals.map(d => 
      d.id === dealId 
        ? { 
            ...d, 
            stage: newStage, 
            probability,
            status,
            actualCloseDate,
            updatedAt: new Date() 
          }
        : d
    )
    setDeals(updatedDeals)
    saveDealsToStorage(updatedDeals)

    // Log stage change
    await logStageChange(dealId, oldStage, newStage, 'current-user', notes || `Stage changed from ${oldStage?.replace('_', ' ') || 'none'} to ${newStage.replace('_', ' ')}`)
    
    return updatedDeals.find(d => d.id === dealId)
  }

  const logStageChange = async (dealId: string, fromStage: DealStage | undefined, toStage: DealStage, changedBy: string, notes?: string) => {
    const duration = fromStage ? calculateStageDuration(dealId, fromStage) : undefined
    
    const stageChange: DealStageHistory = {
      id: Math.random().toString(36).substr(2, 9),
      dealId,
      fromStage,
      toStage,
      changedBy,
      changedAt: new Date(),
      duration,
      notes
    }

    const updatedHistory = [...stageHistory, stageChange]
    setStageHistory(updatedHistory)
    saveStageHistoryToStorage(updatedHistory)
  }

  const calculateStageDuration = (dealId: string, stage: DealStage): number => {
    const dealHistory = stageHistory.filter(h => h.dealId === dealId)
    const stageEntry = dealHistory.find(h => h.toStage === stage)
    
    if (stageEntry) {
      const hours = Math.floor((Date.now() - stageEntry.changedAt.getTime()) / (1000 * 60 * 60))
      return hours
    }
    return 0
  }

  const getStageProbability = (stage: DealStage): number => {
    switch (stage) {
      case DealStage.PROSPECTING: return 10
      case DealStage.QUALIFICATION: return 25
      case DealStage.NEEDS_ANALYSIS: return 40
      case DealStage.PROPOSAL: return 60
      case DealStage.NEGOTIATION: return 80
      case DealStage.CLOSED_WON: return 100
      case DealStage.CLOSED_LOST: return 0
      default: return 10
    }
  }

  const assignTerritory = async (dealId: string, customerId: string) => {
    // Simple territory assignment logic - in real app would be more sophisticated
    const territory = territories.find(t => t.isActive)
    if (territory) {
      const updatedDeals = deals.map(d => 
        d.id === dealId 
          ? { ...d, territoryId: territory.id, updatedAt: new Date() }
          : d
      )
      setDeals(updatedDeals)
      saveDealsToStorage(updatedDeals)
    }
  }

  const createApprovalWorkflow = async (dealId: string, workflowType: string) => {
    const workflow: ApprovalWorkflow = {
      id: Math.random().toString(36).substr(2, 9),
      dealId,
      workflowType: workflowType as any,
      currentStep: 1,
      totalSteps: 2,
      steps: [
        {
          id: '1',
          stepNumber: 1,
          approverRole: 'sales_manager',
          approverIds: ['manager-001'],
          requiredApprovals: 1,
          currentApprovals: [],
          status: 'pending'
        },
        {
          id: '2',
          stepNumber: 2,
          approverRole: 'sales_director',
          approverIds: ['director-001'],
          requiredApprovals: 1,
          currentApprovals: [],
          status: 'pending'
        }
      ],
      status: 'pending',
      requestedBy: 'current-user',
      requestedAt: new Date()
    }

    setApprovalWorkflows(prev => [...prev, workflow])
    return workflow
  }

  const createWinLossReport = async (dealId: string, outcome: 'won' | 'lost', reportData: Partial<WinLossReport>) => {
    const report: WinLossReport = {
      id: Math.random().toString(36).substr(2, 9),
      dealId,
      outcome,
      primaryReason: reportData.primaryReason || '',
      secondaryReasons: reportData.secondaryReasons || [],
      competitorWon: reportData.competitorWon,
      feedback: reportData.feedback || '',
      lessonsLearned: reportData.lessonsLearned || [],
      actionItems: reportData.actionItems || [],
      reportedBy: 'current-user',
      reportedAt: new Date()
    }

    setWinLossReports(prev => [...prev, report])
    return report
  }

  const getDealMetrics = (): DealMetrics => {
    const totalDeals = deals.length
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)
    const wonDeals = deals.filter(d => d.status === DealStatus.WON).length
    const wonValue = deals.filter(d => d.status === DealStatus.WON).reduce((sum, deal) => sum + deal.value, 0)
    const lostDeals = deals.filter(d => d.status === DealStatus.LOST).length
    const lostValue = deals.filter(d => d.status === DealStatus.LOST).reduce((sum, deal) => sum + deal.value, 0)
    const winRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0
    const averageDealSize = totalDeals > 0 ? totalValue / totalDeals : 0
    const averageSalesCycle = calculateAverageSalesCycle()

    return {
      totalDeals,
      totalValue,
      wonDeals,
      wonValue,
      lostDeals,
      lostValue,
      winRate,
      averageDealSize,
      averageSalesCycle,
      conversionRates: calculateConversionRates()
    }
  }

  const calculateAverageSalesCycle = (): number => {
    const closedDeals = deals.filter(d => d.actualCloseDate)
    if (closedDeals.length === 0) return 0

    const totalDays = closedDeals.reduce((sum, deal) => {
      const closeDate = new Date(deal.actualCloseDate!)
      const createdDate = new Date(deal.createdAt)
      
      const closeTime = !isNaN(closeDate.getTime()) ? closeDate.getTime() : 0
      const createdTime = !isNaN(createdDate.getTime()) ? createdDate.getTime() : 0
      
      const days = closeTime && createdTime 
        ? Math.floor((closeTime - createdTime) / (1000 * 60 * 60 * 24))
        : 0
      return sum + days
    }, 0)

    return totalDays / closedDeals.length
  }

  const calculateConversionRates = () => {
    // Simplified conversion rate calculation
    return [
      { fromStage: DealStage.PROSPECTING, toStage: DealStage.QUALIFICATION, rate: 65, averageDuration: 72 },
      { fromStage: DealStage.QUALIFICATION, toStage: DealStage.NEEDS_ANALYSIS, rate: 75, averageDuration: 48 },
      { fromStage: DealStage.NEEDS_ANALYSIS, toStage: DealStage.PROPOSAL, rate: 80, averageDuration: 96 },
      { fromStage: DealStage.PROPOSAL, toStage: DealStage.NEGOTIATION, rate: 70, averageDuration: 120 },
      { fromStage: DealStage.NEGOTIATION, toStage: DealStage.CLOSED_WON, rate: 85, averageDuration: 168 }
    ]
  }

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage)
  }

  const getDealsByTerritory = (territoryId: string) => {
    return deals.filter(deal => deal.territoryId === territoryId)
  }

  const getDealsByRep = (repId: string) => {
    return deals.filter(deal => deal.assignedTo === repId)
  }

  const getStageHistory = (dealId: string) => {
    return stageHistory.filter(h => h.dealId === dealId).sort((a, b) => 
      new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
    )
  }

  return {
    deals,
    territories,
    approvalWorkflows,
    winLossReports,
    stageHistory,
    loading,
    createDeal,
    updateDealStage,
    assignTerritory,
    createApprovalWorkflow,
    createWinLossReport,
    getDealMetrics,
    getDealsByStage,
    getDealsByTerritory,
    getDealsByRep,
    getStageHistory
  }
}