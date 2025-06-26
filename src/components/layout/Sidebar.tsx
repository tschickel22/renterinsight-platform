import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  X,
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
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  open: boolean
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

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <div className={cn(
      "fixed inset-y-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-in-out lg:w-64",
      open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      <div className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center lg:hidden">
        <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-bold text-primary">Renter Insight</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
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
                        onClick={() => onClose()}
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
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}