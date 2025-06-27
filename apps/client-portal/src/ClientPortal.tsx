import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { ClientSignature, CustomerSurvey, Quote, QuoteStatus, ServiceTicket } from '@/types';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils';

function ClientDashboard() {
  const [activeClient, setActiveClient] = useState<any>(null);
  const [clientSignatures, setClientSignatures] = useState<ClientSignature[]>([]);
  const [customerSurveys, setCustomerSurveys] = useState<CustomerSurvey[]>([]);
  
  const { getClientAccountByEmail } = useClientPortalAccounts();
  const { quotes, updateQuote } = useQuoteManagement();
  const { createTicket } = useServiceManagement();
  const { deliveries } = useDeliveryManagement();
  const { vehicles } = useInventoryManagement();

  useEffect(() => {
    // Load client signatures and surveys from localStorage
    const savedSignatures = loadFromLocalStorage('renter-insight-client-signatures', []);
    const savedSurveys = loadFromLocalStorage('renter-insight-customer-surveys', []);
    
    setClientSignatures(savedSignatures);
    setCustomerSurveys(savedSurveys);
    
    // Check for stored client session
    const storedClient = loadFromLocalStorage('renter-insight-client-session', null);
    if (storedClient) {
      setActiveClient(storedClient);
    }
  }, []);

  const handleLogin = (client: any) => {
    setActiveClient(client);
    saveToLocalStorage('renter-insight-client-session', client);
  };

  const handleLogout = () => {
    setActiveClient(null);
    saveToLocalStorage('renter-insight-client-session', null);
  };

  const handleAcceptQuote = async (quoteId: string, signature: ClientSignature) => {
    // Save signature
    const updatedSignatures = [...clientSignatures, signature];
    setClientSignatures(updatedSignatures);
    saveToLocalStorage('renter-insight-client-signatures', updatedSignatures);
    
    // Update quote status
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
      <Routes>
        <Route path="/" element={
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {activeClient.name}</h1>
              <p className="text-gray-600 mt-2">
                Access your quotes, service requests, and delivery information
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">My Quotes</h2>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">View and accept quotes for your Home/RV</p>
                <a href="/quotes" className="text-primary font-medium hover:text-primary-dark">
                  View Quotes →
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Service Requests</h2>
                  <div className="p-2 bg-green-100 rounded-full">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Submit and track service requests</p>
                <a href="/service" className="text-primary font-medium hover:text-primary-dark">
                  Request Service →
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Delivery Tracking</h2>
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Track your Home/RV delivery status</p>
                <a href="/deliveries" className="text-primary font-medium hover:text-primary-dark">
                  Track Deliveries →
                </a>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {clientSignatures.filter(s => s.clientId === activeClient.id).slice(0, 3).map((signature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Quote Accepted
                      </p>
                      <p className="text-sm text-gray-500">
                        You accepted quote #{signature.documentId} on {new Date(signature.signedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {clientSignatures.filter(s => s.clientId === activeClient.id).length === 0 && (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </div>
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
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{activeClient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{activeClient.email}</p>
                </div>
                {activeClient.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{activeClient.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">{activeClient.lastLogin ? new Date(activeClient.lastLogin).toLocaleString() : 'N/A'}</p>
                </div>
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