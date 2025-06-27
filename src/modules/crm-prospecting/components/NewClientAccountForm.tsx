import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, Mail, User, Globe } from 'lucide-react'
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
  const [tempPassword, setTempPassword] = useState('')
  const [showTempPassword, setShowTempPassword] = useState(false)

  // Generate a random password when the component mounts
  useState(() => {
    const randomPassword = Math.random().toString(36).slice(2, 10) + 
                          Math.random().toString(36).slice(2, 10).toUpperCase() + 
                          "!1"
    setTempPassword(randomPassword)
  })

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
      
      if (!sendInvite) {
        // Show the temporary password if not sending an invite
        setShowTempPassword(true)
      } else {
        // Close the form if sending an invite
        setTimeout(() => {
          onCancel()
        }, 1500)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create client account',
        variant: 'destructive'
      })
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Create Client Portal Account</CardTitle>
                <CardDescription>
                  Create a new client portal account and optionally send an invitation
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showTempPassword ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <h3 className="font-semibold text-green-700 mb-2">Account Created Successfully!</h3>
                <p className="text-green-600 mb-4">
                  The client account has been created. Please provide the following credentials to the client:
                </p>
                <div className="bg-white p-3 rounded border mb-2">
                  <p className="font-medium">Email: <span className="font-mono">{email}</span></p>
                  <p className="font-medium">Temporary Password: <span className="font-mono">{tempPassword}</span></p>
                </div>
                <p className="text-sm text-green-600">
                  The client will be prompted to change their password on first login.
                </p>
              </div>
              <div className="flex justify-end">
                <Button onClick={onCancel}>Close</Button>
              </div>
            </div>
          ) : (
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
              
              {sendInvite ? (
                <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                  <p>
                    An email will be sent to the client with instructions on how to set up their account
                    and access the client portal.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 rounded-md text-sm text-yellow-700">
                  <p>
                    A temporary password will be generated. You'll need to provide this password to the client manually.
                  </p>
                </div>
              )}
              
              {leadId && (
                <div className="p-3 bg-green-50 rounded-md text-sm text-green-700">
                  <p>
                    This account will be linked to the selected lead in your CRM.
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}