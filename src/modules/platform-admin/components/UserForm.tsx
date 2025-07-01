import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Save, User, Mail, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { UserRole } from '@/types'

interface UserFormProps {
  tenantId: string
  user?: any
  onSave: (userData: any) => Promise<void>
  onCancel: () => void
}

export function UserForm({ tenantId, user, onSave, onCancel }: UserFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || UserRole.USER,
    isActive: user?.is_active !== false,
    sendInvite: !user
  })

  const handleSubmit = (e: React.FormEvent) => {
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
      // Create the user data object
      const userData = {
        id: user?.id,
        ...formData,
        tenantId,
        createdAt: user?.created_at || new Date()
      };
      
      onSave(userData);
      
      toast({
        title: 'Success',
        description: `User ${user ? 'updated' : 'added'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${user ? 'update' : 'add'} user`,
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
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                {user ? 'Edit User' : 'Add User'}
              </CardTitle>
              <CardDescription>
                {user ? 'Update user details' : 'Add a new user to this tenant'}
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
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Smith"
                  className="pl-10"
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
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.smith@example.com"
                  className="pl-10"
                  disabled={!!user} // Disable email editing for existing users
                />
              </div>
              {user && (
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed for existing users
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select 
                  value={formData.role} 
                  onValueChange={(value: UserRole) => setFormData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                    <SelectItem value={UserRole.SALES}>Sales</SelectItem>
                    <SelectItem value={UserRole.SERVICE}>Service</SelectItem>
                    <SelectItem value={UserRole.USER}>User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
              />
              <Label htmlFor="isActive">Active user</Label>
            </div>
            
            {!user && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendInvite"
                  checked={formData.sendInvite}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendInvite: !!checked }))}
                />
                <Label htmlFor="sendInvite">Send invitation email</Label>
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
                    {user ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {user ? 'Update User' : 'Add User'}
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
