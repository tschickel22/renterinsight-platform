import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CommissionAuditEntry } from '../types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { History, CheckCircle, XCircle, Edit, DollarSign, Plus } from 'lucide-react'

interface CommissionAuditTrailProps {
  auditEntries: CommissionAuditEntry[]
}

export function CommissionAuditTrail({ auditEntries }: CommissionAuditTrailProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <Plus className="h-4 w-4 text-blue-500" />
      case 'updated':
        return <Edit className="h-4 w-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'paid':
        return <DollarSign className="h-4 w-4 text-green-500" />
      default:
        return <History className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'updated':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'paid':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const formatChanges = (entry: CommissionAuditEntry) => {
    if (!entry.previousValue && !entry.newValue) return null
    
    const changes = []
    
    if (entry.action === 'created' && entry.newValue) {
      return (
        <div className="text-sm text-muted-foreground">
          <p>Commission created with initial values</p>
        </div>
      )
    }
    
    if (entry.previousValue && entry.newValue) {
      // Compare and show changes
      for (const [key, newVal] of Object.entries(entry.newValue)) {
        const oldVal = (entry.previousValue as any)[key]
        if (oldVal !== newVal) {
          changes.push(
            <div key={key} className="text-sm">
              <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
              <span className="line-through text-red-600 mr-2">{oldVal}</span>
              <span className="text-green-600">{newVal}</span>
            </div>
          )
        }
      }
    }
    
    return changes.length > 0 ? <div className="space-y-1">{changes}</div> : null
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2 text-primary" />
          Audit Trail
        </CardTitle>
        <CardDescription>
          History of changes to this commission
        </CardDescription>
      </CardHeader>
      <CardContent>
        {auditEntries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No audit history available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {auditEntries.map((entry) => (
              <div key={entry.id} className="relative pl-6">
                <div className="absolute left-0 top-1.5">
                  {getActionIcon(entry.action)}
                </div>
                
                <div className="flex items-center space-x-2 mb-1">
                  <Badge className={cn("ri-badge-status", getActionColor(entry.action))}>
                    {entry.action.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm">
                  <span className="font-medium">{entry.userName}</span> {entry.action} this commission
                </p>
                
                {formatChanges(entry)}
                
                {entry.notes && (
                  <div className="mt-2 p-2 bg-muted/30 rounded-md">
                    <p className="text-sm text-muted-foreground">{entry.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}