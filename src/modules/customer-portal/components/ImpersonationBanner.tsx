import React from 'react'

interface ImpersonationBannerProps {
  client: {
    id: string
    name: string
  }
}

export function ImpersonationBanner({ client }: ImpersonationBannerProps) {
  const handleExit = () => {
    // Close the window/tab
    window.close()
  }

  return (
    <div className="bg-yellow-100 p-2 text-sm text-yellow-900 text-center">
      <span className="font-medium">Admin View:</span> Viewing as {client.name} – 
      <button 
        onClick={handleExit}
        className="ml-2 underline hover:text-yellow-700"
      >
        Exit
      </button>
    </div>
  )
}