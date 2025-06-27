import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ClientPortalLayoutProps {
  children: React.ReactNode;
}

export function ClientPortalLayout({ children }: ClientPortalLayoutProps) {
  const [searchParams] = useSearchParams();
  const isPreview = !!searchParams.get('impersonateClientId');
  const navigate = useNavigate();

  const handleExitPreview = () => {
    localStorage.removeItem('renter-insight-client-session');
    navigate('/portal');
  };

  return (
    <div className="min-h-screen bg-muted">
      {isPreview && (
        <div className="w-full bg-yellow-100 text-yellow-800 text-sm px-4 py-2 flex justify-between items-center fixed top-0 left-0 z-50">
          <span>You are impersonating a client</span>
          <button
            className="text-sm font-medium underline"
            onClick={handleExitPreview}
          >
            Exit Preview
          </button>
        </div>
      )}
      <main
        className={cn(
          "w-full px-4 pt-6 lg:pt-8",
          isPreview ? 'pt-16' : 'pt-8',
          'lg:pl-64'
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default ClientPortalLayout;
