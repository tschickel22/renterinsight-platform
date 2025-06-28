import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SurveyForm } from '../components/SurveyForm'

export function Feedback() {
  const handleSubmitFeedback = (feedbackData: any) => {
    console.log('Feedback submitted:', feedbackData)
    // In a real app, this would send the data to the server
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        <p className="text-muted-foreground">
          Share your experience and help us improve
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Satisfaction Survey</CardTitle>
          <CardDescription>
            Please take a moment to complete this short survey about your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SurveyForm onSubmit={handleSubmitFeedback} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous Feedback</CardTitle>
          <CardDescription>
            Your past survey responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>You haven't submitted any feedback yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}