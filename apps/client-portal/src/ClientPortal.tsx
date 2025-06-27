import * as React from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
  const [searchParams] = useSearchParams();
  const impersonateClientId = searchParams.get('impersonateClientId');

  const [activeClient, setActiveClient] = useState<any>(null);
  const [clientSignatures, setClientSignatures] = useState<ClientSignature[]>([]);
  const [customerSurveys, setCustomerSurveys] = useState<CustomerSurvey[]>([]);

  const { getClientAccount, getAllClientAccounts } = useClientPortalAccounts();
  const { quotes, updateQuote } = useQuoteManagement();
  const { createTicket } = useServiceManagement();
  const { deliveries } = useDeliveryManagement();
  const { vehicles } = useInventoryManagement();

  useEffect(() => {
    console.log("🔍 Preview Path:", window.location.pathname);
    console.log("📩 impersonateClientId:", impersonateClientId);

    const savedSignatures = loadFromLocalStorage('renter-insight-client-signatures', []);
    const savedSurveys = loadFromLocalStorage('renter-insight-customer-surveys', []);
    setClientSignatures(savedSignatures);
    setCustomerSurveys(savedSurveys);

    if (impersonateClientId) {
      const clientAccount = getClientAccount(impersonateClientId);
      if (clientAccount) {
        setActiveClient({ ...clientAccount, isImpersonated: true });
      } else {
        const fallback = getAllClientAccounts()[0];
        if (fallback) {
          setActiveClient({ ...fallback, isImpersonated: true });
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
      const stored = loadFromLocalStorage('renter-insight-client-session', null);
      if (stored) {
        setActiveClient(stored);
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
    const updated = [...clientSignatures, signature];
    setClientSignatures(updated);
    saveToLocalStorage('renter-insight-client-signatures', updated);
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
      <div className="text-sm text-green-700 font-medium mb-4">CLIENT PORTAL COMPONENT LOADED</div>
      <Routes>
        <Route path="/" element={<HomeDashboard activeClient={activeClient} clientSignatures={clientSignatures} />} />
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
          <div className="p-6 bg-white shadow rounded">Logged in as {activeClient.name}</div>
        } />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </ClientPortalLayout>
  );
}

function HomeDashboard({ activeClient, clientSignatures }: { activeClient: any, clientSignatures: ClientSignature[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {activeClient.name}</h1>
      <p className="text-gray-600">This is your personalized client dashboard.</p>
      {clientSignatures.length > 0 ? (
        <div>
          <h2 className="font-semibold text-lg">Recent Signatures</h2>
          <ul className="text-sm text-gray-700 list-disc ml-5">
            {clientSignatures.map((sig, i) => (
              <li key={i}>Signed doc #{sig.documentId} on {new Date(sig.signedAt).toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No recent activity.</p>
      )}
    </div>
  );
}

export default function ClientPortal() {
  return (
    <Routes>
      <Route path="/" element={<ClientDashboard />} />
      <Route path="/*" element={<ClientDashboard />} />
    </Routes>
  );
}
