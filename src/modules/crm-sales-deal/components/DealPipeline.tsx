import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Deal, DealStage, DealStatus } from '../types'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Calendar, DollarSign, User, TrendingUp, AlertCircle } from 'lucide-react'
import { DropResult, DraggableLocation } from 'react-beautiful-dnd'

const stageConfig = [
  { stage: DealStage.PROSPECTING, name: 'Prospecting', color: 'bg-blue-500' },
  { stage: DealStage.QUALIFICATION, name: 'Qualification', color: 'bg-yellow-500' },
  { stage: DealStage.NEEDS_ANALYSIS, name: 'Needs Analysis', color: 'bg-orange-500' },
  { stage: DealStage.PROPOSAL, name: 'Proposal', color: 'bg-purple-500' },
  { stage: DealStage.NEGOTIATION, name: 'Negotiation', color: 'bg-indigo-500' },
  { stage: DealStage.CLOSED_WON, name: 'Closed Won', color: 'bg-green-500' },
  { stage: DealStage.CLOSED_LOST, name: 'Closed Lost', color: 'bg-red-500' }
]

interface DealPipelineProps {
  deals: Deal[]
  onDealStageChange: (dealId: string, newStage: DealStage) => void
  onDealClick: (deal: Deal) => void
}

export function DealPipeline({ deals, onDealStageChange, onDealClick }: DealPipelineProps) {
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null)

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const isOverdue = (deal: Deal) => {
    return new Date(deal.expectedCloseDate) < new Date() && deal.status === DealStatus.ACTIVE
  }

  const onDragEnd = (result: DropResult) => {
    setDraggedDeal(null)
    
    // If there's no destination or the item was dropped back in its original position, do nothing
    if (!result.destination || result.source.droppableId === result.destination.droppableId) return

    const dealId = result.draggableId
    const newStage = result.destination.droppableId

    // Call the callback to update the deal stage
    onDealStageChange(dealId, newStage)
  }

  const onDragStart = (start: { draggableId: string }) => {
    setDraggedDeal(start.draggableId)
  }

  const getStageDeals = (stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage)
  }

  const getStageValue = (stage: DealStage) => {
    return getStageDeals(stage).reduce((sum, deal) => sum + deal.value, 0)
  }

  const getWeightedStageValue = (stage: DealStage) => {
    return getStageDeals(stage).reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0)
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Pipeline Overview */}
      <div className="grid gap-4 md:grid-cols-7">
        {stageConfig.map((config) => {
          const stageDeals = getStageDeals(config.stage)
          const stageValue = getStageValue(config.stage)
          const weightedValue = getWeightedStageValue(config.stage)

          return (
            <Card key={config.stage} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={cn("w-3 h-3 rounded-full", config.color)} />
                  <span className="text-xs text-muted-foreground">{stageDeals.length}</span>
                </div>
                <CardTitle className="text-sm font-medium">{config.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  <div className="text-lg font-bold">{formatCurrency(stageValue)}</div>
                  <div className="text-xs text-muted-foreground">
                    Weighted: {formatCurrency(weightedValue)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pipeline Board */}
      <DragDropContext 
        onDragEnd={onDragEnd} 
        onDragStart={onDragStart}
      >
        <div className="grid gap-4 grid-cols-1 md:grid-cols-7 min-h-[600px]">
          {stageConfig.map((config) => (
            <Droppable key={config.stage} droppableId={config.stage}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn("space-y-3 p-3 rounded-lg border-2 border-dashed transition-colors min-h-[200px]",
                    snapshot.isDraggingOver ? "border-primary bg-primary/5" : "border-muted")}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <div className={cn("w-3 h-3 rounded-full", config.color)} />
                    <h3 className="font-semibold text-sm">{config.name}</h3>
                  </div>

                  {getStageDeals(config.stage).map((deal, index) => (
                    <Draggable key={deal.id} draggableId={deal.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          key={deal.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            snapshot.isDragging && "rotate-3 shadow-lg",
                            draggedDeal === deal.id && "opacity-50"
                          )}
                          onClick={() => onDealClick(deal)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div>
                                <h4 className="font-semibold text-sm line-clamp-2">{deal.name}</h4>
                                <p className="text-xs text-muted-foreground truncate">{deal.customerName}</p>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="font-bold text-primary">{formatCurrency(deal.value)}</span>
                                <Badge className={cn("ri-badge-status text-xs", getPriorityColor(deal.priority))}>
                                  {deal.priority.toUpperCase()}
                                </Badge> 
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>{deal.probability}%</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <Badge className={cn("ri-badge-status text-xs", getStatusColor(deal.status))}>
                                  {deal.status.toUpperCase()}
                                </Badge>
                                {isOverdue(deal) && (
                                  <div className="flex items-center space-x-1 text-red-500">
                                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                    <span className="text-xs">Overdue</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable> 
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}