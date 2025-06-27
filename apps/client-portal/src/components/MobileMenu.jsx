import React from 'react';
import { Link } from 'react-router-dom';
import { X, Home, FileText, FileSignature, Wrench, Truck, BarChart2, ExternalLink } from 'lucide-react';

const MobileMenu = ({ isOpen, onClose, customerName = 'John Smith' }) => {
  if (!isOpen) return null;

  const handleViewDealerDashboard = () => {
    // Get the base URL without the client-portal part
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split('/apps/client-portal')[0];
    const dealerDashboardUrl = baseUrl;
    
    window.open(dealerDashboardUrl, '_blank');
    onClose();
  }

  return (
    <div className="fixed inset-0 flex z-40 md:hidden">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
      
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={onClose}
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
        
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
            <span className="text-xl font-bold text-primary">Renter Insight</span>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            <Link 
              to="/" 
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-gray-100"
              onClick={onClose}
            >
              <Home className="mr-4 h-6 w-6 text-gray-500" />
              Dashboard
            </Link>
            <Link 
              to="/quotes" 
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-gray-100"
              onClick={onClose}
            >
              <FileText className="mr-4 h-6 w-6 text-gray-500" />
              Quotes
            </Link>
            <Link 
              to="/documents" 
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-gray-100"
              onClick={onClose}
            >
              <FileSignature className="mr-4 h-6 w-6 text-gray-500" />
              Documents
            </Link>
            <Link 
              to="/service" 
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-gray-100"
              onClick={onClose}
            >
              <Wrench className="mr-4 h-6 w-6 text-gray-500" />
              Service
            </Link>
            <Link 
              to="/tracking" 
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-gray-100"
              onClick={onClose}
            >
              <Truck className="mr-4 h-6 w-6 text-gray-500" />
              Order Tracking
            </Link>
            <Link 
              to="/surveys" 
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-gray-100"
              onClick={onClose}
            >
              <BarChart2 className="mr-4 h-6 w-6 text-gray-500" />
              Surveys
            </Link>
            <button 
              onClick={handleViewDealerDashboard}
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-gray-100 w-full text-left"
            >
              <ExternalLink className="mr-4 h-6 w-6 text-gray-500" />
              Dealer Dashboard
            </button>
          </nav>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                  {customerName}
                </p>
                <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  View profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 w-14"></div>
    </div>
  );
};

export default MobileMenu;