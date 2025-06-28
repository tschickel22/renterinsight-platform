import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface InviteClientModalProps {
  onInvite: (userData: any) => Promise<void>
  onCancel: () => void
}

export function InviteClientModal({ onInvite, onCancel }: InviteClientModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sendInviteEmail: true,
    grantAccess: {
      vehicles: true,
      service: true,
      quotes: true,
      documents: true
    }
  })

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
      await onInvite(formData)
      toast({
        title: 'Success',
        description: 'Invitation sent successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
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
              <CardTitle>Invite Client to Portal</CardTitle>
              <CardDescription>
                Send an invitation to access the client portal
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
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter client name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendInviteEmail"
                checked={formData.sendInviteEmail}
                onCheckedChange={(checked) => setFormData(prev => ({ 
                  ...prev, 
                  sendInviteEmail: !!checked 
                }))}
              />
              <Label htmlFor="sendInviteEmail">Send invitation email</Label>
            </div>
            
            <div className="space-y-2">
              <Label>Grant Access To:</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accessVehicles"
                    checked={formData.grantAccess.vehicles}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      grantAccess: {
                        ...prev.grantAccess,
                        vehicles: !!checked
                      }
                    }))}
                  />
                  <Label htmlFor="accessVehicles">Vehicles</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accessService"
                    checked={formData.grantAccess.service}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      grantAccess: {
                        ...prev.grantAccess,
                        service: !!checked
                      }
                    }))}
                  />
                  <Label htmlFor="accessService">Service</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accessQuotes"
                    checked={formData.grantAccess.quotes}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      grantAccess: {
                        ...prev.grantAccess,
                        quotes: !!checked
                      }
                    }))}
                  />
                  <Label htmlFor="accessQuotes">Quotes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accessDocuments"
                    checked={formData.grantAccess.documents}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      grantAccess: {
                        ...prev.grantAccess,
                        documents: !!checked
                      }
                    }))}
                  />
                  <Label htmlFor="accessDocuments">Documents</Label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitation
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