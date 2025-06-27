// ✅ apps/client-portal/src/modules/client-portal/components/ClientPortalLayout.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ClientPortalLayout({ children }: { children: React.ReactNode }) {
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
    const cleanPath = location.pathname;
    navigate(cleanPath);
  };

  return (
    <div>
      {isPreview && showBanner && (
        <div className="bg-yellow-100 text-yellow-800 border-b border-yellow-300 py-3 px-4 flex items-center justify-between text-sm">
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

      <main className={cn("p-6", isPreview && showBanner ? "pt-10" : "")}>{children}</main>
    </div>
  );
}

export default ClientPortalLayout;
