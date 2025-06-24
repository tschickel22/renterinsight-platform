import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Lightbulb, TrendingUp, Clock, MessageSquare, Phone, Mail, Target, CheckCircle, X } from 'lucide-react'
import { AIInsight, Lead } from '../types'
import { useNurturing } from '../hooks/useNurturing'
import { cn } from '@/lib/utils'

interface AIInsightsProps {
  leadId: string
  leadData: Lead
}

export function AIInsights({ leadId, leadData }: AIInsightsProps) {
  const { 
    aiInsights, 
    generateAIInsights, 
    markInsightAsRead,
    enrollLeadInSequence,
    sequences 
  } = useNurturing()
  
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('insights')

  const leadInsights = aiInsights.filter(insight => insight.leadId === leadId)
  const unreadInsights = leadInsights.filter(insight => !insight.isRead)

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'next_action': return Target
      case 'communication_style': return MessageSquare
      case 'timing': return Clock
      case 'content_suggestion': return Lightbulb
      case 'risk_assessment': return TrendingUp
      default: return Brain
    }
  }

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'next_action': return 'from-blue-50 to-blue-100/50'
      case 'communication_style': return 'from-green-50 to-green-100/50'
      case 'timing': return 'from-orange-50 to-orange-100/50'
      case 'content_suggestion': return 'from-purple-50 to-purple-100/50'
      case 'risk_assessment': return 'from-red-50 to-red-100/50'
      default: return 'from-gray-50 to-gray-100/50'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50'
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-orange-600 bg-orange-50'
  }

  const handleGenerateInsights = async () => {
    setLoading(true)
    try {
      await generateAIInsights(leadId, leadData)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (insightId: string) => {
    await markInsightAsRead(insightId)
  }

  const handleEnrollInSequence = async (sequenceId: string) => {
    await enrollLeadInSequence(leadId, sequenceId)
  }

  const generateChatGPTSuggestions = (leadData: Lead) => {
    const suggestions = []

    // Analyze lead score and suggest actions
    if (leadData.score > 80) {
      suggestions.push({
        type: 'High Priority Action',
        suggestion: 'This lead has excellent potential. Schedule a personal call within 24 hours and prepare a customized presentation.',
        confidence: 95,
        actions: ['Schedule immediate call', 'Prepare custom presentation', 'Send calendar invite']
      })
    } else if (leadData.score > 60) {
      suggestions.push({
        type: 'Warm Lead Nurturing',
        suggestion: 'Good engagement level. Send educational content about RV ownership and schedule a follow-up in 3-5 days.',
        confidence: 85,
        actions: ['Send RV buying guide', 'Share customer testimonials', 'Schedule follow-up']
      })
    } else {
      suggestions.push({
        type: 'Lead Warming',
        suggestion: 'Lower engagement detected. Enroll in nurture sequence and focus on value-driven content.',
        confidence: 75,
        actions: ['Enroll in email sequence', 'Send value content', 'Monitor engagement']
      })
    }

    // Budget-based suggestions
    if (leadData.customFields?.budget) {
      const budget = leadData.customFields.budget
      suggestions.push({
        type: 'Budget-Matched Recommendations',
        suggestion: `Based on ${budget} budget, focus on specific inventory that matches their price range and financing options.`,
        confidence: 90,
        actions: ['Send matching inventory', 'Discuss financing', 'Offer trade-in evaluation']
      })
    }

    // Timing-based suggestions
    const daysSinceCreated = Math.floor((Date.now() - new Date(leadData.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceCreated > 7) {
      suggestions.push({
        type: 'Re-engagement Strategy',
        suggestion: `Lead is ${daysSinceCreated} days old. Implement re-engagement tactics with special offers or new inventory alerts.`,
        confidence: 80,
        actions: ['Send special offer', 'Share new arrivals', 'Offer exclusive preview']
      })
    }

    // Communication preference analysis
    if (leadData.source.toLowerCase().includes('website')) {
      suggestions.push({
        type: 'Digital-First Approach',
        suggestion: 'Lead came from website - they prefer digital communication. Use email and video messages before phone calls.',
        confidence: 85,
        actions: ['Send welcome email', 'Create video message', 'Share virtual tour']
      })
    }

    return suggestions
  }

  const chatGPTSuggestions = generateChatGPTSuggestions(leadData)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-500" />
            AI Insights & Suggestions
          </h3>
          <p className="text-sm text-muted-foreground">
            AI-powered recommendations for lead engagement
          </p>
        </div>
        <Button onClick={handleGenerateInsights} disabled={loading} size="sm">
          <Brain className="h-4 w-4 mr-2" />
          {loading ? 'Analyzing...' : 'Generate Insights'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights" className="relative">
            AI Insights
            {unreadInsights.length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                {unreadInsights.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="chatgpt">ChatGPT Suggestions</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {leadInsights.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No AI Insights Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Generate AI-powered insights to get personalized recommendations for this lead.
                </p>
                <Button onClick={handleGenerateInsights} disabled={loading}>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate First Insights
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {leadInsights
                .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
                .map(insight => {
                  const Icon = getInsightIcon(insight.type)
                  return (
                    <Card key={insight.id} className={cn(
                      "shadow-sm border-0 bg-gradient-to-br",
                      getInsightColor(insight.type),
                      !insight.isRead && "ring-2 ring-blue-200"
                    )}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <Icon className="h-6 w-6 text-primary mt-1" />
                            <div>
                              <CardTitle className="text-lg">{insight.title}</CardTitle>
                              <CardDescription className="mt-1">
                                {insight.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={cn("ri-badge-status", getConfidenceColor(insight.confidence))}>
                              {insight.confidence}% confidence
                            </Badge>
                            {!insight.isRead && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsRead(insight.id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Mark Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      {insight.actionable && insight.suggestedActions && (
                        <CardContent>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Suggested Actions:</h4>
                            <div className="space-y-2">
                              {insight.suggestedActions.map((action, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white/50 rounded-md">
                                  <span className="text-sm">{action}</span>
                                  <Button variant="outline" size="sm">
                                    Execute
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chatgpt" className="space-y-4">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-green-900">ChatGPT Analysis</CardTitle>
                  <CardDescription className="text-green-700">
                    AI-powered lead analysis and action recommendations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chatGPTSuggestions.map((suggestion, index) => (
                  <div key={index} className="bg-white/70 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-green-900">{suggestion.type}</h4>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {suggestion.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-green-800 mb-3">{suggestion.suggestion}</p>
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold text-green-900 uppercase tracking-wide">
                        Recommended Actions:
                      </h5>
                      <div className="grid gap-2 md:grid-cols-3">
                        {suggestion.actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant="outline"
                            size="sm"
                            className="justify-start text-xs bg-white/50 hover:bg-white/80"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-500" />
                Lead Scoring Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-blue-900">Current Score: {leadData.score}</h4>
                    <p className="text-sm text-blue-700">
                      {leadData.score >= 80 ? 'Hot Lead - High Priority' :
                       leadData.score >= 60 ? 'Warm Lead - Good Potential' :
                       leadData.score >= 40 ? 'Cool Lead - Needs Nurturing' :
                       'Cold Lead - Long-term Nurturing'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{leadData.score}</div>
                    <div className="text-xs text-blue-500">/ 100</div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-900 mb-1">Strengths</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      {leadData.customFields?.budget && <li>• Budget information provided</li>}
                      {leadData.customFields?.timeframe && <li>• Clear purchase timeline</li>}
                      {leadData.score > 60 && <li>• Good engagement level</li>}
                      {leadData.source === 'Customer Referral' && <li>• High-quality referral source</li>}
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h5 className="font-semibold text-orange-900 mb-1">Improvement Areas</h5>
                    <ul className="text-sm text-orange-700 space-y-1">
                      {!leadData.customFields?.budget && <li>• No budget information</li>}
                      {leadData.score < 60 && <li>• Low engagement level</li>}
                      {!leadData.assignedTo && <li>• No sales rep assigned</li>}
                      <li>• Limited activity history</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
                Nurture Sequences
              </CardTitle>
              <CardDescription>
                Enroll this lead in automated nurturing sequences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sequences.filter(s => s.isActive).map(sequence => (
                  <div key={sequence.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{sequence.name}</h4>
                      <p className="text-sm text-muted-foreground">{sequence.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {sequence.steps.length} steps
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {sequence.targetAudience}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEnrollInSequence(sequence.id)}
                      size="sm"
                    >
                      Enroll Lead
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-500" />
                Smart Timing Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Best Contact Times</h4>
                  <p className="text-sm text-blue-700">
                    Based on lead behavior: Tuesday-Thursday, 2-4 PM
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">Email Timing</h4>
                  <p className="text-sm text-green-700">
                    Send emails Tuesday/Wednesday mornings for best open rates
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Follow-up Schedule</h4>
                  <p className="text-sm text-purple-700">
                    Next follow-up recommended in 2-3 days based on engagement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}