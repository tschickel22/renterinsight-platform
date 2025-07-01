import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Save, User, Mail, Phone, MapPin, Tag, DollarSign, CheckCircle } from 'lucide-react'
import { Lead, LeadStatus } from '../types'
import { useLeadManagement } from '../hooks/useLeadManagement'
import { useToast } from '@/hooks/use-toast'

interface NewLeadFormProps {
  onClose: () => void
  onSuccess: (lead: Lead) => void
}

export function NewLeadForm({ onClose, onSuccess }: NewLeadFormProps) {
  const { sources, salesReps, createLead } = useLeadManagement()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    source: '',
    sourceId: '',
    assignedTo: '',
    notes: '',
    customFields: {
      budget: '',
      timeframe: '',
      experience: '',
      interests: '',
      preferredContact: 'email'
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.sourceId) {
      newErrors.sourceId = 'Lead source is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const selectedSource = sources.find(s => s.id === formData.sourceId)
      
      const leadData: Partial<Lead> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        source: selectedSource?.name || '',
        sourceId: formData.sourceId,
        assignedTo: formData.assignedTo || undefined,
        notes: formData.notes.trim(),
        customFields: {
          ...formData.customFields,
          interests: formData.customFields.interests.trim()
        }
      }

      const newLead = await createLead(leadData)
      
      toast({
        title: 'Lead Created Successfully!',
        description: `${newLead.firstName} ${newLead.lastName} has been added to your CRM.`,
        variant: 'default'
      })
      
      onSuccess(newLead)
      onClose()
    } catch (error) {
      console.error('Error creating lead:', error)
      toast({
        title: 'Error Creating Lead',
        description: 'There was a problem creating the lead. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const updateCustomField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customFields: { ...prev.customFields, [field]: value }
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                Add New Lead
              </CardTitle>
              <CardDescription>
                Create a new lead and start the sales process
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="h-4 w-4 mr-2" />
                Contact Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="Enter first name"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Enter last name"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="Enter email address"
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Lead Source & Assignment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Lead Details
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="source">Lead Source *</Label>
                  <Select value={formData.sourceId} onValueChange={(value) => updateFormData('sourceId', value)}>
                    <SelectTrigger className={errors.sourceId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select lead source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map(source => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sourceId && (
                    <p className="text-sm text-red-500 mt-1">{errors.sourceId}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="assignedTo">Assign to Sales Rep</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => updateFormData('assignedTo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sales rep (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {salesReps.map(rep => (
                        <SelectItem key={rep.id} value={rep.id}>
                          {rep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Additional Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select 
                    value={formData.customFields.budget} 
                    onValueChange={(value) => updateCustomField('budget', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Under $50k">Under $50k</SelectItem>
                      <SelectItem value="$50k-$100k">$50k-$100k</SelectItem>
                      <SelectItem value="$100k-$150k">$100k-$150k</SelectItem>
                      <SelectItem value="$150k-$200k">$150k-$200k</SelectItem>
                      <SelectItem value="$200k+">$200k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeframe">Purchase Timeframe</Label>
                  <Select 
                    value={formData.customFields.timeframe} 
                    onValueChange={(value) => updateCustomField('timeframe', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediate">Immediate (within 1 month)</SelectItem>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6-12 months">6-12 months</SelectItem>
                      <SelectItem value="12+ months">12+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="experience">RV Experience</Label>
                  <Select 
                    value={formData.customFields.experience} 
                    onValueChange={(value) => updateCustomField('experience', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First-time buyer">First-time buyer</SelectItem>
                      <SelectItem value="Some experience">Some experience</SelectItem>
                      <SelectItem value="Experienced RVer">Experienced RVer</SelectItem>
                      <SelectItem value="Expert/Full-timer">Expert/Full-timer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                  <Select 
                    value={formData.customFields.preferredContact} 
                    onValueChange={(value) => updateCustomField('preferredContact', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="text">Text/SMS</SelectItem>
                      <SelectItem value="any">Any method</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="interests">Interests/Requirements</Label>
                <Input
                  id="interests"
                  value={formData.customFields.interests}
                  onChange={(e) => updateCustomField('interests', e.target.value)}
                  placeholder="e.g., Class A Motorhome, Solar panels, Pet-friendly"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Add any additional notes about this lead..."
                  rows={3}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Lead...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Lead
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}