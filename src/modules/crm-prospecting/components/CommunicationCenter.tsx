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
import { formatDate, cn } from '@/lib/utils'
import DOMPurify from 'dompurify'

interface CommunicationCenterProps {
  leadId: string
  leadData: Lead
  onClose: () => void
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
  const [customEmailSubject, setCustomEmailSubject] = useState('')
  const [customEmailBody, setCustomEmailBody] = useState('')
  const [selectedSMSTemplate, setSelectedSMSTemplate] = useState<string>('')
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

      await new Promise(resolve => setTimeout(resolve, 2000))

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

      await new Promise(resolve => setTimeout(resolve, 1500))

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
              <CardTitle className="text-xl">Communication Center</CardTitle>
              <CardDescription>
                Manage communications for {leadData.firstName} {leadData.lastName}
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
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {'Available variables: {{first_name}}, {{last_name}}, {{company_name}}, {{rep_name}}'}
                    </div>
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
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {'Available variables: {{first_name}}, {{company_name}}, {{rep_name}}'}
                    </div>
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
