// src/components/layout/Sidebar.tsx
import React, { Fragment } from 'react'
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
  Cog,
  X
} from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'

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
  { name: 'Platform Settings', href: '/admin/settings', icon: Cog },
  { name: 'Reporting Suite', href: '/reports', icon: BarChart3 },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
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
                                  onClick={() => setSidebarOpen(false)} // Close sidebar on navigation
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
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
    </>
  )
}
