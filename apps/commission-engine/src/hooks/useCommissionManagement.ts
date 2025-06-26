import { useState } from 'react'
import { Commission, CommissionStatus, CommissionType } from '@/types'

export function useCommissionManagement() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [rules, setRules] = useState<any[]>([]) // Replace with actual type if you have one
  const [auditTrail, setAuditTrail] = useState<any[]>([]) // Replace with actual type if available
  const [salesReps, setSalesReps] = useState<any[]>([
    { id: 'user-001', name: 'Alice' },
    { id: 'user-002', name: 'Bob' }
  ])

  const createCommissionRule = async (rule: any) => {
    const newRule = { ...rule, id: Math.random().toString(36).substr(2, 9) }
    setRules(prev => [...prev, newRule])
  }

  const updateCommissionRule = async (id: string, ruleData: Partial<any>) => {
    setRules(prev => prev.map(r => (r.id === id ? { ...r, ...ruleData } : r)))
  }

  const deleteCommissionRule = async (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id))
  }

  const duplicateCommissionRule = async (id: string) => {
    const rule = rules.find(r => r.id === id)
    if (rule) {
      const newRule = { ...rule, id: Math.random().toString(36).substr(2, 9), name: `${rule.name} Copy` }
      setRules(prev => [...prev, newRule])
    }
  }

  const addAuditEntry = async (entry: any) => {
    setAuditTrail(prev => [...prev, { ...entry, id: Math.random().toString(36).substr(2, 9) }])
  }

  const updateAuditEntryNotes = async (id: string, notes: string) => {
    setAuditTrail(prev => prev.map(entry => (entry.id === id ? { ...entry, notes } : entry)))
  }

  const getAuditTrailByDealId = (dealId: string) => {
    return auditTrail.filter(entry => entry.dealId === dealId)
  }

  const generateCommissionReport = async (salesRepId: string) => {
    return commissions.filter(c => c.salesPersonId === salesRepId)
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
