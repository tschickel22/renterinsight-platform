import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { Button } from '@/components/ui/button'
import { LogOut, User, ExternalLink } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const { tenant } = useTenant()

  const handleViewClientPortal = () => {
    // Open the client portal in a new tab
    window.open(`${window.location.origin}/apps/client-portal/`, '_blank');
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h2 className="text-lg font-semibold text-foreground">
            {tenant?.name || 'Renter Insight CRM/DMS'}
          </h2>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center gap-x-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {user?.name}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewClientPortal}
            className="flex items-center gap-x-2 mr-2"
          >
            <ExternalLink className="h-4 w-4" />
            Client Portal
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="flex items-center gap-x-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}