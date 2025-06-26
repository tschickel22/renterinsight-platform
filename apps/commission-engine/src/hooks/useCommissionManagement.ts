import { useState, useEffect } from 'react'
import { Commission, CommissionStatus, CommissionType } from '@/types'
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

    const savedRules = loadFromLocalStorage('renter-insight-commission-rules', [
      {
        id: '1',
        name: 'Standard Sales Commission',
        type: 'percentage',
        description: 'Standard percentage-based commission for all sales',
        percentageRate: 5,
        isActive: true,
        appliesTo: ['all'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Service Contract Commission',
        type: 'flat',
        description: 'Flat commission for service contracts',
        flatAmount: 2500,
        isActive: true,
        appliesTo: ['service'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '3',
        name: 'Tiered Sales Commission',
        type: 'tiered',
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

  const saveAuditTrailToStorage = (updatedAuditTrail: AuditEntry[]) => {
    saveToLocalStorage('renter-insight-commission-audit', updatedAuditTrail)
  }

  // Commission Management
  const getCommissionsByDealId = (dealId: string) => {
    return commissions.filter(commission => commission.dealId === dealId)
  }

  const getCommissionsBySalesRep = (salesRepId: string) => {
    return commissions.filter(commission => commission.salesPersonId === salesRepId)
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

  // Commission Rule Management
  const createCommissionRule = async (ruleData: Partial<CommissionRule>, userId: string, userName: string) => {
    setLoading(true)
    try {
      const newRule: CommissionRule = {
        id: Math.random().toString(36).substr(2, 9),
        name: ruleData.name || '',
        type: ruleData.type || 'percentage',
        description: ruleData.description,
        flatAmount: ruleData.flatAmount,
        percentageRate: ruleData.percentageRate,
        tiers: ruleData.tiers,
        isActive: ruleData.isActive ?? true,
        appliesTo: ruleData.appliesTo || ['all'],
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

  // Audit Trail Management
  const getAuditTrailByDealId = (dealId: string) => {
    return auditTrail.filter(entry => entry.dealId === dealId)
  }

  const addAuditEntry = async (entryData: Partial<AuditEntry>) => {
    const newEntry: AuditEntry = {
      id: Math.random().toString(36).substr(2, 9),
      dealId: entryData.dealId || '',
      userId: entryData.userId || '',
      userName: entryData.userName || '',
      action: entryData.action || '',
      description: entryData.description || '',
      oldValue: entryData.oldValue,
      newValue: entryData.newValue,
      notes: entryData.notes,
      timestamp: entryData.timestamp || new Date()
    }

    const updatedAuditTrail = [...auditTrail, newEntry]
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

  // Commission Calculation
  const calculateCommission = (dealAmount: number, ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId)
    if (!rule) {
      throw new Error('Commission rule not found')
    }

    let commission = 0
    const breakdown: string[] = []

    switch (rule.type) {
      case 'flat':
        commission = rule.flatAmount || 0
        breakdown.push(`Flat commission: ${commission}`)
        break
        
      case 'percentage':
        const rate = rule.percentageRate || 0
        commission = (dealAmount * rate) / 100
        breakdown.push(`${rate}% of ${dealAmount} = ${commission}`)
        break
        
      case 'tiered':
        if (!rule.tiers || rule.tiers.length === 0) {
          breakdown.push('No tiers defined for this rule')
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
    loading,
    getCommissionsByDealId,
    getCommissionsBySalesRep,
    createCommission,
    updateCommissionStatus,
    createCommissionRule,
    updateCommissionRule,
    deleteCommissionRule,
    duplicateCommissionRule,
    getAuditTrailByDealId,
    addAuditEntry,
    updateAuditEntryNotes,
    calculateCommission
  }
}