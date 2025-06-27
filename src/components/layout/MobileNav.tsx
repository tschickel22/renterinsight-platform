import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Users,
  Package,
  Target,
  DollarSign,
  FileText,
  FileCheck,
  ClipboardCheck,
  Wrench,
  Truck,
  Globe,
  Receipt,
  Settings,
  Shield,
  BarChart3,
  Home,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'CRM & Prospecting', href: '/crm', icon: Users },
  { name: 'Inventory Management', href: '/inventory', icon: Package },
  { name: 'Sales Deals', href: '/deals', icon: Target },
  { name: 'Finance', href: '/finance', icon: DollarSign },
  { name: 'Quote Builder', href: '/quotes', icon: FileText },
  { name: 'Agreement Vault', href: '/agreements', icon: FileCheck },
  { name: 'PDI Checklist', href: '/pdi', icon: ClipboardCheck },
  { name: 'Service Operations', href: '/service', icon: Wrench },
  { name: 'Delivery Tracker', href: '/delivery', icon: Truck },
  { name: 'Commission Engine', href: '/commissions', icon: DollarSign },
  { name: 'Client Portal', href: '/portal', icon: Globe },
  { name: 'Invoice & Payments', href: '/invoices', icon: Receipt },
  { name: 'Company Settings', href: '/settings', icon: Settings },
  { name: 'Platform Admin', href: '/admin', icon: Shield },
  { name: 'Reporting Suite', href: '/reports', icon: BarChart3 },
]

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const location = useLocation()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden">
      <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Renter Insight</h1>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-6">
          <ul role="list" className="flex flex-col space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href))
              
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