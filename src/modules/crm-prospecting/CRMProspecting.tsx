// src/modules/crm-prospecting/CRMProspecting.tsx
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Plus, Search, Filter, Phone, Mail, Calendar, TrendingUp, Target, BarChart3, Settings, Brain, MessageSquare } from 'lucide-react'
import { Lead, LeadStatus } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useLeadManagement } from './hooks/useLeadManagement'
import { PipelineDashboard } from './components/PipelineDashboard'
import { LeadScoring } from './components/LeadScoring'
import { ActivityTimeline } from './components/ActivityTimeline'
import { LeadReminders } from './components/LeadReminders'
import { LeadIntakeFormBuilder, DynamicLeadForm } from './components/LeadIntakeForm'
import { NurtureSequences } from './components/NurtureSequences'
import { AIInsights } from './components/AIInsights'
import { CommunicationCenter } from './components/CommunicationCenter'
import { NewLeadForm } from './components/NewLeadForm'
import { QuotesList } from './components/QuotesList'

function LeadsList() {
  const {
    leads,
    sources,
    activities,
    salesReps,
    updateLeadStatus,
    assignLead,
    getActivitiesByLead,
    getRemindersByUser,
    getLeadScore
  } = useLeadManagement()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showNewLeadForm, setShowNewLeadForm] = useState(false)
  const [showCommunicationCenterModal, setShowCommunicationCenterModal] = useState(false) // New state
  const [activeTab, setActiveTab] = useState('leads')

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case LeadStatus.CONTACTED:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case LeadStatus.QUALIFIED:
        return 'bg-green-50 text-green-700 border-green-200'
      case LeadStatus.PROPOSAL:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case LeadStatus.NEGOTIATION:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case LeadStatus.CLOSED_WON:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case LeadStatus.CLOSED_LOST:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    if (score >= 40) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesSource = sourceFilter === 'all' || lead.sourceId === sourceFilter
    const matchesAssignee = assigneeFilter === 'all' || lead.assignedTo === assigneeFilter

    return matchesSearch && matchesStatus && matchesSource && matchesAssignee
  })

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await updateLeadStatus(leadId, newStatus)
  }

  const handleAssignLead = async (leadId: string, repId: string) => {
    await assignLead(leadId, repId)
  }

  const handleNewLeadSuccess = (newLead: Lead) => {
    // The lead is already added to the state by the createLead function
    // We can optionally show a success message or redirect to the lead detail
    console.log('New lead created:', newLead)
  }

  if (selectedLead && !showCommunicationCenterModal) { // Only show lead detail if not showing communication modal
    const leadActivities = getActivitiesByLead(selectedLead.id)
    const leadReminders = getRemindersByUser('current-user').filter(r => r.leadId === selectedLead.id)
    const leadScore = getLeadScore(selectedLead.id)

    return (
      <div className="space-y-6">
        {/* Lead Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" onClick={() => setSelectedLead(null)} className="mb-4">
              ← Back to Leads
            </Button>
            <h1 className="ri-page-title">
              {selectedLead.firstName} {selectedLead.lastName}
            </h1>
            <p className="ri-page-description">
              Lead details and activity management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={cn("ri-badge-status", getStatusColor(selectedLead.status))}>
              {selectedLead.status.replace('_', ' ').toUpperCase()}
            </Badge>
            {selectedLead.score && (
              <Badge className={cn("ri-badge-status", getScoreColor(selectedLead.score))}>
                Score: {selectedLead.score}
              </Badge>
            )}
          </div>
        </div>

        {/* Lead Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="nurturing">Nurturing</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Lead Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="font-medium">{selectedLead.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="font-medium">{selectedLead.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Source</label>
                        <p className="font-medium">{selectedLead.source}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                        <p className="font-medium">
                          {salesReps.find(rep => rep.id === selectedLead.assignedTo)?.name || 'Unassigned'}
                        </p>
                      </div>
                      {Object.entries(selectedLead.customFields || {}).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm font-medium text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <p className="font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                    {selectedLead.notes && (
                      <div className="mt-4">
                        <label className="text-sm font-medium text-muted-foreground">Notes</label>
                        <p className="mt-1 p-3 bg-muted/30 rounded-md">{selectedLead.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {leadScore && <LeadScoring score={leadScore} />}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTimeline leadId={selectedLead.id} activities={leadActivities} />
          </TabsContent>

          <TabsContent value="communication">
            <CommunicationCenter leadId={selectedLead.id} leadData={selectedLead} />
          </TabsContent>

          <TabsContent value="ai-insights">
            <AIInsights leadId={selectedLead.id} leadData={selectedLead} />
          </TabsContent>

          <TabsContent value="nurturing">
            <div className="space-y-6">
              <NurtureSequences />
            </div>
          </TabsContent>

          <TabsContent value="reminders">
            <LeadReminders leadId={selectedLead.id} reminders={leadReminders} />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* New Lead Form Modal */}
      {showNewLeadForm && (
        <NewLeadForm
          onClose={() => setShowNewLeadForm(false)}
          onSuccess={handleNewLeadSuccess}
        />
      )}

      {/* Communication Center Modal */}
      {showCommunicationCenterModal && selectedLead && (
        <CommunicationCenter
          leadId={selectedLead.id}
          leadData={selectedLead}
          onClose={() => setShowCommunicationCenterModal(false)}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">CRM & Prospecting</h1>
            <p className="ri-page-description">
              Manage leads, track activities, and monitor sales pipeline with AI-powered insights
            </p>
          </div>
          <Button className="shadow-sm" onClick={() => setShowNewLeadForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{leads.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">New Leads</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {leads.filter(l => l.status === LeadStatus.NEW).length}
            </div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last week
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Qualified</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {leads.filter(l => l.status === LeadStatus.QUALIFIED).length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">AI Insights</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">47</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <Brain className="h-3 w-3 mr-1" />
              Active recommendations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="nurturing">Nurturing</TabsTrigger>
          <TabsTrigger value="forms">Intake Forms</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input shadow-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={LeadStatus.NEW}>New</SelectItem>
                <SelectItem value={LeadStatus.CONTACTED}>Contacted</SelectItem>
                <SelectItem value={LeadStatus.QUALIFIED}>Qualified</SelectItem>
                <SelectItem value={LeadStatus.PROPOSAL}>Proposal</SelectItem>
                <SelectItem value={LeadStatus.NEGOTIATION}>Negotiation</SelectItem>
                <SelectItem value={LeadStatus.CLOSED_WON}>Closed Won</SelectItem>
                <SelectItem value={LeadStatus.CLOSED_LOST}>Closed Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map(source => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reps</SelectItem>
                {salesReps.map(rep => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setShowNewLeadForm(true)} className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>

          {/* Leads Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Leads ({filteredLeads.length})</CardTitle>
                  <CardDescription>
                    Manage your sales prospects with AI-powered insights and automated nurturing
                  </CardDescription>
                </div>
                <Button onClick={() => setShowNewLeadForm(true)} variant="outline" className="shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="ri-table-row cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {lead.firstName} {lead.lastName}
                          </h3>
                          <Badge className={cn("ri-badge-status", getStatusColor(lead.status))}>
                            {lead.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {lead.score && (
                            <Badge className={cn("ri-badge-status", getScoreColor(lead.score))}>
                              {lead.score}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            <Brain className="h-3 w-3 mr-1" />
                            AI Ready
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-2 text-blue-500" />
                            {lead.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-2 text-green-500" />
                            {lead.phone}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-2 text-purple-500" />
                            {salesReps.find(rep => rep.id === lead.assignedTo)?.name || 'Unassigned'}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2 text-orange-500" />
                            {formatDate(lead.createdAt)}
                          </span>
                        </div>
                        {lead.notes && (
                          <p className="text-sm text-muted-foreground mt-2 bg-muted/30 p-2 rounded-md">
                            {lead.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ri-action-buttons">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="shadow-sm" 
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedLead(lead)
                          setShowCommunicationCenterModal(true) // Open communication modal
                        }}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm" className="shadow-sm" onClick={(e) => {
                        e.stopPropagation()
                        setSelectedLead(lead)
                      }}>
                        <Brain className="h-3 w-3 mr-1" />
                        AI Insights
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline">
          <PipelineDashboard />
        </TabsContent>

        <TabsContent value="quotes">
          <QuotesList />
        </TabsContent>

        <TabsContent value="nurturing">
          <NurtureSequences />
        </TabsContent>

        <TabsContent value="forms">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Lead Intake Forms</CardTitle>
              <CardDescription>
                Create and manage dynamic lead capture forms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Form builder coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
              <CardDescription>
                Manage and track lead source performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sources.map(source => (
                  <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <h3 className="font-semibold">{source.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {source.type} • Conversion: {source.conversionRate}%
                        {source.trackingCode && ` • Code: ${source.trackingCode}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={source.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                        {source.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function CRMProspecting() {
  return (
    <Routes>
      <Route path="/" element={<LeadsList />} />
      <Route path="/*" element={<LeadsList />} />
    </Routes>
  )
}
``````tsx
// src/modules/crm-prospecting/components/CommunicationCenter.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, MessageSquare, Send, Clock, CheckCircle, AlertCircle, Phone, Calendar, X } from 'lucide-react'
import { CommunicationLog, EmailTemplate, SMSTemplate, Lead } from '../types'
import { useNurturing } from '../hooks/useNurturing'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface CommunicationCenterProps {
  leadId: string
  leadData: Lead
  onClose: () => void // New prop for closing the modal
}

export function CommunicationCenter({ leadId, leadData, onClose }: CommunicationCenterProps) {
  const {
    emailTemplates,
    smsTemplates,
    communicationLogs,
    getCommunicationHistory
  } = useNurturing()

  const [activeTab, setActiveTab] = useState('history')
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<string>('')
  const [selectedSMSTemplate, setSelectedSMSTemplate] = useState<string>('')
  const [customEmailSubject, setCustomEmailSubject] = useState('')
  const [customEmailBody, setCustomEmailBody] = useState('')
  const [customSMSMessage, setCustomSMSMessage] = useState('')
  const [sending, setSending] = useState(false)

  const communicationHistory = getCommunicationHistory(leadId)

  const getStatusIcon = (status: CommunicationLog['status']) => {
    switch (status) {
      case 'sent': return <Send className="h-3 w-3 text-blue-500" />
      case 'delivered': return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'opened': return <Mail className="h-3 w-3 text-purple-500" />
      case 'clicked': return <CheckCircle className="h-3 w-3 text-green-600" />
      case 'replied': return <MessageSquare className="h-3 w-3 text-blue-600" />
      case 'failed': return <AlertCircle className="h-3 w-3 text-red-500" />
      default: return <Clock className="h-3 w-3 text-gray-500" />
    }
  }

  const getStatusColor = (status: CommunicationLog['status']) => {
    switch (status) {
      case 'sent': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200'
      case 'opened': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'clicked': return 'bg-green-50 text-green-700 border-green-200'
      case 'replied': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'failed': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const replaceVariables = (content: string, leadData: Lead) => {
    return content
      .replace(/\{\{first_name\}\}/g, leadData.firstName)
      .replace(/\{\{last_name\}\}/g, leadData.lastName)
      .replace(/\{\{company_name\}\}/g, 'Renter Insight RV')
      .replace(/\{\{rep_name\}\}/g, 'Your Sales Representative')
      .replace(/\{\{rep_phone\}\}/g, '(555) 123-4567')
      .replace(/\{\{website_url\}\}/g, 'https://renterinsight.com')
      .replace(/\{\{budget\}\}/g, leadData.customFields?.budget || 'your budget')
  }

  const handleSendEmail = async () => {
    setSending(true)
    try {
      let subject = customEmailSubject
      let body = customEmailBody

      if (selectedEmailTemplate) {
        const template = emailTemplates.find(t => t.id === selectedEmailTemplate)
        if (template) {
          subject = replaceVariables(template.subject, leadData)
          body = replaceVariables(template.body, leadData)
        }
      }

      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Reset form
      setCustomEmailSubject('')
      setCustomEmailBody('')
      setSelectedEmailTemplate('')
      
      console.log('Email sent:', { subject, body, to: leadData.email })
    } finally {
      setSending(false)
    }
  }

  const handleSendSMS = async () => {
    setSending(true)
    try {
      let message = customSMSMessage

      if (selectedSMSTemplate) {
        const template = smsTemplates.find(t => t.id === selectedSMSTemplate)
        if (template) {
          message = replaceVariables(template.message, leadData)
        }
      }

      // Simulate sending SMS
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Reset form
      setCustomSMSMessage('')
      setSelectedSMSTemplate('')
      
      console.log('SMS sent:', { message, to: leadData.phone })
    } finally {
      setSending(false)
    }
  }

  const handleTemplateSelect = (templateId: string, type: 'email' | 'sms') => {
    if (type === 'email') {
      setSelectedEmailTemplate(templateId)
      const template = emailTemplates.find(t => t.id === templateId)
      if (template) {
        setCustomEmailSubject(replaceVariables(template.subject, leadData))
        setCustomEmailBody(replaceVariables(template.body, leadData))
      }
    } else {
      setSelectedSMSTemplate(templateId)
      const template = smsTemplates.find(t => t.id === templateId)
      if (template) {
        setCustomSMSMessage(replaceVariables(template.message, leadData))
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                Communication Center
              </CardTitle>
              <CardDescription>
                Send emails, SMS, and track communication history
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="email">Send Email</TabsTrigger>
              <TabsTrigger value="sms">Send SMS</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Communication History
                  </CardTitle>
                  <CardDescription>
                    All email and SMS communications with this lead
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {communicationHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No communication history yet</p>
                      <p className="text-sm">Start by sending an email or SMS</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {communicationHistory.map((log, index) => (
                        <div key={log.id} className="relative">
                          {index < communicationHistory.length - 1 && (
                            <div className="absolute left-4 top-12 bottom-0 w-px bg-border" />
                          )}
                          
                          <div className="flex items-start space-x-4">
                            <div className={cn(
                              "flex-shrink-0 w-8 h-8 rounded-full border-2 bg-background flex items-center justify-center",
                              log.type === 'email' ? 'border-blue-200' : 'border-green-200'
                            )}>
                              {log.type === 'email' ? (
                                <Mail className="h-4 w-4 text-blue-500" />
                              ) : (
                                <MessageSquare className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm capitalize">
                                    {log.type} {log.direction}
                                  </span>
                                  <Badge className={cn("ri-badge-status text-xs", getStatusColor(log.status))}>
                                    {getStatusIcon(log.status)}
                                    <span className="ml-1">{log.status}</span>
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(log.sentAt)}
                                </span>
                              </div>
                              
                              {log.subject && (
                                <p className="font-medium text-sm mb-1">{log.subject}</p>
                              )}
                              
                              <div className="bg-muted/30 p-3 rounded-md">
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {log.content}
                                </p>
                              </div>
                              
                              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                <span>Sent: {formatDate(log.sentAt)}</span>
                                {log.deliveredAt && (
                                  <span>Delivered: {formatDate(log.deliveredAt)}</span>
                                )}
                                {log.openedAt && (
                                  <span>Opened: {formatDate(log.openedAt)}</span>
                                )}
                                {log.clickedAt && (
                                  <span>Clicked: {formatDate(log.clickedAt)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-500" />
                    Send Email
                  </CardTitle>
                  <CardDescription>
                    Send personalized emails using templates or custom content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email Template (Optional)</label>
                    <Select value={selectedEmailTemplate} onValueChange={(value) => handleTemplateSelect(value, 'email')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template or write custom email" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Custom Email</SelectItem>
                        {emailTemplates.filter(t => t.isActive).map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} ({template.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">To</label>
                    <Input value={leadData.email} disabled className="bg-muted/50" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      value={customEmailSubject}
                      onChange={(e) => setCustomEmailSubject(e.target.value)}
                      placeholder="Enter email subject"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      value={customEmailBody}
                      onChange={(e) => setCustomEmailBody(e.target.value)}
                      placeholder="Enter your email message"
                      rows={8}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Available variables: {{first_name}}, {{last_name}}, {{company_name}}, {{rep_name}}
                    </div>
                    <Button 
                      onClick={handleSendEmail} 
                      disabled={sending || !customEmailSubject || !customEmailBody}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {sending ? 'Sending...' : 'Send Email'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sms" className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
                    Send SMS
                  </CardTitle>
                  <CardDescription>
                    Send text messages using templates or custom content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">SMS Template (Optional)</label>
                    <Select value={selectedSMSTemplate} onValueChange={(value) => handleTemplateSelect(value, 'sms')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template or write custom SMS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Custom SMS</SelectItem>
                        {smsTemplates.filter(t => t.isActive).map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} ({template.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">To</label>
                    <Input value={leadData.phone} disabled className="bg-muted/50" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      value={customSMSMessage}
                      onChange={(e) => setCustomSMSMessage(e.target.value)}
                      placeholder="Enter your SMS message"
                      rows={4}
                      maxLength={160}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs text-muted-foreground">
                        {customSMSMessage.length}/160 characters
                      </div>
                      <div className={cn(
                        "text-xs",
                        customSMSMessage.length > 160 ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {customSMSMessage.length > 160 && "Message too long"}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Available variables: {{first_name}}, {{company_name}}, {{rep_name}}
                    </div>
                    <Button 
                      onClick={handleSendSMS} 
                      disabled={sending || !customSMSMessage || customSMSMessage.length > 160}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {sending ? 'Sending...' : 'Send SMS'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
