import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  User 
}

export function ClientPortalLayout({ children }: ClientPortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isPreview = searchParams.get('preview') === 'true';
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const isPreview = searchParams.get('preview') === 'true'
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isPreview = searchParams.get('preview') === 'true';

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'My Account', href: '/account', icon: User }
  ];

  // Preserve preview parameters when navigating
  React.useEffect(() => {
    if (isPreview) {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a');
        
        if (link && link.getAttribute('href')?.startsWith('/') && !link.getAttribute('href')?.includes('?')) {
          e.preventDefault();
          const href = link.getAttribute('href');
          if (href) {
            navigate(`${href}?${searchParams.toString()}`);
          }
        }
      };
      
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isPreview, searchParams, navigate]);

  // Preserve preview parameters when navigating
  useEffect(() => {
    if (isPreview) {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a');
        
        if (link && link.getAttribute('href')?.startsWith('/') && !link.getAttribute('href')?.includes('?')) {
          e.preventDefault();
          const href = link.getAttribute('href');
          if (href) {
            navigate(`${href}?${searchParams.toString()}`);
          }
        }
      };
      
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isPreview, searchParams, navigate]);

  // Preserve preview parameters when navigating
  React.useEffect(() => {
    if (isPreview) {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const link = target.closest('a')
        
        if (link && link.getAttribute('href')?.startsWith('/') && !link.getAttribute('href')?.includes('?')) {
          e.preventDefault()
          const href = link.getAttribute('href')
          if (href) {
            navigate(`${href}?${searchParams.toString()}`)
          }
        }
      }
      
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [isPreview, searchParams, navigate])

  return (
    <div className="min-h-screen bg-gray-50">
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-2 text-center z-50">
          <p className="text-sm font-medium">Client Portal Preview Mode</p>
        </div>
      )}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-2 text-center z-50">
          <p className="text-sm font-medium">Client Portal Preview Mode</p>
        </div>
      )}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-2 text-center z-50">
          <p className="text-sm font-medium">Client Portal Preview Mode</p>
        </div>
      )}
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col ${isPreview ? 'lg:top-8' : ''}`}>
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-primary">Client Portal</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`lg:pl-64 ${isPreview ? 'pt-8' : ''}`}>
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex items-center h-16 px-4 bg-white border-b lg:hidden">
          <button
          >
          </button>
        </div>
      </div>
    </div>
  );
}