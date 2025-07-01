import { useState, useEffect } from 'react'
import { Commission, CommissionStatus, CommissionType } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { CommissionRule, FlatCommissionRule, PercentageCommissionRule, TieredCommissionRule, CommissionAuditEntry, CommissionReportFilters, CommissionReportSummary } from '../types'

export function useCommissionManagement() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [rules, setRules] = useState<CommissionRule[]>([])
  const [auditTrail, setAuditTrail] = useState<CommissionAuditEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Load existing commissions from localStorage or use mock data
    const savedCommissions = loadFromLocalStorage('renter-insight-commissions', [
      {
        id: '1',
        salesPersonId: 'sales-001',
        dealId: 'deal-001',
        type: CommissionType.PERCENTAGE,
        rate: 0.05,
        amount: 6875,
        status: CommissionStatus.APPROVED,
        paidDate: new Date('2024-01-20'),
        notes: 'Commission for Georgetown sale',
        customFields: {},
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        salesPersonId: 'sales-002',
        dealId: 'deal-002',
        type: CommissionType.FLAT,
        rate: 0,
        amount: 2500,
        status: CommissionStatus.PENDING,
        notes: 'Flat commission for service contract',
        customFields: {},
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      }
    ])

    // Load existing rules from localStorage or use mock data
    const savedRules = loadFromLocalStorage('renter-insight-commission-rules', [
      {
        id: '1',
        name: 'Standard Sales Commission',
        type: 'percentage',
        rate: 0.05,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Service Contract Bonus',
        type: 'flat',
        amount: 500,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '3',
        name: 'Tiered Sales Commission',
        type: 'tiered',
        tiers: [
          { id: '1', ruleId: '3', minAmount: 0, maxAmount: 50000, rate: 0.03 },
          { id: '2', ruleId: '3', minAmount: 50000, maxAmount: 100000, rate: 0.05 },
          { id: '3', ruleId: '3', minAmount: 100000, rate: 0.07 }
        ],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ])

    // Load existing audit trail from localStorage or use mock data
    const savedAuditTrail = loadFromLocalStorage('renter-insight-commission-audit', [
      {
        id: '1',
        commissionId: '1',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'created',
        newValue: {
          salesPersonId: 'sales-001',
          dealId: 'deal-001',
          type: CommissionType.PERCENTAGE,
          rate: 0.05,
          amount: 6875,
          status: CommissionStatus.PENDING
        },
        timestamp: new Date('2024-01-18')
      },
      {
        id: '2',
        commissionId: '1',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'approved',
        previousValue: { status: CommissionStatus.PENDING },
        newValue: { status: CommissionStatus.APPROVED },
        notes: 'Approved after deal verification',
        timestamp: new Date('2024-01-19')
      }
    ])

    setCommissions(savedCommissions)
    setRules(savedRules)
    setAuditTrail(savedAuditTrail)
  }

  const saveCommissionsToStorage = (updatedCommissions: Commission[]) => {
    saveToLocalStorage('renter-insight-commissions', updatedCommissions)
  }

  const saveRulesToStorage = (updatedRules: CommissionRule[]) => {
    saveToLocalStorage('renter-insight-commission-rules', updatedRules)
  }

  const saveAuditTrailToStorage = (updatedAuditTrail: CommissionAuditEntry[]) => {
    saveToLocalStorage('renter-insight-commission-audit', updatedAuditTrail)
  }

  const getCommissionsBySalesPerson = (salesPersonId: string) => {
    return commissions.filter(commission => commission.salesPersonId === salesPersonId)
  }

  const getCommissionsByDeal = (dealId: string) => {
    return commissions.filter(commission => commission.dealId === dealId)
  }

  const getCommissionById = (commissionId: string) => {
    return commissions.find(commission => commission.id === commissionId)
  }

  const getRuleById = (ruleId: string) => {
    return rules.find(rule => rule.id === ruleId)
  }

  const getAuditTrailByCommission = (commissionId: string) => {
    return auditTrail.filter(entry => entry.commissionId === commissionId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  const createCommission = async (commissionData: Partial<Commission>, userId: string, userName: string) => {
    setLoading(true)
    try {
      const newCommission: Commission = {
        id: Math.random().toString(36).substr(2, 9),
        salesPersonId: commissionData.salesPersonId || '',
        dealId: commissionData.dealId || '',
        type: commissionData.type || CommissionType.PERCENTAGE,
        rate: commissionData.rate || 0,
        amount: commissionData.amount || 0,
        status: CommissionStatus.PENDING,
        notes: commissionData.notes || '',
        customFields: commissionData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedCommissions = [...commissions, newCommission]
      setCommissions(updatedCommissions)
      saveCommissionsToStorage(updatedCommissions)

      // Add audit entry
      const auditEntry: CommissionAuditEntry = {
        id: Math.random().toString(36).substr(2, 9),
        commissionId: newCommission.id,
        userId,
        userName,
        action: 'created',
        newValue: { ...newCommission },
        timestamp: new Date()
      }

      const updatedAuditTrail = [...auditTrail, auditEntry]
      setAuditTrail(updatedAuditTrail)
      saveAuditTrailToStorage(updatedAuditTrail)

      return newCommission
    } finally {
      setLoading(false)
    }
  }

  const updateCommission = async (commissionId: string, updates: Partial<Commission>, userId: string, userName: string, notes?: string) => {
    const commission = commissions.find(c => c.id === commissionId)
    if (!commission) return null

    const updatedCommission = {
      ...commission,
      ...updates,
      updatedAt: new Date()
    }

    const updatedCommissions = commissions.map(c => 
      c.id === commissionId ? updatedCommission : c
    )

    setCommissions(updatedCommissions)
    saveCommissionsToStorage(updatedCommissions)

    // Add audit entry
    const auditEntry: CommissionAuditEntry = {
      id: Math.random().toString(36).substr(2, 9),
      commissionId,
      userId,
      userName,
      action: 'updated',
      previousValue: { ...commission },
      newValue: updates,
      notes,
      timestamp: new Date()
    }

    const updatedAuditTrail = [...auditTrail, auditEntry]
    setAuditTrail(updatedAuditTrail)
    saveAuditTrailToStorage(updatedAuditTrail)

    return updatedCommission
  }

  const approveCommission = async (commissionId: string, userId: string, userName: string, notes?: string) => {
    return updateCommission(
      commissionId, 
      { status: CommissionStatus.APPROVED }, 
      userId, 
      userName, 
      notes
    )
  }

  const rejectCommission = async (commissionId: string, userId: string, userName: string, notes?: string) => {
    return updateCommission(
      commissionId, 
      { status: CommissionStatus.CANCELLED }, 
      userId, 
      userName, 
      notes
    )
  }

  const markCommissionPaid = async (commissionId: string, userId: string, userName: string, notes?: string) => {
    return updateCommission(
      commissionId, 
      { 
        status: CommissionStatus.PAID,
        paidDate: new Date()
      }, 
      userId, 
      userName, 
      notes
    )
  }

  const createRule = async (ruleData: Partial<CommissionRule>) => {
    setLoading(true)
    try {
      let newRule: CommissionRule

      switch (ruleData.type) {
        case 'flat':
          newRule = {
            id: Math.random().toString(36).substr(2, 9),
            name: ruleData.name || '',
            type: 'flat',
            amount: (ruleData as Partial<FlatCommissionRule>).amount || 0,
            isActive: ruleData.isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date()
          } as FlatCommissionRule
          break
        
        case 'percentage':
          newRule = {
            id: Math.random().toString(36).substr(2, 9),
            name: ruleData.name || '',
            type: 'percentage',
            rate: (ruleData as Partial<PercentageCommissionRule>).rate || 0,
            isActive: ruleData.isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date()
          } as PercentageCommissionRule
          break
        
        case 'tiered':
          newRule = {
            id: Math.random().toString(36).substr(2, 9),
            name: ruleData.name || '',
            type: 'tiered',
            tiers: (ruleData as Partial<TieredCommissionRule>).tiers || [],
            isActive: ruleData.isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date()
          } as TieredCommissionRule
          break
        
        default:
          throw new Error('Invalid commission rule type')
      }

      const updatedRules = [...rules, newRule]
      setRules(updatedRules)
      saveRulesToStorage(updatedRules)

      return newRule
    } finally {
      setLoading(false)
    }
  }

  const updateRule = async (ruleId: string, updates: Partial<CommissionRule>) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) return null

    const updatedRule = {
      ...rule,
      ...updates,
      updatedAt: new Date()
    }

    const updatedRules = rules.map(r => 
      r.id === ruleId ? updatedRule : r
    )

    setRules(updatedRules)
    saveRulesToStorage(updatedRules)

    return updatedRule
  }

  const deleteRule = async (ruleId: string) => {
    const updatedRules = rules.filter(r => r.id !== ruleId)
    setRules(updatedRules)
    saveRulesToStorage(updatedRules)
  }

  const calculateCommission = (dealAmount: number, ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) return 0

    switch (rule.type) {
      case 'flat':
        return (rule as FlatCommissionRule).amount
      
      case 'percentage':
        return dealAmount * (rule as PercentageCommissionRule).rate
      
      case 'tiered':
        const tiers = (rule as TieredCommissionRule).tiers
        const applicableTier = tiers.find(tier => 
          dealAmount >= tier.minAmount && 
          (tier.maxAmount === undefined || dealAmount < tier.maxAmount)
        )
        return applicableTier ? dealAmount * applicableTier.rate : 0
      
      default:
        return 0
    }
  }

  const generateCommissionReport = (filters: CommissionReportFilters): {
    commissions: Commission[],
    summary: CommissionReportSummary
  } => {
    let filteredCommissions = [...commissions]

    // Apply filters
    if (filters.startDate) {
      filteredCommissions = filteredCommissions.filter(c => 
        new Date(c.createdAt) >= new Date(filters.startDate!)
      )
    }

    if (filters.endDate) {
      filteredCommissions = filteredCommissions.filter(c => 
        new Date(c.createdAt) <= new Date(filters.endDate!)
      )
    }

    if (filters.salesPersonId) {
      filteredCommissions = filteredCommissions.filter(c => 
        c.salesPersonId === filters.salesPersonId
      )
    }

    if (filters.status) {
      filteredCommissions = filteredCommissions.filter(c => 
        c.status === filters.status
      )
    }

    if (filters.type) {
      filteredCommissions = filteredCommissions.filter(c => 
        c.type === filters.type
      )
    }

    // Calculate summary
    const summary: CommissionReportSummary = {
      totalCommissions: filteredCommissions.length,
      totalAmount: filteredCommissions.reduce((sum, c) => sum + c.amount, 0),
      pendingAmount: filteredCommissions.filter(c => c.status === CommissionStatus.PENDING)
        .reduce((sum, c) => sum + c.amount, 0),
      approvedAmount: filteredCommissions.filter(c => c.status === CommissionStatus.APPROVED)
        .reduce((sum, c) => sum + c.amount, 0),
      paidAmount: filteredCommissions.filter(c => c.status === CommissionStatus.PAID)
        .reduce((sum, c) => sum + c.amount, 0),
      byType: {
        flat: filteredCommissions.filter(c => c.type === CommissionType.FLAT)
          .reduce((sum, c) => sum + c.amount, 0),
        percentage: filteredCommissions.filter(c => c.type === CommissionType.PERCENTAGE)
          .reduce((sum, c) => sum + c.amount, 0),
        tiered: filteredCommissions.filter(c => c.type === CommissionType.TIERED)
          .reduce((sum, c) => sum + c.amount, 0)
      }
    }

    return {
      commissions: filteredCommissions,
      summary
    }
  }

  const exportCommissionsToCSV = (commissions: Commission[]) => {
    const headers = [
      'ID', 
      'Sales Person', 
      'Deal ID', 
      'Type', 
      'Rate', 
      'Amount', 
      'Status', 
      'Paid Date', 
      'Notes', 
      'Created At'
    ]

    const rows = commissions.map(c => [
      c.id,
      c.salesPersonId,
      c.dealId,
      c.type,
      c.rate,
      c.amount,
      c.status,
      c.paidDate ? c.paidDate.toISOString() : '',
      c.notes,
      c.createdAt.toISOString()
    ])

    return [headers, ...rows]
  }

  return {
    commissions,
    rules,
    auditTrail,
    loading,
    getCommissionsBySalesPerson,
    getCommissionsByDeal,
    getCommissionById,
    getRuleById,
    getAuditTrailByCommission,
    createCommission,
    updateCommission,
    approveCommission,
    rejectCommission,
    markCommissionPaid,
    createRule,
    updateRule,
    deleteRule,
    calculateCommission,
    generateCommissionReport,
    exportCommissionsToCSV
  }
}