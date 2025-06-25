import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Users,
  Package,
  Target,
  FileText,
  FileCheck,
  Wrench,
  Truck,
  DollarSign,
  Globe,
  Receipt,
  Settings,
  Shield,
  BarChart3,
  Home
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'CRM & Prospecting', href: '/crm', icon: Users },
  { name: 'Inventory Management', href: '/inventory', icon: Package },
  { name: 'Sales Deals', href: '/deals', icon: Target },
  { name: 'Quote Builder', href: '/quotes', icon: FileText },
  { name: 'Agreement Vault', href: '/agreements', icon: FileCheck },
  { name: 'Service Operations', href: '/service', icon: Wrench },
  { name: 'Delivery Tracker', href: '/delivery', icon: Truck },
  { name: 'Commission Engine', href: '/commissions', icon: DollarSign },
  { name: 'Client Portal', href: '/portal', icon: Globe },
  { name: 'Invoice & Payments', href: '/invoices', icon: Receipt },
  { name: 'Company Settings', href: '/settings', icon: Settings },
  { name: 'Platform Admin', href: '/admin', icon: Shield },
  { name: 'Reporting Suite', href: '/reports', icon: BarChart3 },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
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