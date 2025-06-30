// src/components/layout/Header.tsx
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { Button } from '@/components/ui/button'
import { LogOut, User, Menu } from 'lucide-react'

interface HeaderProps {
  onMenuButtonClick: () => void
}

export default function Header({ onMenuButtonClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const { tenant } = useTenant()

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-muted-foreground lg:hidden"
        onClick={onMenuButtonClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
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
