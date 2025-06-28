import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ImpersonationBannerProps {
  customerName: string
  onExit: () => void
}

export function ImpersonationBanner({ customerName, onExit }: ImpersonationBannerProps) {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
        <div>
          <p className="font-medium text-yellow-700">
            Impersonation Mode Active
          </p>
          <p className="text-sm text-yellow-600">
            You are viewing the portal as {customerName}. This is a read-only view.
          </p>
        </div>
      </div>
      <button 
        onClick={onExit}
        className="p-1 rounded-full hover:bg-yellow-200 transition-colors"
        aria-label="Exit impersonation"
      >
        <X className="h-5 w-5 text-yellow-600" />
      </button>
    </div>
  )
}