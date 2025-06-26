import { useState } from 'react'
import { Commission, CommissionStatus, CommissionType, AuditEntry, SalesRep, CommissionRule } from '@/types'

export function useCommissionManagement() {
  const [commissions, setCommissions] = useState<Commission[]>([
    {
      id: '1',
      salesPersonId: 'rep-001',
      dealId: 'deal-001',
      amount: 5000,
      rate: 0.05,
      status: CommissionStatus.PENDING,
      type: CommissionType.PERCENTAGE,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: 'Initial deal',
      paidDate: undefined,
      customFields: {}
    }
  ])

  const [rules, setRules] = useState<CommissionRule[]>([])
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([])
  const [salesReps] = useState<SalesRep[]>([
    { id: 'rep-001', name: 'John Smith' },
    { id: 'rep-002', name: 'Jane Doe' }
  ])

  const createCommissionRule = async (data: Partial<CommissionRule>) => {
    const newRule: CommissionRule = {
      id: Math.random().toString(36).substring(2),
      name: data.name || 'New Rule',
      type: data.type || CommissionType.FLAT,
      rate: data.rate || 0,
      flatAmount: data.flatAmount || 0,
      tieredRates: data.tieredRates || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setRules(prev => [...prev, newRule])
  }

  const updateCommissionRule = async (id: string, data: Partial<CommissionRule>) => {
    setRules(prev =>
      prev.map(rule => rule.id === id ? { ...rule, ...data, updatedAt: new Date() } : rule)
    )
  }

  const deleteCommissionRule = async (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id))
  }

  const duplicateCommissionRule = async (id: string) => {
    const rule = rules.find(r => r.id === id)
    if (rule) {
      const duplicated = { ...rule, id: Math.random().toString(36).substring(2), name: `${rule.name} Copy` }
      setRules(prev => [...prev, duplicated])
    }
  }

  const addAuditEntry = async (entry: AuditEntry) => {
    setAuditTrail(prev => [...prev, entry])
  }

  const updateAuditEntryNotes = async (timestamp: Date, notes: string) => {
    setAuditTrail(prev =>
      prev.map(e =>
        e.timestamp === timestamp ? { ...e, description: notes } : e
      )
    )
  }

  const getAuditTrailByDealId = (dealId: string) => {
    return auditTrail.filter(e => e.dealId === dealId)
  }

  const generateCommissionReport = (salesPersonId: string) => {
    return commissions.filter(c => c.salesPersonId === salesPersonId)
  }

  return {
    commissions,
    rules,
    auditTrail,
    salesReps,
    createCommissionRule,
    updateCommissionRule,
    deleteCommissionRule,
    duplicateCommissionRule,
    getAuditTrailByDealId,
    addAuditEntry,
    updateAuditEntryNotes,
    generateCommissionReport
  }
}
