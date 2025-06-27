import * as React from 'react';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { ClientPortalLayout } from './components/ClientPortalLayout';
import { ClientLogin } from './components/ClientLogin';
import { QuoteAcceptance } from './components/QuoteAcceptance';
import { ServiceRequestForm } from './components/ServiceRequestForm';
import { OrderTracking } from './components/OrderTracking';
import { CustomerSurveyForm } from './components/CustomerSurvey';
import { useClientPortalAccounts } from '@/hooks/useClientPortalAccounts';
import { useQuoteManagement } from '@/modules/crm-prospecting/hooks/useQuoteManagement';
import { useServiceManagement } from '@/modules/service-ops/hooks/useServiceManagement';
import { useDeliveryManagement } from '@/modules/delivery-tracker/hooks/useDeliveryManagement';
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement';
import { ClientSignature, CustomerSurvey, QuoteStatus, ServiceTicket } from '@/types';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils';

function ClientDashboard() {
  const [activeClient, setActiveClient] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const impersonateClientId = searchParams.get('impersonateClientId');
  const [clientSignatures, setClientSignatures] = useState<ClientSignature[]>([]);
  const [customerSurveys, setCustomerSurveys] = useState<CustomerSurvey[]>([]);

  const { getClientAccountByEmail } = useClientPortalAccounts();
  const { quotes, updateQuote } = useQuoteManagement();
  const { createTicket } = useServiceManagement();
  const { deliveries } = useDeliveryManagement();
  const { vehicles } = useInventoryManagement();

  useEffect(() => {
    console.log("Impersonate Client ID:", impersonateClientId);
    console.log("Active Client (before set):", activeClient);

    const savedSignatures = loadFromLocalStorage('renter-insight-client-signatures', []);
    const savedSurveys = loadFromLocalStorage('renter-insight-customer-surveys', []);
    setClientSignatures(savedSignatures);
    setCustomerSurveys(savedSurveys);

    if (impersonateClientId) {
      const { getAllClientAccounts, getClientAccount } = useClientPortalAccounts();
      const clientAccount = getClientAccount(impersonateClientId);

      if (clientAccount) {
        setActiveClient({
          id: clientAccount.id,
          name: clientAccount.name,
          email: clientAccount.email,
          phone: clientAccount.phone,
          isImpersonated: true
        });
      } else {
        const allAccounts = getAllClientAccounts();
        if (allAccounts.length > 0) {
          const firstAccount = allAccounts[0];
          setActiveClient({
            id: firstAccount.id,
            name: firstAccount.name,
            email: firstAccount.email,
            phone: firstAccount.phone,
            isImpersonated: true
          });
        } else {
          setActiveClient({
            id: impersonateClientId,
            name: 'Client User',
            email: 'client@example.com',
            isImpersonated: true
          });
        }
      }
    } else {
      const storedClient = loadFromLocalStorage('renter-insight-client-session', null);
      if (storedClient) {
        setActiveClient(storedClient);
      }
    }
  }, [impersonateClientId]);

  const handleLogin = (client: any) => {
    setActiveClient(client);
    saveToLocalStorage('renter-insight-client-session', client);
  };

  const handleLogout = () => {
    setActiveClient(null);
    saveToLocalStorage('renter-insight-client-session', null);
  };

  const handleAcceptQuote = async (quoteId: string, signature: ClientSignature) => {
    const updatedSignatures = [...clientSignatures, signature];
    setClientSignatures(updatedSignatures);
    saveToLocalStorage('renter-insight-client-signatures', updatedSignatures);
    await updateQuote(quoteId, { status: QuoteStatus.ACCEPTED });
  };

  const handleSubmitServiceRequest = async (serviceData: Partial<ServiceTicket>) => {
    await createTicket(serviceData);
  };

  const handleSubmitSurvey = async (surveyData: Partial<CustomerSurvey>) => {
    const newSurvey: CustomerSurvey = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: surveyData.clientId || '',
      serviceTicketId: surveyData.serviceTicketId,
      deliveryId: surveyData.deliveryId,
      rating: surveyData.rating || 0,
      comments: surveyData.comments || '',
      submittedAt: new Date()
    };
    const updatedSurveys = [...customerSurveys, newSurvey];
    setCustomerSurveys(updatedSurveys);
    saveToLocalStorage('renter-insight-customer-surveys', updatedSurveys);
  };

  if (!activeClient) {
    return <ClientLogin onLogin={handleLogin} />;
  }

  return (
    <ClientPortalLayout>
      <div className="mb-4 text-green-700 font-semibold">CLIENT PORTAL COMPONENT LOADED</div>
      <Routes>
        <Route path="/" element={
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {activeClient.name}</h1>
              <p className="text-gray-600 mt-2">
                Access your quotes, service requests, and delivery information
              </p>
            </div>
            {/* -- Cards & Activity Timeline (unchanged) -- */}
          </div>
        } />
        <Route path="/quotes" element={
          <QuoteAcceptance 
            clientId={activeClient.id} 
            quotes={quotes}
            onAcceptQuote={handleAcceptQuote}
          />
        } />
        <Route path="/service" element={
          <ServiceRequestForm 
            clientId={activeClient.id}
            vehicles={vehicles}
            onSubmit={handleSubmitServiceRequest}
          />
        } />
        <Route path="/deliveries" element={
          <OrderTracking 
            clientId={activeClient.id}
            deliveries={deliveries}
          />
        } />
        <Route path="/feedback" element={
          <CustomerSurveyForm 
            clientId={activeClient.id}
            onSubmit={handleSubmitSurvey}
          />
        } />
        <Route path="/account" element={
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Account</h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Account Information</h3>
              <div className="space-y-4">
                <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{activeClient.name}</p></div>
                <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{activeClient.email}</p></div>
                {activeClient.phone && <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{activeClient.phone}</p></div>}
                <div><p className="text-sm text-gray-500">Last Login</p><p className="font-medium">{activeClient.lastLogin ? new Date(activeClient.lastLogin).toLocaleString() : 'N/A'}</p></div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ClientPortalLayout>
  );
}

export default function ClientPortal() {
  return (
    <Routes>
      <Route path="/*" element={<ClientDashboard />} />
    </Routes>
  );
}
