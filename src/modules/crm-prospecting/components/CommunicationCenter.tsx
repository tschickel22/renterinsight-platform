import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, MessageSquare, Send, Clock, CheckCircle, AlertCircle, Phone, Calendar } from 'lucide-react'
import { CommunicationLog, EmailTemplate, SMSTemplate, Lead } from '../types'
import { useNurturing } from '../hooks/useNurturing'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface CommunicationCenterProps {
  leadId: string
  leadData: Lead
}

export function CommunicationCenter({ leadId, leadData }: CommunicationCenterProps) {
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          Communication Center
        </h3>
        <p className="text-sm text-muted-foreground">
          Send emails, SMS, and track communication history
        </p>
      </div>

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
    </div>
  )
}