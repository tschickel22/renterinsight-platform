import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { X, Edit, DollarSign, CheckCircle, XCircle, Calendar, User, FileText } from 'lucide-react'
import { Commission, CommissionStatus, CommissionType } from '@/types'
import { CommissionAuditEntry } from '../types'
import { CommissionAuditTrail } from './CommissionAuditTrail'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface CommissionDetailProps {
  commission: Commission
  salesReps: any[] // Using existing sales rep data
  deals: any[] // Using existing deal data
  auditTrail: CommissionAuditEntry[]
  onClose: () => void
  onEdit: (commission: Commission) => void
  onApprove: (commissionId: string, notes?: string) => Promise<void>
  onReject: (commissionId: string, notes?: string) => Promise<void>
  onMarkPaid: (commissionId: string, notes?: string) => Promise<void>
}

export function CommissionDetail({
  commission,
  salesReps,
  deals,
  auditTrail,
  onClose,
  onEdit,
  onApprove,
  onReject,
  onMarkPaid
}: CommissionDetailProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('details')
  const [actionNotes, setActionNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status: CommissionStatus) => {
    switch (status) {
      case CommissionStatus.PENDING:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case CommissionStatus.APPROVED:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case CommissionStatus.PAID:
        return 'bg-green-50 text-green-700 border-green-200'
      case CommissionStatus.CANCELLED:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeColor = (type: CommissionType) => {
    switch (type) {
      case CommissionType.FLAT:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case CommissionType.PERCENTAGE:
        return 'bg-green-50 text-green-700 border-green-200'
      case CommissionType.TIERED:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleApprove = async () => {
    setLoading(true)
    try {
      await onApprove(commission.id, actionNotes)
      setActionNotes('')
      toast({
        title: 'Commission Approved',
        description: 'The commission has been approved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve commission',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    setLoading(true)
    try {
      await onReject(commission.id, actionNotes)
      setActionNotes('')
      toast({
        title: 'Commission Rejected',
        description: 'The commission has been rejected',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject commission',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async () => {
    setLoading(true)
    try {
      await onMarkPaid(commission.id, actionNotes)
      setActionNotes('')
      toast({
        title: 'Commission Marked as Paid',
        description: 'The commission has been marked as paid',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark commission as paid',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const salesRep = salesReps.find(rep => rep.id === commission.salesPersonId)
  const deal = deals.find(d => d.id === commission.dealId)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Commission Details</CardTitle>
              <CardDescription>
                Commission #{commission.id}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => onEdit(commission)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Commission
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="audit">
                Audit Trail
                {auditTrail.length > 0 && (
                  <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                    {auditTrail.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Commission Header */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn("ri-badge-status", getStatusColor(commission.status))}>
                  {commission.status.toUpperCase()}
                </Badge>
                <Badge className={cn("ri-badge-status", getTypeColor(commission.type))}>
                  {commission.type.toUpperCase()}
                </Badge>
                <div className="ml-auto font-bold text-lg text-primary">
                  {formatCurrency(commission.amount)}
                </div>
              </div>

              {/* Commission Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sales Rep</label>
                  <p className="font-medium">{salesRep?.name || commission.salesPersonId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Deal</label>
                  <p className="font-medium">{deal?.name || commission.dealId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Commission Type</label>
                  <p className="font-medium">{commission.type.charAt(0).toUpperCase() + commission.type.slice(1)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <p className="font-medium text-primary">{formatCurrency(commission.amount)}</p>
                </div>
                {commission.type === CommissionType.PERCENTAGE && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Rate</label>
                    <p className="font-medium">{(commission.rate * 100).toFixed(2)}%</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="font-medium">{formatDate(commission.createdAt)}</p>
                </div>
                {commission.paidDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Paid Date</label>
                    <p className="font-medium">{formatDate(commission.paidDate)}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {commission.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <div className="mt-1 p-3 bg-muted/30 rounded-md">
                    <p className="whitespace-pre-wrap">{commission.notes}</p>
                  </div>
                </div>
              )}

              {/* Commission Actions */}
              {(commission.status === CommissionStatus.PENDING || commission.status === CommissionStatus.APPROVED) && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="actionNotes">Action Notes</Label>
                    <Textarea
                      id="actionNotes"
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Add notes about this action (for audit trail)"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    {commission.status === CommissionStatus.PENDING && (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={handleReject}
                          disabled={loading}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          onClick={handleApprove}
                          disabled={loading}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </>
                    )}
                    
                    {commission.status === CommissionStatus.APPROVED && (
                      <Button 
                        onClick={handleMarkPaid}
                        disabled={loading}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Mark as Paid
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="audit">
              <CommissionAuditTrail auditEntries={auditTrail} />
            </TabsContent>
          </Tabs>

          {/* Close Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onEdit(commission)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Commission
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}