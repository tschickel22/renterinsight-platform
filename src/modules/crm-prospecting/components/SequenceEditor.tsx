import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Plus, Trash2, Mail, MessageSquare, Clock, Users, ArrowUp, ArrowDown } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface NurtureStep {
  id: string
  type: 'email' | 'sms' | 'wait' | 'task'
  delay: number
  content: {
    subject?: string
    body: string
    template?: string
  }
  isActive: boolean
}

interface NurtureSequence {
  id?: string
  name: string
  description: string
  targetAudience: string
  steps: NurtureStep[]
  isActive: boolean
}

interface SequenceEditorProps {
  sequence?: NurtureSequence
  emailTemplates: any[]
  smsTemplates: any[]
  onSave: (sequence: Partial<NurtureSequence>) => Promise<void>
  onCancel: () => void
}

export function SequenceEditor({ sequence, emailTemplates, smsTemplates, onSave, onCancel }: SequenceEditorProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: sequence?.name || '',
    description: sequence?.description || '',
    targetAudience: sequence?.targetAudience || '',
    steps: sequence?.steps || [],
    isActive: sequence?.isActive ?? true
  })

  const [showAddStep, setShowAddStep] = useState(false)
  const [newStep, setNewStep] = useState<Partial<NurtureStep>>({
    type: 'email',
    delay: 0,
    content: { body: '' },
    isActive: true
  })

  const stepTypes = [
    { value: 'email', label: 'Email', icon: Mail, color: 'text-blue-500' },
    { value: 'sms', label: 'SMS', icon: MessageSquare, color: 'text-green-500' },
    { value: 'wait', label: 'Wait', icon: Clock, color: 'text-orange-500' },
    { value: 'task', label: 'Task', icon: Users, color: 'text-purple-500' }
  ]

  const getStepIcon = (type: NurtureStep['type']) => {
    const stepType = stepTypes.find(s => s.value === type)
    return stepType?.icon || Mail
  }

  const getStepColor = (type: NurtureStep['type']) => {
    const stepType = stepTypes.find(s => s.value === type)
    return stepType?.color || 'text-gray-500'
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Sequence name is required',
        variant: 'destructive'
      })
      return
    }

    if (formData.steps.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one step is required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const sequenceData = {
        ...formData,
        steps: formData.steps.map((step, index) => ({
          ...step,
          order: index + 1
        }))
      }

      await onSave(sequenceData)
      
      toast({
        title: 'Success',
        description: `Sequence ${sequence ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${sequence ? 'update' : 'create'} sequence`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addStep = () => {
    if (!newStep.content?.body?.trim() && newStep.type !== 'wait') {
      toast({
        title: 'Validation Error',
        description: 'Step content is required',
        variant: 'destructive'
      })
      return
    }

    const step: NurtureStep = {
      id: Math.random().toString(36).substr(2, 9),
      type: newStep.type || 'email',
      delay: newStep.delay || 0,
      content: newStep.content || { body: '' },
      isActive: true
    }

    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, step]
    }))

    setNewStep({
      type: 'email',
      delay: 0,
      content: { body: '' },
      isActive: true
    })
    setShowAddStep(false)
  }

  const removeStep = (stepId: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter(s => s.id !== stepId)
    }))
  }

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const steps = [...formData.steps]
    const index = steps.findIndex(s => s.id === stepId)
    
    if (direction === 'up' && index > 0) {
      [steps[index], steps[index - 1]] = [steps[index - 1], steps[index]]
    } else if (direction === 'down' && index < steps.length - 1) {
      [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]]
    }

    setFormData(prev => ({ ...prev, steps }))
  }

  const formatDelay = (hours: number) => {
    if (hours < 24) return `${hours} hours`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    if (remainingHours === 0) return `${days} days`
    return `${days} days ${remainingHours} hours`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {sequence ? 'Edit' : 'Create'} Nurture Sequence
              </CardTitle>
              <CardDescription>
                {sequence ? 'Update the sequence details and steps' : 'Create an automated sequence for lead nurturing'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Sequence Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., New Lead Welcome Series"
              />
            </div>
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                placeholder="e.g., New website leads"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the purpose and goals of this sequence"
              rows={3}
            />
          </div>

          {/* Sequence Steps */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Sequence Steps ({formData.steps.length})</Label>
              <Button onClick={() => setShowAddStep(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>

            {/* Add Step Form */}
            {showAddStep && (
              <Card className="mb-4 border-dashed">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label>Step Type</Label>
                        <Select
                          value={newStep.type}
                          onValueChange={(value: any) => setNewStep(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {stepTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center">
                                  <type.icon className={cn("h-4 w-4 mr-2", type.color)} />
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Delay (hours)</Label>
                        <Input
                          type="number"
                          value={newStep.delay || 0}
                          onChange={(e) => setNewStep(prev => ({ ...prev, delay: parseInt(e.target.value) || 0 }))}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      {newStep.type === 'email' && (
                        <div>
                          <Label>Email Template</Label>
                          <Select
                            value={newStep.content?.template || ''}
                            onValueChange={(value) => {
                              const template = emailTemplates.find(t => t.id === value)
                              setNewStep(prev => ({
                                ...prev,
                                content: {
                                  ...prev.content,
                                  template: value,
                                  subject: template?.subject || '',
                                  body: template?.body || ''
                                }
                              }))
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Custom Content</SelectItem>
                              {emailTemplates.filter(t => t.isActive).map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {newStep.type === 'sms' && (
                        <div>
                          <Label>SMS Template</Label>
                          <Select
                            value={newStep.content?.template || ''}
                            onValueChange={(value) => {
                              const template = smsTemplates.find(t => t.id === value)
                              setNewStep(prev => ({
                                ...prev,
                                content: {
                                  ...prev.content,
                                  template: value,
                                  body: template?.message || ''
                                }
                              }))
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Custom Content</SelectItem>
                              {smsTemplates.filter(t => t.isActive).map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {newStep.type === 'email' && (
                      <div>
                        <Label>Subject</Label>
                        <Input
                          value={newStep.content?.subject || ''}
                          onChange={(e) => setNewStep(prev => ({
                            ...prev,
                            content: { ...prev.content, subject: e.target.value }
                          }))}
                          placeholder="Email subject line"
                        />
                      </div>
                    )}

                    {(newStep.type === 'email' || newStep.type === 'sms' || newStep.type === 'task') && (
                      <div>
                        <Label>
                          {newStep.type === 'email' ? 'Email Body' : 
                           newStep.type === 'sms' ? 'SMS Message' : 'Task Description'}
                        </Label>
                        <Textarea
                          value={newStep.content?.body || ''}
                          onChange={(e) => setNewStep(prev => ({
                            ...prev,
                            content: { ...prev.content, body: e.target.value }
                          }))}
                          placeholder={
                            newStep.type === 'email' ? 'Email content...' :
                            newStep.type === 'sms' ? 'SMS message...' :
                            'Task description...'
                          }
                          rows={newStep.type === 'email' ? 6 : 3}
                          maxLength={newStep.type === 'sms' ? 160 : undefined}
                        />
                        {newStep.type === 'sms' && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {(newStep.content?.body || '').length}/160 characters
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddStep(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addStep}>
                        Add Step
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Steps List */}
            <div className="space-y-4">
              {formData.steps.map((step, index) => {
                const Icon = getStepIcon(step.type)
                const isLast = index === formData.steps.length - 1

                return (
                  <div key={step.id} className="relative">
                    {!isLast && (
                      <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
                    )}
                    
                    <div className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-full bg-background border-2 flex items-center justify-center",
                        getStepColor(step.type)
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium capitalize">{step.type}</span>
                          {step.delay > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDelay(step.delay)}
                            </Badge>
                          )}
                        </div>
                        
                        {step.type === 'email' && (
                          <div className="bg-blue-50 p-3 rounded-md">
                            <p className="font-medium text-sm text-blue-900">
                              {step.content.subject || 'No subject'}
                            </p>
                            <p className="text-sm text-blue-700 mt-1 line-clamp-2">
                              {step.content.body || 'No content'}
                            </p>
                          </div>
                        )}
                        
                        {step.type === 'sms' && (
                          <div className="bg-green-50 p-3 rounded-md">
                            <p className="text-sm text-green-700">
                              {step.content.body || 'No message'}
                            </p>
                          </div>
                        )}
                        
                        {step.type === 'wait' && (
                          <div className="bg-orange-50 p-3 rounded-md">
                            <p className="text-sm text-orange-700">
                              Wait {formatDelay(step.delay)} before next step
                            </p>
                          </div>
                        )}

                        {step.type === 'task' && (
                          <div className="bg-purple-50 p-3 rounded-md">
                            <p className="text-sm text-purple-700">
                              {step.content.body || 'No task description'}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveStep(step.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveStep(step.id, 'down')}
                          disabled={index === formData.steps.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeStep(step.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {formData.steps.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  No steps added yet. Click "Add Step" to get started.
                </div>
              )}
            </div>
          </div>

          {/* Sequence Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
            />
            <Label htmlFor="isActive">Active sequence</Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {sequence ? 'Update' : 'Create'} Sequence
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}