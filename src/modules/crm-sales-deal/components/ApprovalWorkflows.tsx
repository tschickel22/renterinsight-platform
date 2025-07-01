import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, AlertTriangle, Clock, User, ArrowRight, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'
import { Deal, ApprovalWorkflow, ApprovalStatus, ApprovalStep } from '../types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ApprovalWorkflowsProps {
  deals: Deal[]
  approvalWorkflows: ApprovalWorkflow[]
  onApprove: (workflowId: string, stepId: string, comments?: string) => void
  onReject: (workflowId: string, stepId: string, comments?: string) => void
  onEscalate: (workflowId: string, stepId: string, comments?: string) => void
}

export function ApprovalWorkflows({ deals, approvalWorkflows, onApprove, onReject, onEscalate }: ApprovalWorkflowsProps) {
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null)
  const [comments, setComments] = useState('')

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'escalated':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'escalated':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getWorkflowsByStatus = (status: ApprovalStatus) => {
    return approvalWorkflows.filter(w => w.status === status)
  }

  const getDealById = (dealId: string) => {
    return deals.find(d => d.id === dealId)
  }

  const handleApprove = () => {
    if (!selectedWorkflow) return
    const currentStep = selectedWorkflow.steps.find(s => s.stepNumber === selectedWorkflow.currentStep)
    if (!currentStep) return

    onApprove(selectedWorkflow.id, currentStep.id, comments)
    setComments('')
    setSelectedWorkflow(null)
  }

  const handleReject = () => {
    if (!selectedWorkflow) return
    const currentStep = selectedWorkflow.steps.find(s => s.stepNumber === selectedWorkflow.currentStep)
    if (!currentStep) return

    onReject(selectedWorkflow.id, currentStep.id, comments)
    setComments('')
    setSelectedWorkflow(null)
  }

  const handleEscalate = () => {
    if (!selectedWorkflow) return
    const currentStep = selectedWorkflow.steps.find(s => s.stepNumber === selectedWorkflow.currentStep)
    if (!currentStep) return

    onEscalate(selectedWorkflow.id, currentStep.id, comments)
    setComments('')
    setSelectedWorkflow(null)
  }

  return (
    <div className="space-y-6">
      {/* Approval Detail Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Approval Request</CardTitle>
                  <CardDescription>
                    {getDealById(selectedWorkflow.dealId)?.name || 'Unknown Deal'}
                  </CardDescription>
                </div>
                <Badge className={cn("ri-badge-status", getStatusColor(selectedWorkflow.status))}>
                  {selectedWorkflow.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Deal Information */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="grid gap-4 md:grid-cols-2">
                  {(() => {
                    const deal = getDealById(selectedWorkflow.dealId)
                    if (!deal) return null
                    
                    return (
                      <>
                        <div>
                          <span className="text-sm font-medium">Customer:</span>
                          <p className="text-sm">{deal.customerName}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Deal Value:</span>
                          <p className="text-sm font-bold">{formatCurrency(deal.value)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Stage:</span>
                          <p className="text-sm">{deal.stage.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Assigned To:</span>
                          <p className="text-sm">{deal.assignedTo}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Workflow Information */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Workflow Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <span className="text-sm font-medium">Type:</span>
                    <p className="text-sm">{selectedWorkflow.workflowType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Requested By:</span>
                    <p className="text-sm">{selectedWorkflow.requestedBy}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Requested:</span>
                    <p className="text-sm">{formatDate(selectedWorkflow.requestedAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Current Step:</span>
                    <p className="text-sm">{selectedWorkflow.currentStep} of {selectedWorkflow.totalSteps}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add your comments here..."
                  rows={3}
                />
              </div>

              {/* Approval Steps */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Approval Steps</h3>
                <div className="space-y-4">
                  {selectedWorkflow.steps.map((step, index) => {
                    const isCurrentStep = step.stepNumber === selectedWorkflow.currentStep
                    const isPastStep = step.stepNumber < selectedWorkflow.currentStep
                    
                    return (
                      <div 
                        key={step.id} 
                        className={cn(
                          "p-3 rounded-lg border-2",
                          isCurrentStep ? "border-primary bg-primary/5" : 
                          isPastStep ? "border-muted bg-muted/10" : 
                          "border-dashed border-muted"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold">
                              {step.stepNumber}
                            </span>
                            <span className="font-medium">{step.approverRole.replace('_', ' ')}</span>
                          </div>
                          <Badge className={cn("ri-badge-status", getStatusColor(step.status))}>
                            {getStatusIcon(step.status)}
                            <span className="ml-1">{step.status.toUpperCase()}</span>
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-2">
                          Requires {step.requiredApprovals} approval(s) from {step.approverIds.length} approver(s)
                        </div>
                        
                        {step.currentApprovals.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <h4 className="text-xs font-medium">Approvals:</h4>
                            {step.currentApprovals.map((approval, i) => (
                              <div key={i} className="flex items-start space-x-2 text-xs p-2 bg-muted/30 rounded">
                                {approval.action === 'approve' ? (
                                  <ThumbsUp className="h-3 w-3 text-green-500 mt-0.5" />
                                ) : approval.action === 'reject' ? (
                                  <ThumbsDown className="h-3 w-3 text-red-500 mt-0.5" />
                                ) : (
                                  <AlertTriangle className="h-3 w-3 text-orange-500 mt-0.5" />
                                )}
                                <div>
                                  <div className="font-medium">{approval.approverId}</div>
                                  <div className="text-muted-foreground">{formatDate(approval.actionDate)}</div>
                                  {approval.comments && (
                                    <div className="mt-1 italic">{approval.comments}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedWorkflow.status === 'pending' && (
                <>
                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Add your comments here..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button variant="outline" onClick={() => setSelectedWorkflow(null)}>
                      Cancel
                    </Button>
                    <Button variant="outline" onClick={handleEscalate}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Escalate
                    </Button>
                    <Button variant="destructive" onClick={handleReject}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button variant="default" onClick={handleApprove}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </>
              )}

              {selectedWorkflow.status !== 'pending' && (
                <div className="flex justify-end pt-6 border-t">
                  <Button variant="outline" onClick={() => setSelectedWorkflow(null)}>
                    Close
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Approval Workflows</h2>
          <p className="text-muted-foreground">
            Manage approval requests for deals above threshold
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            <Badge className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
              {getWorkflowsByStatus('pending').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">
              {getWorkflowsByStatus('approved').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            <Badge className="ml-2 bg-red-50 text-red-700 border-red-200">
              {getWorkflowsByStatus('rejected').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="escalated">
            Escalated
            <Badge className="ml-2 bg-orange-50 text-orange-700 border-orange-200">
              {getWorkflowsByStatus('escalated').length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {getWorkflowsByStatus('pending').length > 0 ? (
            getWorkflowsByStatus('pending').map((workflow) => {
              const deal = getDealById(workflow.dealId)
              if (!deal) return null

              return (
                <Card key={workflow.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedWorkflow(workflow)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{deal.name}</h3>
                        <p className="text-sm text-muted-foreground">{deal.customerName}</p>
                      </div>
                      <Badge className={cn("ri-badge-status", getStatusColor(workflow.status))}>
                        {getStatusIcon(workflow.status)}
                        <span className="ml-1">{workflow.status.toUpperCase()}</span>
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <span className="text-sm font-medium">Deal Value:</span>
                        <p className="text-lg font-bold text-primary">{formatCurrency(deal.value)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Requested By:</span>
                        <div className="flex items-center space-x-1 mt-1">
                          <User className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{workflow.requestedBy}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Requested:</span>
                        <p className="text-sm">{formatDate(workflow.requestedAt)}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium">Approval Progress:</span>
                        <span className="text-sm">{workflow.currentStep} of {workflow.totalSteps}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {workflow.steps.map((step, index) => {
                          const isCompleted = step.stepNumber < workflow.currentStep
                          const isCurrent = step.stepNumber === workflow.currentStep
                          
                          return (
                            <React.Fragment key={step.id}>
                              <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full",
                                isCompleted ? "bg-primary text-primary-foreground" : 
                                isCurrent ? "bg-primary/20 text-primary border-2 border-primary" : 
                                "bg-muted text-muted-foreground"
                              )}>
                                {step.stepNumber}
                              </div>
                              {index < workflow.steps.length - 1 && (
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </React.Fragment>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pending Approvals</h3>
                <p className="text-muted-foreground text-center">
                  There are no deals currently waiting for your approval.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {getWorkflowsByStatus('approved').length > 0 ? (
            getWorkflowsByStatus('approved').map((workflow) => {
              const deal = getDealById(workflow.dealId)
              if (!deal) return null

              return (
                <Card key={workflow.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedWorkflow(workflow)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{deal.name}</h3>
                        <p className="text-sm text-muted-foreground">{deal.customerName}</p>
                      </div>
                      <Badge className={cn("ri-badge-status", getStatusColor(workflow.status))}>
                        {getStatusIcon(workflow.status)}
                        <span className="ml-1">{workflow.status.toUpperCase()}</span>
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <span className="text-sm font-medium">Deal Value:</span>
                        <p className="text-lg font-bold text-primary">{formatCurrency(deal.value)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Completed:</span>
                        <p className="text-sm">{workflow.completedAt ? formatDate(workflow.completedAt) : 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Workflow Type:</span>
                        <p className="text-sm capitalize">{workflow.workflowType.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Approved Workflows</h3>
                <p className="text-muted-foreground text-center">
                  There are no approved deal workflows yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {getWorkflowsByStatus('rejected').length > 0 ? (
            getWorkflowsByStatus('rejected').map((workflow) => {
              const deal = getDealById(workflow.dealId)
              if (!deal) return null

              return (
                <Card key={workflow.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedWorkflow(workflow)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{deal.name}</h3>
                        <p className="text-sm text-muted-foreground">{deal.customerName}</p>
                      </div>
                      <Badge className={cn("ri-badge-status", getStatusColor(workflow.status))}>
                        {getStatusIcon(workflow.status)}
                        <span className="ml-1">{workflow.status.toUpperCase()}</span>
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <span className="text-sm font-medium">Deal Value:</span>
                        <p className="text-lg font-bold text-primary">{formatCurrency(deal.value)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Completed:</span>
                        <p className="text-sm">{workflow.completedAt ? formatDate(workflow.completedAt) : 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Workflow Type:</span>
                        <p className="text-sm capitalize">{workflow.workflowType.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Rejected Workflows</h3>
                <p className="text-muted-foreground text-center">
                  There are no rejected deal workflows.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="escalated" className="space-y-4">
          {getWorkflowsByStatus('escalated').length > 0 ? (
            getWorkflowsByStatus('escalated').map((workflow) => {
              const deal = getDealById(workflow.dealId)
              if (!deal) return null

              return (
                <Card key={workflow.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedWorkflow(workflow)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{deal.name}</h3>
                        <p className="text-sm text-muted-foreground">{deal.customerName}</p>
                      </div>
                      <Badge className={cn("ri-badge-status", getStatusColor(workflow.status))}>
                        {getStatusIcon(workflow.status)}
                        <span className="ml-1">{workflow.status.toUpperCase()}</span>
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <span className="text-sm font-medium">Deal Value:</span>
                        <p className="text-lg font-bold text-primary">{formatCurrency(deal.value)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Requested:</span>
                        <p className="text-sm">{formatDate(workflow.requestedAt)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Workflow Type:</span>
                        <p className="text-sm capitalize">{workflow.workflowType.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Escalated Workflows</h3>
                <p className="text-muted-foreground text-center">
                  There are no escalated deal workflows.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}