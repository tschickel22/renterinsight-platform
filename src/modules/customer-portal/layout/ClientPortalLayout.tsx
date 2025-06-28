import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  FileText, 
  Truck, 
  Wrench, 
  MessageSquare, 
  User, 
  LogOut 
} from 'lucide-react'
import { useImpersonationClient } from '../hooks/useImpersonationClient'
import { ImpersonationBanner } from '../components/ImpersonationBanner'

export function ClientPortalLayout() {
  const location = useLocation()
  const { client } = useImpersonationClient()

  const navigation = [
    { name: 'Dashboard', href: '/customer-portal', icon: Home },
    { name: 'Quotes', href: '/customer-portal/quotes', icon: FileText },
    { name: 'Deliveries', href: '/customer-portal/deliveries', icon: Truck },
    { name: 'Service', href: '/customer-portal/service', icon: Wrench },
    { name: 'Feedback', href: '/customer-portal/feedback', icon: MessageSquare },
    { name: 'Account', href: '/customer-portal/account', icon: User },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Impersonation Banner */}
      {client && <ImpersonationBanner client={client} />}
      
      {/* Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-primary">Client Portal</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href || 
                      (item.href !== '/customer-portal' && location.pathname.startsWith(item.href))
                    
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                            ${isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }
                          `}
                        >
                          <item.icon
                            className={`
                              h-6 w-6 shrink-0
                              ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                            `}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <Button variant="ghost" className="w-full justify-start">
                  <LogOut className="h-6 w-6 mr-2" />
                  Sign Out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}