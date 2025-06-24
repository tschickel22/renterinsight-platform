import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Phone, Mail, Calendar, MessageSquare, User, Clock } from 'lucide-react'
import { LeadActivity } from '../types'
import { useLeadManagement } from '../hooks/useLeadManagement'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ActivityTimelineProps {
  leadId: string
  activities: LeadActivity[]
}

export function ActivityTimeline({ leadId, activities }: ActivityTimelineProps) {
  const { logActivity } = useLeadManagement()
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [newActivity, setNewActivity] = useState({
    type: 'note' as LeadActivity['type'],
    description: '',
    outcome: undefined as LeadActivity['outcome'],
    duration: undefined as number | undefined,
    scheduledDate: undefined as Date | undefined
  })

  const getActivityIcon = (type: LeadActivity['type']) => {
    switch (type) {
      case 'call': return Phone
      case 'email': return Mail
      case 'meeting': return Calendar
      case 'note': return MessageSquare
      case 'status_change': return User
      default: return MessageSquare
    }
  }

  const getActivityColor = (type: LeadActivity['type']) => {
    switch (type) {
      case 'call': return 'text-green-500'
      case 'email': return 'text-blue-500'
      case 'meeting': return 'text-purple-500'
      case 'note': return 'text-gray-500'
      case 'status_change': return 'text-orange-500'
      default: return 'text-gray-500'
    }
  }

  const getOutcomeColor = (outcome?: LeadActivity['outcome']) => {
    switch (outcome) {
      case 'positive': return 'bg-green-50 text-green-700 border-green-200'
      case 'neutral': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'negative': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleAddActivity = async () => {
    if (!newActivity.description.trim()) return

    await logActivity({
      leadId,
      type: newActivity.type,
      description: newActivity.description,
      outcome: newActivity.outcome,
      duration: newActivity.duration,
      scheduledDate: newActivity.scheduledDate,
      userId: 'current-user'
    })

    setNewActivity({
      type: 'note',
      description: '',
      outcome: undefined,
      duration: undefined,
      scheduledDate: undefined
    })
    setShowAddActivity(false)
  }

  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Activity Timeline</CardTitle>
            <CardDescription>
              Track all interactions and activities for this lead
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddActivity(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddActivity && (
          <Card className="mb-6 border-dashed">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Activity Type</label>
                    <Select
                      value={newActivity.type}
                      onValueChange={(value: any) => setNewActivity(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="note">Note</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Outcome</label>
                    <Select
                      value={newActivity.outcome || ''}
                      onValueChange={(value: any) => setNewActivity(prev => ({ 
                        ...prev, 
                        outcome: value || undefined 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select outcome" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newActivity.type === 'call' && (
                  <div>
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={newActivity.duration || ''}
                      onChange={(e) => setNewActivity(prev => ({ 
                        ...prev, 
                        duration: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      placeholder="e.g., 15"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the activity..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddActivity(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddActivity}>
                    Add Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {sortedActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activities recorded yet
            </div>
          ) : (
            sortedActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type)
              const isLast = index === sortedActivities.length - 1

              return (
                <div key={activity.id} className="relative">
                  {!isLast && (
                    <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full bg-background border-2 flex items-center justify-center",
                      getActivityColor(activity.type)
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm capitalize">
                            {activity.type.replace('_', ' ')}
                          </span>
                          {activity.outcome && (
                            <Badge className={cn("ri-badge-status text-xs", getOutcomeColor(activity.outcome))}>
                              {activity.outcome}
                            </Badge>
                          )}
                          {activity.duration && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {activity.duration}m
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      
                      {activity.scheduledDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Scheduled for: {formatDate(activity.scheduledDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}