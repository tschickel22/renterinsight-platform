import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Bell, Calendar, Clock, AlertTriangle } from 'lucide-react'
import { LeadReminder } from '../types'
import { useLeadManagement } from '../hooks/useLeadManagement'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface LeadRemindersProps {
  leadId: string
  reminders: LeadReminder[]
}

export function LeadReminders({ leadId, reminders }: LeadRemindersProps) {
  const { createReminder, completeReminder } = useLeadManagement()
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [newReminder, setNewReminder] = useState({
    type: 'follow_up' as LeadReminder['type'],
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as LeadReminder['priority']
  })

  const getPriorityColor = (priority: LeadReminder['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-50 text-red-700 border-red-200'
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-50 text-green-700 border-green-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type: LeadReminder['type']) => {
    switch (type) {
      case 'call': return '📞'
      case 'email': return '📧'
      case 'meeting': return '🤝'
      case 'deadline': return '⏰'
      default: return '📋'
    }
  }

  const isOverdue = (dueDate: Date) => {
    return new Date(dueDate) < new Date()
  }

  const handleAddReminder = async () => {
    if (!newReminder.title.trim() || !newReminder.dueDate) return

    await createReminder({
      leadId,
      type: newReminder.type,
      title: newReminder.title,
      description: newReminder.description,
      dueDate: new Date(newReminder.dueDate),
      priority: newReminder.priority,
      userId: 'current-user'
    })

    setNewReminder({
      type: 'follow_up',
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    })
    setShowAddReminder(false)
  }

  const handleCompleteReminder = async (reminderId: string) => {
    await completeReminder(reminderId)
  }

  const activeReminders = reminders.filter(r => !r.isCompleted)
  const completedReminders = reminders.filter(r => r.isCompleted)

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Reminders
            </CardTitle>
            <CardDescription>
              Set follow-up reminders and track completion
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddReminder(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddReminder && (
          <Card className="mb-6 border-dashed">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Reminder Type</label>
                    <Select
                      value={newReminder.type}
                      onValueChange={(value: any) => setNewReminder(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="follow_up">Follow Up</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={newReminder.priority}
                      onValueChange={(value: any) => setNewReminder(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Follow up on pricing questions"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="datetime-local"
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newReminder.description}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details..."
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddReminder(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddReminder}>
                    Add Reminder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {/* Active Reminders */}
          {activeReminders.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Active Reminders ({activeReminders.length})
              </h4>
              <div className="space-y-3">
                {activeReminders
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .map(reminder => (
                    <div key={reminder.id} className={cn(
                      "flex items-start space-x-3 p-3 border rounded-lg",
                      isOverdue(reminder.dueDate) ? 'border-red-200 bg-red-50' : 'hover:bg-accent/50'
                    )}>
                      <Checkbox
                        checked={false}
                        onCheckedChange={() => handleCompleteReminder(reminder.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{getTypeIcon(reminder.type)}</span>
                          <span className="font-medium text-sm">{reminder.title}</span>
                          <Badge className={cn("ri-badge-status text-xs", getPriorityColor(reminder.priority))}>
                            {reminder.priority}
                          </Badge>
                          {isOverdue(reminder.dueDate) && (
                            <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-1">
                          {reminder.description}
                        </p>
                        
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {formatDate(reminder.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-3 text-muted-foreground">
                Completed ({completedReminders.length})
              </h4>
              <div className="space-y-2">
                {completedReminders
                  .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
                  .slice(0, 5) // Show only last 5 completed
                  .map(reminder => (
                    <div key={reminder.id} className="flex items-center space-x-3 p-2 text-sm text-muted-foreground">
                      <Checkbox checked={true} disabled />
                      <span className="line-through">{reminder.title}</span>
                      <span className="text-xs">
                        {formatDate(reminder.dueDate)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeReminders.length === 0 && completedReminders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reminders set for this lead
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}