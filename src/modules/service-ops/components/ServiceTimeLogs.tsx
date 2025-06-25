import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Timer, Plus, Clock, DollarSign } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface ServiceTimeLog {
  id: string
  ticketId: string
  technicianId: string
  technicianName: string
  startTime: Date
  endTime?: Date
  duration?: number
  description: string
  billable: boolean
  createdAt: Date
}

interface ServiceTimeLogsProps {
  timeLogs: ServiceTimeLog[]
}

export function ServiceTimeLogs({ timeLogs }: ServiceTimeLogsProps) {
  const { toast } = useToast()
  const [showAddTimeLog, setShowAddTimeLog] = useState(false)
  const [newTimeLog, setNewTimeLog] = useState({
    technicianId: '',
    startTime: '',
    endTime: '',
    description: '',
    billable: true
  })

  // Mocked technicians for the demo
  const technicians = [
    { id: 'Tech-001', name: 'John Smith' },
    { id: 'Tech-002', name: 'Sarah Johnson' },
    { id: 'Tech-003', name: 'Mike Davis' }
  ]

  const handleAddTimeLog = () => {
    if (!newTimeLog.technicianId || !newTimeLog.startTime || !newTimeLog.description) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    // In a real app, this would call an API to add the time log
    toast({
      title: 'Time Log Added',
      description: 'Service time log has been added successfully',
    })

    setNewTimeLog({
      technicianId: '',
      startTime: '',
      endTime: '',
      description: '',
      billable: true
    })
    setShowAddTimeLog(false)
  }

  const calculateTotalHours = () => {
    return timeLogs.reduce((total, log) => total + (log.duration || 0), 0)
  }

  const calculateTotalBillable = () => {
    return timeLogs
      .filter(log => log.billable)
      .reduce((total, log) => total + (log.duration || 0), 0)
  }

  // Assuming a standard labor rate of $85/hour for billable time
  const calculateTotalBillableAmount = () => {
    const billableHours = calculateTotalBillable()
    return billableHours * 85
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Time Tracking</CardTitle>
            <CardDescription>
              Track technician time spent on this service ticket
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowAddTimeLog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Time
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddTimeLog && (
          <div className="space-y-4 p-4 border rounded-lg border-dashed">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="technician">Technician *</Label>
                <Select
                  value={newTimeLog.technicianId}
                  onValueChange={(value) => setNewTimeLog(prev => ({ ...prev, technicianId: value }))}
                >
                  <SelectTrigger id="technician">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map(tech => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={newTimeLog.startTime}
                  onChange={(e) => setNewTimeLog(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={newTimeLog.endTime}
                  onChange={(e) => setNewTimeLog(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="billable">Billable</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="billable"
                    checked={newTimeLog.billable}
                    onCheckedChange={(checked) => setNewTimeLog(prev => ({ ...prev, billable: !!checked }))}
                  />
                  <Label htmlFor="billable" className="text-sm">Billable time</Label>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newTimeLog.description}
                onChange={(e) => setNewTimeLog(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the work performed"
                rows={2}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddTimeLog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTimeLog}>
                Add Time Log
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {timeLogs.length > 0 ? (
            <>
              <div className="space-y-3">
                {timeLogs.map((log) => (
                  <div key={log.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Timer className="h-4 w-4 text-primary" />
                        <span className="font-medium">{log.technicianName}</span>
                        {log.billable ? (
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                            Billable
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full">
                            Non-billable
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {log.duration} {log.duration === 1 ? 'hour' : 'hours'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{log.description}</p>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(log.startTime)} - {log.endTime ? formatDate(log.endTime) : 'In progress'}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Hours</div>
                    <div className="font-bold text-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-1 text-primary" />
                      {calculateTotalHours()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Billable Hours</div>
                    <div className="font-bold text-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-1 text-green-600" />
                      {calculateTotalBillable()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Billable Amount</div>
                    <div className="font-bold text-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                      {formatCurrency(calculateTotalBillableAmount())}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Timer className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No time logs recorded yet</p>
              <p className="text-sm">Add time logs to track technician work</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}