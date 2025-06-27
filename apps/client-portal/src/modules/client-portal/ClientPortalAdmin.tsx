import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Search, Filter, Users, Eye, Settings, MessageSquare, TrendingUp, Activity, X, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/utils';
import { useClientPortalAccounts } from '@/hooks/useClientPortalAccounts';
import { useToast } from '@/hooks/use-toast';
import { Lead } from '@/types';
import { NewClientAccountForm } from '@/components/NewClientAccountForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PortalDashboard() {
  const { getAllClientAccounts, resetClientPassword, updateClientStatus, sendInvitation, getClientAccountByEmail, getClientAccount } = useClientPortalAccounts();
  const { toast } = useToast();
  const [portalUsers, setPortalUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewClientAccountForm, setShowNewClientAccountForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [activeClient, setActiveClient] = useState<any>(null);
  const query = useQuery();
  const isPreview = query.get('preview') === 'true';
  const previewClientId = query.get('clientId');

  useEffect(() => {
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

    if (isPreview && previewClientId) {
      const clientAccount = getClientAccount(previewClientId);
      if (clientAccount) {
        const impersonated = {
          id: clientAccount.id,
          name: clientAccount.name,
          email: clientAccount.email,
          phone: clientAccount.phone,
          isPreview: true
        };
        setActiveClient(impersonated);
        saveToLocalStorage('renter-insight-client-session', impersonated);
      } else {
        const previewFallback = {
          id: previewClientId,
          name: 'Preview User',
          email: 'preview@example.com',
          isPreview: true
        };
        setActiveClient(previewFallback);
        saveToLocalStorage('renter-insight-client-session', previewFallback);
      }
    } else {
      const storedClient = loadFromLocalStorage('renter-insight-client-session', null);
      if (storedClient) {
        setActiveClient(storedClient);
      }
    }
  }, [getAllClientAccounts, isPreview, previewClientId, getClientAccount]);

  const handleClientPreview = (clientId: string) => {
    const previewUrl = `/client-preview?impersonateClientId=${clientId}`;
    window.open(previewUrl, '_blank');
    toast({
      title: 'Client Preview',
      description: `Opening portal as client ID: ${clientId}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'suspended':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 text-sm text-blue-700">You are impersonating a client. <Button variant="link" size="sm" onClick={() => {
        localStorage.removeItem('renter-insight-client-session');
        window.location.href = '/portal';
      }}>Exit Preview</Button></div>
      {/* ...rest of your admin UI */}
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
