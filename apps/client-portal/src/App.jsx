import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Quotes from './pages/Quotes';
import Documents from './pages/Documents';
import ServiceRequests from './pages/ServiceRequests';
import OrderTracking from './pages/OrderTracking';
import Surveys from './pages/Surveys';
import Footer from './components/Footer';
import DealerRedirect from './components/DealerRedirect';
import MobileMenu from './components/MobileMenu';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For demo purposes, set to true
  
  // In a real app, this would come from authentication
  const customerData = {
    id: 'cust-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567'
  };

  // If not authenticated, show a login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Client Portal Login</h1>
          <p className="text-center text-gray-600 mb-4">Please log in to access your account</p>
          <button 
            className="w-full bg-primary text-white py-2 rounded-md"
            onClick={() => setIsAuthenticated(true)}
          >
            Demo Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar 
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
          customerName={customerData.name}
        />
        <MobileMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
          customerName={customerData.name}
        />
        
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dealer" element={<DealerRedirect />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/service" element={<ServiceRequests />} />
            <Route path="/tracking" element={<OrderTracking />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;