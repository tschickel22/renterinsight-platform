import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Globe,
  FileText,
  Wrench,
  Truck,
  Star,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ClientMobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/portal', icon: Globe },
  { name: 'My Quotes', href: '/portal/quotes', icon: FileText },
  { name: 'Service Requests', href: '/portal/service-requests', icon: Wrench },
  { name: 'Order Tracking', href: '/portal/orders', icon: Truck },
  { name: 'Feedback', href: '/portal/surveys', icon: Star }
]

export function ClientMobileNav({ isOpen, onClose }: ClientMobileNavProps) {
  const location = useLocation()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden">
      <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Client Portal</h1>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-6">
          <ul role="list" className="flex flex-col space-y-2">
            {navigation.map((item) => {
              const isActive = 
                (item.href === '/portal' && location.pathname === '/portal') || 
                (item.href !== '/portal' && location.pathname.startsWith(item.href))
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                    onClick={onClose}
                  >
                    <item.icon
                      className={cn(
                        'h-6 w-6 shrink-0',
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}