import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ClientPortalRedirect = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Get the correct client portal URL in the WebContainer environment
    const clientPortalUrl = `${window.location.origin}/apps/client-portal/index.html`;
    
    // If we have a user, we can pass some authentication information
    const url = user ? `${clientPortalUrl}?userId=${user.id}` : clientPortalUrl;
    
    window.location.href = url;
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Client Portal...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
};

export default ClientPortalRedirect;