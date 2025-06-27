import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Truck, 
  Wrench, 
  ShoppingBag, 
  Star, 
  User, 
  Menu, 
  X, 
  LogOut 
} from 'lucide-react';

interface ClientPortalLayoutProps {
  children: React.ReactNode;
}

export function ClientPortalLayout({ children }: ClientPortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'My Quotes', href: '/quotes', icon: FileText },
    { name: 'My Deliveries', href: '/deliveries', icon: Truck },
    { name: 'Service Requests', href: '/service', icon: Wrench },
    { name: 'My Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Feedback', href: '/feedback', icon: Star },
    { name: 'My Account', href: '/account', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          {/* Sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75" 
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Sidebar */}
          <div 
            className={`fixed inset-y-0 left-0 z-40 w-64 transition duration-300 transform bg-white ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <h1 className="text-xl font-bold text-primary">Client Portal</h1>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-gray-500 rounded-md hover:text-gray-900 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="px-2 py-4">
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || 
                    (item.href !== '/' && location.pathname.startsWith(item.href));
                  
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="pt-6 mt-6 border-t">
                <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-primary">Client Portal</h1>
          </div>
          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="pt-6 mt-6 border-t">
              <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex items-center h-16 px-4 bg-white border-b lg:hidden">
          <button
            type="button"
            className="p-1 text-gray-500 rounded-md hover:text-gray-900 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-4 text-lg font-bold text-primary">Client Portal</h1>
        </div>

        {/* Main content */}
        <main className="py-6">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}