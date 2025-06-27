import React from 'react'
import { Button } from '@/components/ui/button'
import { Globe, LayoutDashboard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface TogglePortalButtonProps {
  currentView: 'client' | 'dealer'
}

export function TogglePortalButton({ currentView }: TogglePortalButtonProps) {
  const navigate = useNavigate()

  const handleToggle = () => {
    if (currentView === 'client') {
      // Switch to dealer view
      navigate('/')
    } else {
      // Switch to client view
      navigate('/portal')
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleToggle}
      className="fixed bottom-4 right-4 shadow-md z-50"
    >
      {currentView === 'client' ? (
        <>
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Switch to Dealer
        </>
      ) : (
        <>
          <Globe className="h-4 w-4 mr-2" />
          Switch to Client Portal
        </>
      )}
    </Button>
  )
}