import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { TenantProvider } from '@/contexts/TenantContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import PlatformSettings from '@/modules/platform-admin/settings'

// Module imports
import CRMProspecting from '@/modules/crm-prospecting/CRMProspecting'
import InventoryManagement from '@/modules/inventory-management/InventoryManagement'
import QuoteBuilder from '@/modules/quote-builder/QuoteBuilder'
import { FinanceModule } from '@/modules/finance/FinanceModule'
import CRMSalesDeal from '@/modules/crm-sales-deal/CRMSalesDeal'
import AgreementVault from '@/modules/agreement-vault/AgreementVault'
import ServiceOps from '@/modules/service-ops/ServiceOps'
import DeliveryTracker from '@/modules/delivery-tracker/DeliveryTracker'
import PDIChecklist from '@/modules/pdi-checklist/PDIChecklist'
import CommissionEngine from '@/modules/commission-engine/CommissionEngine'
import ClientPortal from '@/modules/client-portal/ClientPortal'
import InvoicePayments from '@/modules/invoice-payments/InvoicePayments'
import CompanySettings from '@/modules/company-settings/CompanySettings'
import PlatformAdmin from '@/modules/platform-admin/PlatformAdmin'
import ReportingSuite from '@/modules/reporting-suite/ReportingSuite'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="renter-insight-theme">
      <AuthProvider>
        <Router>
          <TenantProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/crm/*" element={<CRMProspecting />} />
                          <Route path="/inventory/*" element={<InventoryManagement />} />
                          <Route path="/deals/*" element={<CRMSalesDeal />} />
                          <Route path="/finance/*" element={<FinanceModule />} />
                          <Route path="/quotes/*" element={<QuoteBuilder />} />
                          <Route path="/agreements/*" element={<AgreementVault />} />
                          <Route path="/service/*" element={<ServiceOps />} />
                          <Route path="/pdi/*" element={<PDIChecklist />} />
                          <Route path="/delivery/*" element={<DeliveryTracker />} />
                          <Route path="/commissions/*" element={<CommissionEngine />} />
                          <Route path="/portal/*" element={<ClientPortal />} />
                          <Route path="/invoices/*" element={<InvoicePayments />} />
                          <Route path="/settings/*" element={<CompanySettings />} />
                          <Route path="/admin/*" element={<PlatformAdmin />} />
                          <Route path="/admin/settings/*" element={<PlatformSettings />} />
                          <Route path="/reports/*" element={<ReportingSuite />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Toaster />
            </div>
          </TenantProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App