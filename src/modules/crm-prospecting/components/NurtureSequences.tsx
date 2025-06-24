import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Play, Pause, Edit, Trash2, Mail, MessageSquare, Clock, Users, TrendingUp, Zap } from 'lucide-react'
import { TemplateEditor } from './TemplateEditor'
import { SequenceEditor } from './SequenceEditor'
import { cn } from '@/lib/utils'

// Mock data for now since we removed Supabase
const mockSequences = [
  {
    id: '1',
    name: 'New Lead Welcome Series',
    description: 'Automated welcome sequence for new leads',
    isActive: true,
    targetAudience: 'New website leads',
    steps: [
      { id: '1', type: 'email', delay: 0 },
      { id: '2', type: 'wait', delay: 72 },
      { id: '3', type: 'email', delay: 0 },
      { id: '4', type: 'sms', delay: 48 }
    ]
  }
]

const mockEmailTemplates = [
  {
    id: '1',
    name: 'Welcome New Lead',
    subject: 'Welcome to our RV dealership!',
    body: 'Thank you for your interest...',
    type: 'welcome',
    isActive: true
  }
]

const mockSmsTemplates = [
  {
    id: '1',
    name: 'Quick Follow-up',
    message: 'Hi! Just wanted to check if you have any questions.',
    type: 'follow_up',
    isActive: true
  }
]

export function NurtureSequences() {
  // Use mock data for now - in a real app this would come from a hook
  const [sequences, setSequences] = useState(mockSequences)
  const [emailTemplates, setEmailTemplates] = useState(mockEmailTemplates)
  const [smsTemplates, setSmsTemplates] = useState(mockSmsTemplates)
  const [enrollments] = useState([])

  const [selectedSequence, setSelectedSequence] = useState(null)
  const [showCreateSequence, setShowCreateSequence] = useState(false)
  const [showCreateTemplate, setShowCreateTemplate] = useState(false)
  const [editingSequence, setEditingSequence] = useState(null)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [templateType, setTemplateType] = useState<'email' | 'sms'>('email')

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail
      case 'sms': return MessageSquare
      case 'wait': return Clock
      case 'task': return Users
      default: return Zap
    }
  }

  const getStepColor = (type: string) => {
    switch (type) {
      case 'email': return 'text-blue-500 bg-blue-50'
      case 'sms': return 'text-green-500 bg-green-50'
      case 'wait': return 'text-orange-500 bg-orange-50'
      case 'task': return 'text-purple-500 bg-purple-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const formatDelay = (hours: number) => {
    if (hours < 24) return `${hours} hours`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    if (remainingHours === 0) return `${days} days`
    return `${days} days ${remainingHours} hours`
  }

  const getSequenceStats = (sequenceId: string) => {
    const sequenceEnrollments = enrollments.filter(e => e.sequenceId === sequenceId)
    return {
      total: sequenceEnrollments.length,
      active: sequenceEnrollments.filter(e => e.status === 'active').length,
      completed: sequenceEnrollments.filter(e => e.status === 'completed').length,
      paused: sequenceEnrollments.filter(e => e.status === 'paused').length
    }
  }

  const handleCreateTemplate = () => {
    setShowCreateTemplate(true)
    setEditingTemplate(null)
  }

  const handleEditTemplate = (template: any, type: 'email' | 'sms') => {
    setEditingTemplate({ template, type })
    setShowCreateTemplate(true)
  }

  const handleSaveTemplate = async (templateData: any) => {
    if (editingTemplate) {
      // Update existing template
      if (editingTemplate.type === 'email') {
        setEmailTemplates(prev => prev.map(t => 
          t.id === editingTemplate.template.id 
            ? { ...t, ...templateData }
            : t
        ))
      } else {
        setSmsTemplates(prev => prev.map(t => 
          t.id === editingTemplate.template.id 
            ? { ...t, ...templateData }
            : t
        ))
      }
    } else {
      // Create new template
      const newTemplate = {
        id: Math.random().toString(36).substr(2, 9),
        ...templateData,
        isActive: true
      }
      
      if (templateType === 'email') {
        setEmailTemplates(prev => [...prev, newTemplate])
      } else {
        setSmsTemplates(prev => [...prev, newTemplate])
      }
    }
    setShowCreateTemplate(false)
    setEditingTemplate(null)
  }

  const handleCreateSequence = () => {
    setShowCreateSequence(true)
    setEditingSequence(null)
  }

  const handleEditSequence = (sequence: any) => {
    setEditingSequence(sequence)
    setShowCreateSequence(true)
  }

  const handleSaveSequence = async (sequenceData: any) => {
    if (editingSequence) {
      setSequences(prev => prev.map(s => 
        s.id === editingSequence.id 
          ? { ...s, ...sequenceData }
          : s
      ))
    } else {
      const newSequence = {
        id: Math.random().toString(36).substr(2, 9),
        ...sequenceData,
        steps: sequenceData.steps || []
      }
      setSequences(prev => [...prev, newSequence])
    }
    setShowCreateSequence(false)
    setEditingSequence(null)
  }


  return (
    <div className="space-y-6">
      {/* Template Editor Modal */}
      {showCreateTemplate && (
        <TemplateEditor
          template={editingTemplate?.template}
          type={editingTemplate?.type || templateType}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setShowCreateTemplate(false)
            setEditingTemplate(null)
          }}
        />
      )}

      {/* Sequence Editor Modal */}
      {showCreateSequence && (
        <SequenceEditor
          sequence={editingSequence}
          emailTemplates={emailTemplates}
          smsTemplates={smsTemplates}
          onSave={handleSaveSequence}
          onCancel={() => {
            setShowCreateSequence(false)
            setEditingSequence(null)
          }}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Nurture Sequences</h2>
          <p className="text-muted-foreground">
            Automate lead nurturing with email and SMS sequences
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowCreateTemplate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Template
          </Button>
          <Button onClick={handleCreateSequence}>
            <Plus className="h-4 w-4 mr-2" />
            Sequence
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sequences" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sequences">Sequences</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sequences" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sequences.map(sequence => {
              const stats = getSequenceStats(sequence.id)
              return (
                <Card key={sequence.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedSequence(sequence)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{sequence.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {sequence.description}
                        </CardDescription>
                      </div>
                      <Badge className={sequence.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                        {sequence.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>{stats.total} enrolled</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Play className="h-4 w-4 text-green-500" />
                          <span>{stats.active} active</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {sequence.steps.slice(0, 4).map((step, index) => {
                          const Icon = getStepIcon(step.type)
                          return (
                            <div key={step.id} className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-full",
                              getStepColor(step.type)
                            )}>
                              <Icon className="h-4 w-4" />
                            </div>
                          )
                        })}
                        {sequence.steps.length > 4 && (
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-xs">
                            +{sequence.steps.length - 4}
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Target: {sequence.targetAudience}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedSequence && (
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedSequence.name}</CardTitle>
                    <CardDescription>{selectedSequence.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditSequence(selectedSequence)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      {selectedSequence.isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {selectedSequence.isActive ? 'Pause' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Sequence Steps</h4>
                    <div className="space-y-4">
                      {selectedSequence.steps.map((step, index) => {
                        const Icon = getStepIcon(step.type)
                        const isLast = index === selectedSequence.steps.length - 1
                        
                        return (
                          <div key={step.id} className="relative">
                            {!isLast && (
                              <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
                            )}
                            
                            <div className="flex items-start space-x-4">
                              <div className={cn(
                                "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                                getStepColor(step.type)
                              )}>
                                <Icon className="h-5 w-5" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium capitalize">{step.type}</span>
                                  {step.delay > 0 && (
                                    <Badge variant="outline" className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>Wait {formatDelay(step.delay)}</span>
                                    </Badge>
                                  )}
                                </div>
                                {step.type === 'email' && (
                                  <div className="bg-muted/30 p-3 rounded-md">
                                    <p className="text-sm text-muted-foreground">
                                      {step.type === 'email' ? 'Email step' : 
                                       step.type === 'sms' ? 'SMS step' : 
                                       step.type === 'wait' ? 'Wait step' : 'Step'}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Performance</h4>
                    <div className="grid gap-4 md:grid-cols-4">
                      {Object.entries(getSequenceStats(selectedSequence.id)).map(([key, value]) => (
                        <div key={key} className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold">{value}</div>
                          <div className="text-sm text-muted-foreground capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList>
              <TabsTrigger value="email">Email Templates</TabsTrigger>
              <TabsTrigger value="sms">SMS Templates</TabsTrigger>
            </TabsList>

            {/* Template Type Selection for New Templates */}
            {showCreateTemplate && !editingTemplate && (
              <div className="mb-4">
                <Tabs value={templateType} onValueChange={(value: 'email' | 'sms') => setTemplateType(value)}>
                  <TabsList>
                    <TabsTrigger value="email">Email Template</TabsTrigger>
                    <TabsTrigger value="sms">SMS Template</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            <TabsContent value="email">
              <div className="grid gap-4 md:grid-cols-2">
                {emailTemplates.map(template => (
                  <Card key={template.id} className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {template.type}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template, 'email')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {template.subject || template.body}
                        </p>
                        <div>
                          <span className="text-sm font-medium">Variables:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(template.variables || ['first_name', 'company_name']).map(variable => (
                              <Badge key={variable} variant="outline" className="text-xs">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sms">
              <div className="grid gap-4 md:grid-cols-2">
                {smsTemplates.map(template => (
                  <Card key={template.id} className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {template.type}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template, 'sms')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {template.message}
                        </p>
                        <div>
                          <span className="text-sm font-medium">Variables:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(template.variables || ['first_name']).map(variable => (
                              <Badge key={variable} variant="outline" className="text-xs">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Enrollments</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">0</div>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Across all sequences
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Active Sequences</CardTitle>
                <Play className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  {sequences.filter(s => s.isActive).length}
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Currently running
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">
                  0%
                </div>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Average completion
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900">Templates</CardTitle>
                <Mail className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">
                  {emailTemplates.length + smsTemplates.length}
                </div>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Mail className="h-3 w-3 mr-1" />
                  Email & SMS templates
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Sequence Performance</CardTitle>
              <CardDescription>
                Detailed analytics for each nurture sequence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sequences.map(sequence => {
                  const stats = getSequenceStats(sequence.id)
                  const completionRate = 0
                  
                  return (
                    <div key={sequence.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{sequence.name}</h4>
                        <p className="text-sm text-muted-foreground">{sequence.description}</p>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold">0</div>
                          <div className="text-xs text-muted-foreground">Enrolled</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">0</div>
                          <div className="text-xs text-muted-foreground">Active</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">0</div>
                          <div className="text-xs text-muted-foreground">Completed</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{completionRate.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Rate</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}