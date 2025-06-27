import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Star, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CustomerSurveyProps {
  customerId: string
  onSubmitSurvey: (surveyData: any) => Promise<void>
}

export function CustomerSurvey({ customerId, onSubmitSurvey }: CustomerSurveyProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    customerId,
    rating: '',
    serviceQuality: '',
    communicationRating: '',
    wouldRecommend: '',
    comments: '',
    contactForFollowUp: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.rating) {
      toast({
        title: 'Validation Error',
        description: 'Please provide an overall rating',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSubmitSurvey({
        ...formData,
        submittedAt: new Date()
      })
      toast({
        title: 'Survey Submitted',
        description: 'Thank you for your feedback!',
      })
      setSubmitted(true)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit survey. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Thank You for Your Feedback!</h3>
          <p className="text-muted-foreground text-center mb-6">
            Your feedback helps us improve our services and better meet your needs.
          </p>
          <Button onClick={() => setSubmitted(false)}>Submit Another Survey</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Customer Satisfaction Survey</h2>
        <p className="text-muted-foreground">
          We value your feedback! Please take a moment to share your experience with us.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Your Feedback</CardTitle>
          <CardDescription>
            Please rate your experience and provide any comments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="rating">Overall Experience *</Label>
              <div className="flex items-center space-x-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary ${
                      parseInt(formData.rating) >= star ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, rating: star.toString() }))}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {formData.rating === '1' ? 'Poor' : 
                 formData.rating === '2' ? 'Fair' : 
                 formData.rating === '3' ? 'Good' : 
                 formData.rating === '4' ? 'Very Good' : 
                 formData.rating === '5' ? 'Excellent' : 
                 'Please select a rating'}
              </p>
            </div>

            <div>
              <Label htmlFor="serviceQuality">Service Quality</Label>
              <Select 
                value={formData.serviceQuality} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, serviceQuality: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate our service quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="very_poor">Very Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="communicationRating">Communication</Label>
              <Select 
                value={formData.communicationRating} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, communicationRating: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate our communication" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="very_poor">Very Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="wouldRecommend">Would you recommend us?</Label>
              <Select 
                value={formData.wouldRecommend} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, wouldRecommend: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Would you recommend our services?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="definitely">Definitely</SelectItem>
                  <SelectItem value="probably">Probably</SelectItem>
                  <SelectItem value="not_sure">Not Sure</SelectItem>
                  <SelectItem value="probably_not">Probably Not</SelectItem>
                  <SelectItem value="definitely_not">Definitely Not</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="comments">Additional Comments</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                placeholder="Please share any additional feedback or suggestions"
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="contactForFollowUp"
                checked={formData.contactForFollowUp}
                onChange={(e) => setFormData(prev => ({ ...prev, contactForFollowUp: e.target.checked }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="contactForFollowUp" className="text-sm">
                I'm willing to be contacted for follow-up questions about my feedback
              </Label>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}