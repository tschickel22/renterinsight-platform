import { useState, useEffect } from 'react'
import { Commission, CommissionStatus, CommissionType } from '../types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { CommissionRule } from '../components/CommissionRuleForm'
import { AuditEntry } from '../components/AuditTrailCard'

export function useCommissionManagement() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [rules, setRules] = useState<CommissionRule[]>([])
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Load existing data from localStorage or use mock data
    const savedCommissions = loadFromLocalStorage('renter-insight-commissions', [
      {
        id: 'comm-001',
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
        id: 'comm-002',
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
      },
      {
        id: 'comm-003',
        salesPersonId: 'sales-001',
        dealId: 'deal-003',
        type: CommissionType.TIERED,
        rate: 0,
        amount: 8750,
        status: CommissionStatus.PENDING,
        notes: 'Tiered commission based on deal value',
        customFields: {},
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-15')
      }
    ])

    const savedRules = loadFromLocalStorage('renter-insight-commission-rules', [
      {
        id: '1',
        name: 'Standard Percentage Commission',
        type: CommissionType.PERCENTAGE,
        description: 'Standard percentage-based commission for all sales',
        percentageRate: 5,
        isActive: true,
        appliesTo: ['all'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Flat Rate Commission',
        type: CommissionType.FLAT,
        description: 'Flat commission for service contracts',
        flatAmount: 2500,
        isActive: true,
        appliesTo: ['service'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '3',
        name: 'Tiered Commission Structure',
        type: CommissionType.TIERED,
        description: 'Tiered commission structure based on deal value',
        tiers: [
          {
            id: '3-1',
            minAmount: 0,
            maxAmount: 50000,
            rate: 3,
            isPercentage: true
          },
          {
            id: '3-2',
            minAmount: 50000,
            maxAmount: 100000,
            rate: 5,
            isPercentage: true
          },
          {
            id: '3-3',
            minAmount: 100000,
            maxAmount: null,
            rate: 7,
            isPercentage: true
          }
        ],
        isActive: true,
        appliesTo: ['new'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ])

    const savedAuditTrail = loadFromLocalStorage('renter-insight-commission-audit', [
      {
        id: '1',
        dealId: 'deal-001',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        description: 'Created commission for deal #deal-001',
        timestamp: new Date('2024-01-18'),
      },
      {
        id: '2',
        dealId: 'deal-001',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'update',
        description: 'Updated commission status to APPROVED',
        oldValue: 'PENDING',
        newValue: 'APPROVED',
        timestamp: new Date('2024-01-20'),
      },
      {
        id: '3',
        dealId: 'deal-002',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        description: 'Created commission for deal #deal-002',
        timestamp: new Date('2024-01-15'),
      },
      {
        id: '4',
        dealId: 'deal-003',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'manual_note',
        description: 'Added note about tiered commission calculation',
        timestamp: new Date('2024-01-22'),
        notes: 'This commission was calculated using the tiered structure with a deal value of $125,000, falling into the highest tier at 7%'
      }
    ])

    // Mock sales reps
    const mockSalesReps = loadFromLocalStorage('renter-insight-sales-reps', [
      {
        id: 'sales-001',
        name: 'John Smith',
        email: 'john.smith@example.com',
        territory: 'North Region',
        isActive: true
      },
      {
        id: 'sales-002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        territory: 'South Region',
        isActive: true
      },
      {
        id: 'sales-003',
        name: 'Mike Davis',
        email: 'mike.davis@example.com',
        territory: 'East Region',
        isActive: true
      }
    ])

    setCommissions(savedCommissions)
    setRules(savedRules)
    setAuditTrail(savedAuditTrail)
    setSalesReps(mockSalesReps)
  }

  const saveCommissionsToStorage = (updatedCommissions: Commission[]) => {
    saveToLocalStorage('renter-insight-commissions', updatedCommissions)
  }

  const saveRulesToStorage = (updatedRules: CommissionRule[]) => {
    saveToLocalStorage('renter-insight-commission-rules', updatedRules)
  }

  const saveAuditTrailToStorage = (updatedAuditTrail: AuditEntry[]) => {
    saveToLocalStorage('renter-insight-commission-audit', updatedAuditTrail)
  }

  const saveSalesRepsToStorage = (updatedSalesReps: any[]) => {
    saveToLocalStorage('renter-insight-sales-reps', updatedSalesReps)
  }

  // Commission Management
  const getCommissionsByDealId = (dealId: string) => {
    return commissions.filter(commission => commission.dealId === dealId)
  }

  const getCommissionsBySalesRep = (salesRepId: string) => {
    return commissions.filter(commission => commission.salesPersonId === salesRepId)
  }

  const getCommissionsByStatus = (status: CommissionStatus) => {
    return commissions.filter(commission => commission.status === status)
  }

  const createCommission = async (commissionData: Partial<Commission>, userId: string, userName: string) => {
    setLoading(true)
    try {
      const newCommission: Commission = {
        id: Math.random().toString(36).substr(2, 9),
        salesPersonId: commissionData.salesPersonId || '',
        dealId: commissionData.dealId || '',
        type: commissionData.type || CommissionType.PERCENTAGE,
        rate: commissionData.rate ?? 0,
        amount: commissionData.amount || 0,
        status: CommissionStatus.PENDING,
        notes: commissionData.notes || '',
        customFields: commissionData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedCommissions = [newCommission, ...commissions]
      setCommissions(updatedCommissions)
      saveCommissionsToStorage(updatedCommissions)

      // Add audit trail entry
      await addAuditEntry({
        dealId: newCommission.dealId,
        userId,
        userName,
        action: 'create',
        description: `Created commission for deal #${newCommission.dealId}`,
        timestamp: new Date()
      })

      return newCommission
    } finally {
      setLoading(false)
    }
  }

  // Update commission status with audit trail
  const updateCommissionStatus = async (commissionId: string, status: CommissionStatus, userId: string, userName: string) => {
    const commission = commissions.find(c => c.id === commissionId)
    if (!commission) return null

    const oldStatus = commission.status
    const paidDate = status === CommissionStatus.PAID ? new Date() : commission.paidDate

    const updatedCommissions = commissions.map(c =>
      c.id === commissionId 
        ? { 
            ...c, 
            status,
            paidDate,
            updatedAt: new Date() 
          }
        : c
    )
    setCommissions(updatedCommissions)
    saveCommissionsToStorage(updatedCommissions)

    // Add audit trail entry
    await addAuditEntry({
      dealId: commission.dealId,
      userId,
      userName,
      action: 'update',
      description: `Updated commission status to ${status}`,
      oldValue: oldStatus,
      newValue: status,
      timestamp: new Date()
    })

    return updatedCommissions.find(c => c.id === commissionId)
  }

  // Generate commission report for a specific sales rep
  const generateCommissionReport = (salesRepId: string, startDate: Date, endDate: Date) => {
    const repCommissions = commissions.filter(c => 
      c.salesPersonId === salesRepId && 
      new Date(c.createdAt) >= startDate && 
      new Date(c.createdAt) <= endDate
    );
    
    const salesRep = salesReps.find(r => r.id === salesRepId);
    
    if (!salesRep) {
      throw new Error('Sales rep not found');
    }
    
    const totalCommissions = repCommissions.reduce((sum, c) => sum + c.amount, 0);
    const paidCommissions = repCommissions
      .filter(c => c.status === CommissionStatus.PAID)
      .reduce((sum, c) => sum + c.amount, 0);
    const pendingCommissions = repCommissions
      .filter(c => c.status === CommissionStatus.PENDING || c.status === CommissionStatus.APPROVED)
      .reduce((sum, c) => sum + c.amount, 0);
    
    return {
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      salesPerson: salesRep.name,
      totalCommissions,
      paidCommissions,
      pendingCommissions,
      dealCount: repCommissions.length,
      commissions: repCommissions
    };
  }

  // Commission Rule Management
  const createCommissionRule = async (ruleData: Partial<CommissionRule>, userId: string, userName: string) => {
    setLoading(true)
    try {
      const newRule: CommissionRule = {
        id: Math.random().toString(36).substr(2, 9),
        name: ruleData.name || '',
        type: ruleData.type || CommissionType.PERCENTAGE,
        description: ruleData.description,
        flatAmount: ruleData.flatAmount,
        percentageRate: ruleData.percentageRate,
        tiers: ruleData.tiers,
        isActive: ruleData.isActive ?? true,
        appliesTo: ruleData.appliesTo || ['all'],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedRules = [newRule, ...rules]
      setRules(updatedRules)
      saveRulesToStorage(updatedRules)

      // Add audit trail entry
      await addAuditEntry({
        dealId: 'system',
        userId,
        userName,
        action: 'create',
        description: `Created commission rule: ${newRule.name}`,
        timestamp: new Date()
      })

      return newRule
    } finally {
      setLoading(false)
    }
  }

  const updateCommissionRule = async (ruleId: string, ruleData: Partial<CommissionRule>, userId: string, userName: string) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) return null

    const updatedRules = rules.map(r => 
      r.id === ruleId 
        ? { 
            ...r, 
            ...ruleData,
            updatedAt: new Date() 
          }
        : r
    )
    setRules(updatedRules)
    saveRulesToStorage(updatedRules)

    // Add audit trail entry
    await addAuditEntry({
      dealId: 'system',
      userId,
      userName,
      action: 'update',
      description: `Updated commission rule: ${rule.name}`,
      timestamp: new Date()
    })

    return updatedRules.find(r => r.id === ruleId)
  }

  const deleteCommissionRule = async (ruleId: string, userId: string, userName: string) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) return

    const updatedRules = rules.filter(r => r.id !== ruleId)
    setRules(updatedRules)
    saveRulesToStorage(updatedRules)

    // Add audit trail entry
    await addAuditEntry({
      dealId: 'system',
      userId,
      userName,
      action: 'delete',
      description: `Deleted commission rule: ${rule.name}`,
      timestamp: new Date()
    })
  }

  const duplicateCommissionRule = async (ruleId: string, userId: string, userName: string) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) return null

    const newRule: CommissionRule = {
      ...rule,
      id: Math.random().toString(36).substr(2, 9),
      name: `${rule.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updatedRules = [...rules, newRule]
    setRules(updatedRules)
    saveRulesToStorage(updatedRules)

    // Add audit trail entry
    await addAuditEntry({
      dealId: 'system',
      userId,
      userName,
      action: 'create',
      description: `Duplicated commission rule: ${rule.name}`,
      timestamp: new Date()
    })

    return newRule
  }

  // Audit Trail Management with validation
  const getAuditTrailByDealId = (dealId: string) => {
    return auditTrail.filter(entry => entry.dealId === dealId)
  }

  const addAuditEntry = async (entryData: Partial<AuditEntry>) => {
    const newEntry: AuditEntry = {
      id: Math.random().toString(36).substr(2, 9),
      dealId: entryData.dealId || 'unknown',
      userId: entryData.userId || '',
      userName: entryData.userName || '',
      action: entryData.action || '',
      description: entryData.description || '',
      oldValue: entryData.oldValue,
      newValue: entryData.newValue,
      notes: entryData.notes,
      timestamp: entryData.timestamp || new Date()
    }

    const updatedAuditTrail = [newEntry, ...auditTrail]
    setAuditTrail(updatedAuditTrail)
    saveAuditTrailToStorage(updatedAuditTrail)

    return newEntry
  }

  const updateAuditEntryNotes = async (entryId: string, notes: string) => {
    const updatedAuditTrail = auditTrail.map(entry =>
      entry.id === entryId 
        ? { ...entry, notes }
        : entry
    )
    setAuditTrail(updatedAuditTrail)
    saveAuditTrailToStorage(updatedAuditTrail)
  }

  // Commission Calculation with fallback logic
  const calculateCommission = (dealAmount: number, ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) {
      throw new Error('Commission rule not found')
    }

    let commission = 0
    const breakdown: string[] = []

    // Fallback to percentage calculation if rule is missing or invalid
    const defaultRate = 5; // 5% default rate

    switch (rule.type) {
      case CommissionType.FLAT:
        commission = rule.flatAmount || 1000 // Fallback to $1000 if not specified
        breakdown.push(`Flat commission: ${commission}`)
        break
        
      case CommissionType.PERCENTAGE:
        const rate = rule.percentageRate || defaultRate
        commission = (dealAmount * rate) / 100
        breakdown.push(`${rate}% of ${dealAmount} = ${commission}`)
        break
        
      case CommissionType.TIERED:
        if (!rule.tiers || rule.tiers.length === 0) {
          breakdown.push('No tiers defined for this rule')
          // Fallback to default percentage if no tiers
          commission = (dealAmount * defaultRate) / 100
          breakdown.push(`Fallback to default ${defaultRate}% = ${commission}`)
          break
        }
        
        // Sort tiers by min amount
        const sortedTiers = [...rule.tiers].sort((a, b) => a.minAmount - b.minAmount)
        
        // Find applicable tier
        let applicableTier = sortedTiers[0]
        for (const tier of sortedTiers) {
          if (dealAmount >= tier.minAmount && (tier.maxAmount === null || dealAmount <= tier.maxAmount)) {
            applicableTier = tier
            break
          }
        }
        
        if (applicableTier.isPercentage) {
          commission = (dealAmount * applicableTier.rate) / 100
          breakdown.push(`Tier: $${applicableTier.minAmount} to ${applicableTier.maxAmount === null ? 'Unlimited' : '$' + applicableTier.maxAmount}`)
          breakdown.push(`${applicableTier.rate}% of ${dealAmount} = ${commission}`)
        } else {
          commission = applicableTier.rate
          breakdown.push(`Tier: $${applicableTier.minAmount} to ${applicableTier.maxAmount === null ? 'Unlimited' : '$' + applicableTier.maxAmount}`)
          breakdown.push(`Flat amount: ${commission}`)
        }
        break
        
      default:
        breakdown.push('Unknown rule type')
    }

    return { commission, breakdown }
  }

  return {
    commissions,
    rules,
    auditTrail,
    salesReps,
    loading,
    getCommissionsByDealId,
    getCommissionsBySalesRep,
    getCommissionsByStatus,
    createCommission,
    updateCommissionStatus,
    createCommissionRule,
    updateCommissionRule,
    deleteCommissionRule,
    duplicateCommissionRule,
    getAuditTrailByDealId,
    addAuditEntry,
    updateAuditEntryNotes,
    calculateCommission,
    generateCommissionReport
  }
}