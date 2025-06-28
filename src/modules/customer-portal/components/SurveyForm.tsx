import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx'
import { Checkbox } from '@/components/ui/checkbox'
import { Send, Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SurveyFormProps {
  onSubmit: (feedbackData: any) => void
}

export function SurveyForm({ onSubmit }: SurveyFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    overallSatisfaction: 0,
    productQuality: 0,
    customerService: 0,
    wouldRecommend: '',
    comments: '',
    contactPermission: false,
    email: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.overallSatisfaction === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please rate your overall satisfaction',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSubmit(formData)
      
      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your feedback!',
      })
      
      // Reset form
      setFormData({
        overallSatisfaction: 0,
        productQuality: 0,
        customerService: 0,
        wouldRecommend: '',
        comments: '',
        contactPermission: false,
        email: ''
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit feedback',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const StarRating = ({ 
    name, 
    value, 
    onChange 
  }: { 
    name: string, 
    value: number, 
    onChange: (value: number) => void 
  }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star 
              className={`h-6 w-6 ${star <= value ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Overall Satisfaction</Label>
          <p className="text-sm text-muted-foreground mb-2">
            How satisfied are you with your overall experience?
          </p>
          <StarRating 
            name="overallSatisfaction" 
            value={formData.overallSatisfaction} 
            onChange={(value) => setFormData(prev => ({ ...prev, overallSatisfaction: value }))}
          />
        </div>
        
        <div>
          <Label className="text-base font-medium">Product Quality</Label>
          <p className="text-sm text-muted-foreground mb-2">
            How would you rate the quality of your RV/home?
          </p>
          <StarRating 
            name="productQuality" 
            value={formData.productQuality} 
            onChange={(value) => setFormData(prev => ({ ...prev, productQuality: value }))}
          />
        </div>
        
        <div>
          <Label className="text-base font-medium">Customer Service</Label>
          <p className="text-sm text-muted-foreground mb-2">
            How would you rate our customer service?
          </p>
          <StarRating 
            name="customerService" 
            value={formData.customerService} 
            onChange={(value) => setFormData(prev => ({ ...prev, customerService: value }))}
          />
        </div>
      </div>
      
      <div>
        <Label className="text-base font-medium">Would you recommend us to others?</Label>
        <RadioGroup 
          value={formData.wouldRecommend} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, wouldRecommend: value }))}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="recommend-yes" />
            <Label htmlFor="recommend-yes">Yes, definitely</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="maybe" id="recommend-maybe" />
            <Label htmlFor="recommend-maybe">Maybe</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="recommend-no" />
            <Label htmlFor="recommend-no">No</Label>
          </div>
        </RadioGroup>
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
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="contactPermission"
            checked={formData.contactPermission}
            onCheckedChange={(checked) => setFormData(prev => ({ 
              ...prev, 
              contactPermission: !!checked 
            }))}
          />
          <Label htmlFor="contactPermission">
            I'm willing to be contacted about my feedback
          </Label>
        </div>
        
        {formData.contactPermission && (
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Feedback
            </>
          )}
        </Button>
      </div>
    </form>
  )
}