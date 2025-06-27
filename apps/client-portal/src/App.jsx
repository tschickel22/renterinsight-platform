import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Quotes from './pages/Quotes';
import Documents from './pages/Documents';
import ServiceRequests from './pages/ServiceRequests';
import OrderTracking from './pages/OrderTracking';
import Surveys from './pages/Surveys';
import Footer from './components/Footer';
import MobileMenu from './components/MobileMenu';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/service" element={<ServiceRequests />} />
            <Route path="/tracking" element={<OrderTracking />} />
            <Route path="/surveys" element={<Surveys />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;