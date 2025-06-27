// ✅ apps/client-portal/src/modules/client-portal/components/ClientPortalLayout.tsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ClientPortalLayoutProps {
  children: React.ReactNode;
}

export function ClientPortalLayout({ children }: ClientPortalLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const impersonateClientId = searchParams.get('impersonateClientId');
    setIsPreview(!!impersonateClientId);
  }, [location.search]);

  const handleExitPreview = () => {
    // Remove the impersonation query param but retain the pathname
    const cleanPath = location.pathname;
    navigate(cleanPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted">
      {isPreview && showBanner && (
        <div className="bg-yellow-100 text-yellow-900 border-b border-yellow-300 py-3 px-4 flex items-center justify-between text-sm z-50 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            You are impersonating a client
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleExitPreview}>
              Exit Preview
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowBanner(false)}>
              Dismiss
            </Button>
          </div>
        </div>
      )}

      <main className={cn('p-6', isPreview && showBanner ? 'pt-10' : '')}>
        {children}
      </main>
    </div>
  );
}

export default ClientPortalLayout;
