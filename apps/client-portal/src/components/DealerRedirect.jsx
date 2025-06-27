import React, { useEffect } from 'react';

const DealerRedirect = () => {
  useEffect(() => {
    // Redirect to the main dealer dashboard URL
    // This should be the URL of the main application
    const dealerDashboardUrl = window.location.origin.replace('client-portal', '');
    
    window.location.href = dealerDashboardUrl;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Dealer Dashboard...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
};

export default DealerRedirect;