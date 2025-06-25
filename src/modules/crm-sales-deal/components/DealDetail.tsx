import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Edit, DollarSign, Calendar, User, Target, Package, MapPin, Clock, AlertTriangle } from 'lucide-react'
import { Deal, DealStage, DealStatus, DealPriority } from '../types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface DealDetailProps {
  deal: Deal
  onClose: () => void
  onEdit: (deal: Deal) => void
}

export function DealDetail({ deal, onClose, onEdit }: DealDetailProps) {
  const getStatusColor = (status: DealStatus) => {
    switch (status) {
      case DealStatus.ACTIVE:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case DealStatus.WON:
        return 'bg-green-50 text-green-700 border-green-200'
      case DealStatus.LOST:
        return 'bg-red-50 text-red-700 border-red-200'
      case DealStatus.ON_HOLD:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case DealStatus.CANCELLED:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: DealPriority) => {
    switch (priority) {
      case DealPriority.CRITICAL:
        return 'bg-red-50 text-red-700 border-red-200'
      case DealPriority.HIGH:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case DealPriority.MEDIUM:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case DealPriority.LOW:
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStageColor = (stage: DealStage) => {
    switch (stage) {
      case DealStage.PROSPECTING:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case DealStage.QUALIFICATION:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case DealStage.NEEDS_ANALYSIS:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case DealStage.PROPOSAL:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case DealStage.NEGOTIATION:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case DealStage.CLOSED_WON:
        return 'bg-green-50 text-green-700 border-green-200'
      case DealStage.CLOSED_LOST:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const isOverdue = (deal: Deal) => {
    return new Date(deal.expectedCloseDate) < new Date() && deal.status === DealStatus.ACTIVE
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{deal.name}</CardTitle>
              <CardDescription>
                Deal details and information
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => onEdit(deal)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Deal
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Deal Header */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("ri-badge-status", getStatusColor(deal.status))}>
              {deal.status.toUpperCase()}
            </Badge>
            <Badge className={cn("ri-badge-status", getStageColor(deal.stage))}>
              {deal.stage.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge className={cn("ri-badge-status", getPriorityColor(deal.priority))}>
              {deal.priority.toUpperCase()}
            </Badge>
            {isOverdue(deal) && (
              <Badge className="bg-red-50 text-red-700 border-red-200">
                <AlertTriangle className="h-3 w-3 mr-1" />
                OVERDUE
              </Badge>
            )}
            {deal.requiresApproval && (
              <Badge className="bg-orange-50 text-orange-700 border-orange-200">
                REQUIRES APPROVAL
              </Badge>
            )}
          </div>

          {/* Deal Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Deal Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer</label>
                  <p className="font-medium">{deal.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Value</label>
                  <p className="font-bold text-primary text-lg">{formatCurrency(deal.value)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Probability</label>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <p className="font-medium">{deal.probability}%</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expected Close</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <p className="font-medium">{formatDate(deal.expectedCloseDate)}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-green-500" />
                    <p className="font-medium">{deal.assignedTo || 'Unassigned'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Territory</label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <p className="font-medium">{deal.territoryId || 'No Territory'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <p className="font-medium">{formatDate(deal.createdAt)}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <p className="font-medium">{formatDate(deal.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {deal.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <div className="mt-1 p-3 bg-muted/30 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{deal.notes}</p>
                  </div>
                </div>
              )}

              {/* Custom Fields */}
              {Object.keys(deal.customFields || {}).length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Custom Fields</label>
                  <div className="mt-1 grid gap-2 md:grid-cols-2">
                    {Object.entries(deal.customFields || {}).map(([key, value]) => (
                      <div key={key} className="p-2 bg-muted/30 rounded-md">
                        <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                        <span className="text-sm">{value?.toString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <h3 className="text-lg font-semibold">Products & Services</h3>
              
              {deal.products && deal.products.length > 0 ? (
                <div className="space-y-3">
                  {deal.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{product.productName}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <span>Quantity: {product.quantity}</span>
                          <span>Unit Price: {formatCurrency(product.unitPrice)}</span>
                          {product.discount > 0 && (
                            <span className="text-green-600">Discount: {formatCurrency(product.discount)}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(product.total)}</div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end p-3 bg-muted/30 rounded-lg">
                    <div className="text-right">
                      <span className="text-sm font-medium">Total Deal Value: </span>
                      <span className="text-lg font-bold text-primary">{formatCurrency(deal.value)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No products added to this deal</p>
                  <p className="text-sm">Edit the deal to add products</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <h3 className="text-lg font-semibold">Stage History</h3>
              
              {deal.stageHistory && deal.stageHistory.length > 0 ? (
                <div className="space-y-3">
                  {deal.stageHistory.map((history, index) => (
                    <div key={index} className="relative">
                      {index < deal.stageHistory.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
                      )}
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium capitalize">
                              {history.fromStage ? `${history.fromStage.replace('_', ' ')} → ${history.toStage.replace('_', ' ')}` : `Started at ${history.toStage.replace('_', ' ')}`}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(history.changedAt)}
                            </span>
                          </div>
                          
                          {history.duration !== undefined && (
                            <div className="text-sm text-muted-foreground">
                              Duration: {history.duration} hours
                            </div>
                          )}
                          
                          {history.notes && (
                            <div className="mt-1 text-sm bg-muted/30 p-2 rounded-md">
                              {history.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No stage history available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onEdit(deal)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Deal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}