import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Settings, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProxyClientButton } from './ProxyClientButton'

interface PortalUserCardProps {
  user: {
    id: string
    name: string
    email: string
    status: string
    lastLogin?: Date
    vehicleCount: number
    serviceTickets: number
    invoices: number
  }
  onStatusChange: (userId: string, status: string) => void
}

export function PortalUserCard({ user, onStatusChange }: PortalUserCardProps) {
  const [status, setStatus] = useState(user.status)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'suspended':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    onStatusChange(user.id, newStatus)
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge className={cn("ri-badge-status", getStatusColor(status))}>
            {status.toUpperCase()}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-muted/30 rounded-md">
            <div className="text-lg font-bold">{user.vehicleCount}</div>
            <div className="text-xs text-muted-foreground">Vehicles</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded-md">
            <div className="text-lg font-bold">{user.serviceTickets}</div>
            <div className="text-xs text-muted-foreground">Tickets</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded-md">
            <div className="text-lg font-bold">{user.invoices}</div>
            <div className="text-xs text-muted-foreground">Invoices</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <ProxyClientButton client={user} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}