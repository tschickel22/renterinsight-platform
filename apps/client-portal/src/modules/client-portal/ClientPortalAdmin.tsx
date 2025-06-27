import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useClientPortalAccounts } from '@/hooks/useClientPortalAccounts';
import { useToast } from '@/hooks/use-toast';

function PortalDashboard() {
  const { getAllClientAccounts, resetClientPassword, updateClientStatus, sendInvitation, getClientAccountByEmail, getClientAccount } = useClientPortalAccounts();
  const { toast } = useToast();
  const [portalUsers, setPortalUsers] = useState<any[]>([]);

  // Simulated loading of portal users
  React.useEffect(() => {
    const accounts = getAllClientAccounts();
    setPortalUsers(accounts.map(account => ({
      id: account.id,
      name: account.name,
      email: account.email,
      status: account.status,
      lastLogin: account.lastLogin || new Date(),
      vehicleCount: 1,
      serviceTickets: Math.floor(Math.random() * 3),
      invoices: Math.floor(Math.random() * 4)
    })));
  }, [getAllClientAccounts]);

  const handleClientPreview = (clientId: string) => {
    const previewUrl = `/client-preview?impersonateClientId=${clientId}`;
    window.open(previewUrl, '_blank');
    toast({
      title: 'Client Preview',
      description: 'Opening client portal in impersonation mode'
    });
  };

  return (
    <div className="p-6">
      {/* Admin dashboard logic and UI for managing client accounts */}
      {/* Build listing table, actions, and client previews here */}
    </div>
  );
}

export function ClientPortalAdmin() {
  return (
    <Routes>
      <Route path="/" element={<PortalDashboard />} />
      <Route path="/*" element={<PortalDashboard />} />
    </Routes>
  );
}

export default ClientPortalAdmin;
