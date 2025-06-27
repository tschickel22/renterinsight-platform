import React, { ReactNode, useState } from 'react'
import { ClientHeader } from './ClientHeader'
import { ClientMobileNav } from './ClientMobileNav'

interface ClientLayoutProps {
  children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <ClientMobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <ClientHeader onMobileMenuClick={() => setMobileNavOpen(true)} />
      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}