import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Mail, MessageSquare, Copy } from 'lucide-react'
import { useClientPortalAccounts } from '@/hooks/useClientPortalAccounts'
import { useToast } from '@/hooks/use-toast'
import { Lead } from '@/types'

interface NewClientAccountFormProps {
  lead?: Lead
  onClose: () => void
  onSuccess: (account: any) => void
}

export function NewClientAccountForm({ lead, onClose, onSuccess }: NewClientAccountFormProps) {
  const { createClientAccount, sendInvitation } = useClientPortalAccounts()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sendEmail: true,
    sendSMS: false
  })
  const [tempPassword, setTempPassword] = useState<string | null>(null)
  const [accountCreated, setAccountCreated] = useState(false)

  // Pre-populate form with lead data if provided
  useEffect(() => {
    if (lead) {
      setFormData({
        name: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        phone: lead.phone,
        sendEmail: true,
        sendSMS: !!lead.phone
      })
    }
  }, [lead])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      toast({
        title: 'Validation Error',
        description: 'Name and email are required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const result = await createClientAccount({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        leadId: lead?.id
      }, lead)
      
      setTempPassword(result.tempPassword)
      setAccountCreated(true)
      
      // Send invitations if selected
      if (formData.sendEmail) {
        await sendInvitation(result.id, 'email')
      }
      
      if (formData.sendSMS && formData.phone) {
        await sendInvitation(result.id, 'sms')
      }
      
      toast({
        title: 'Account Created',
        description: 'Client portal account has been created successfully',
      })
      
      // Don't close the modal yet, show the temporary password
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create client account',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPassword = () => {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword)
      toast({
        title: 'Copied',
        description: 'Temporary password copied to clipboard',
      })
    }
  }

  const handleFinish = () => {
    if (accountCreated && tempPassword) {
      onSuccess({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        tempPassword
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{accountCreated ? 'Account Created' : 'Create Client Portal Account'}</CardTitle>
              <CardDescription>
                {accountCreated 
                  ? 'Account has been created successfully' 
                  : 'Create a new account for client portal access'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!accountCreated ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter client's full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter client's email address"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter client's phone number (optional)"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendEmail"
                    checked={formData.sendEmail}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendEmail: !!checked }))}
                  />
                  <Label htmlFor="sendEmail" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Send invitation email
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendSMS"
                    checked={formData.sendSMS}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendSMS: !!checked }))}
                    disabled={!formData.phone}
                  />
                  <Label htmlFor="sendSMS" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send invitation SMS
                    {!formData.phone && <span className="text-xs text-muted-foreground ml-2">(Phone number required)</span>}
                  </Label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-green-700 font-medium">Account created successfully!</p>
                <p className="text-sm text-green-600 mt-1">
                  {formData.sendEmail && 'An invitation email has been sent.'}
                  {formData.sendSMS && formData.phone && ' An invitation SMS has been sent.'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Temporary Password</Label>
                <div className="flex">
                  <Input
                    value={tempPassword || ''}
                    readOnly
                    className="font-mono"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="ml-2"
                    onClick={handleCopyPassword}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Please securely share this temporary password with the client.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button onClick={handleFinish}>
                  Finish
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}