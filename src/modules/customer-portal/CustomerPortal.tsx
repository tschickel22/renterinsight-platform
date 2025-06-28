import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ClientPortalLayout } from './layout/ClientPortalLayout'
import { Dashboard } from './pages/Dashboard'
import { Quotes } from './pages/Quotes'
import { Deliveries } from './pages/Deliveries'
import { ServiceRequest } from './pages/ServiceRequest'
import { Feedback } from './pages/Feedback'
import { Account } from './pages/Account'

export default function CustomerPortal() {
  return (
    <Routes>
      <Route path="/" element={<ClientPortalLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="quotes" element={<Quotes />} />
        <Route path="deliveries" element={<Deliveries />} />
        <Route path="service" element={<ServiceRequest />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="account" element={<Account />} />
      </Route>
    </Routes>
  )
}