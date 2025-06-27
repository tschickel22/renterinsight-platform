import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Mail, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface NewClientAccountFormProps {
  leadId?: string
  leadName?: string
  leadEmail?: string
  onSave: (accountData: { email: string; name: string; sendInvite: boolean; leadId?: string }) => Promise<void>
  onCancel: () => void
}

export function NewClientAccountForm({ leadId, leadName, leadEmail, onSave, onCancel }: NewClientAccountFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(leadEmail || '')
  const [name, setName] = useState(leadName || '')
  const [sendInvite, setSendInvite] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Email and name are required',
        variant: 'destructive'
      })
      return
    }

    if (!email.includes('@')) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave({
        email,
        name,
        sendInvite,
        leadId
      })
      
      toast({
        title: 'Success',
        description: sendInvite 
          ? 'Client account created and invitation sent' 
          : 'Client account created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create client account',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create Client Portal Account</CardTitle>
              <CardDescription>
                Create a new client portal account and optionally send an invitation
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Client Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter client's full name"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter client's email address"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendInvite"
                checked={sendInvite}
                onCheckedChange={(checked) => setSendInvite(!!checked)}
              />
              <Label htmlFor="sendInvite">Send invitation email</Label>
            </div>
            
            {sendInvite && (
              <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                <p>
                  An email will be sent to the client with instructions on how to set up their account
                  and access the client portal.
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
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
        </CardContent>
      </Card>
    </div>
  )
}