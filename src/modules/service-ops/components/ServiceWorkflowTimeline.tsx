import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ServiceStage } from '../types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { 
  ClipboardList, 
  Search, 
  Calculator, 
  ShoppingCart, 
  Wrench, 
  CheckCircle, 
  CheckSquare, 
  X 
} from 'lucide-react'

interface ServiceWorkflowTimelineProps {
  stages: {
    stage: ServiceStage
    startedAt: Date
    completedAt?: Date
    assignedTo?: string
  }[]
}

export function ServiceWorkflowTimeline({ stages }: ServiceWorkflowTimelineProps) {
  const getStageIcon = (stage: ServiceStage) => {
    switch (stage) {
      case ServiceStage.INTAKE:
        return ClipboardList
      case ServiceStage.DIAGNOSIS:
        return Search
      case ServiceStage.ESTIMATE_APPROVAL:
        return Calculator
      case ServiceStage.PARTS_ORDERING:
        return ShoppingCart
      case ServiceStage.REPAIR:
        return Wrench
      case ServiceStage.QUALITY_CHECK:
        return CheckSquare
      case ServiceStage.COMPLETED:
        return CheckCircle
      case ServiceStage.CANCELLED:
        return X
      default:
        return ClipboardList
    }
  }

  const getStageColor = (stage: ServiceStage, isCompleted: boolean) => {
    if (!isCompleted) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
    
    switch (stage) {
      case ServiceStage.INTAKE:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case ServiceStage.DIAGNOSIS:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case ServiceStage.ESTIMATE_APPROVAL:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case ServiceStage.PARTS_ORDERING:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case ServiceStage.REPAIR:
        return 'bg-green-50 text-green-700 border-green-200'
      case ServiceStage.QUALITY_CHECK:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case ServiceStage.COMPLETED:
        return 'bg-green-50 text-green-700 border-green-200'
      case ServiceStage.CANCELLED:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStageLabel = (stage: ServiceStage) => {
    return stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const calculateDuration = (startDate: Date, endDate?: Date) => {
    if (!endDate) return null
    
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const diffMs = end - start
    
    // Convert to hours and minutes
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours === 0) {
      return `${minutes}m`
    } else if (minutes === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${minutes}m`
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Service Workflow</CardTitle>
        <CardDescription>
          Track the progress of this service ticket through each stage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stages.map((stageInfo, index) => {
            const Icon = getStageIcon(stageInfo.stage)
            const isCompleted = !!stageInfo.completedAt
            const isLast = index === stages.length - 1
            
            return (
              <div key={stageInfo.stage} className="relative">
                {!isLast && (
                  <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                    getStageColor(stageInfo.stage, isCompleted)
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{getStageLabel(stageInfo.stage)}</span>
                      <Badge className={cn(
                        "ri-badge-status",
                        isCompleted ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      )}>
                        {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Started:</span> {formatDate(stageInfo.startedAt)}
                      </div>
                      {stageInfo.completedAt && (
                        <div>
                          <span className="font-medium">Completed:</span> {formatDate(stageInfo.completedAt)}
                        </div>
                      )}
                      {stageInfo.assignedTo && (
                        <div>
                          <span className="font-medium">Assigned To:</span> {stageInfo.assignedTo}
                        </div>
                      )}
                      {stageInfo.completedAt && (
                        <div>
                          <span className="font-medium">Duration:</span> {calculateDuration(stageInfo.startedAt, stageInfo.completedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}