import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, Bell, ExternalLink } from 'lucide-react';

const Navbar = ({ onMenuToggle, customerName = 'John Smith' }) => {
  const handleViewDealerDashboard = () => {
    // Redirect to the main dealer dashboard URL
    const dealerDashboardUrl = window.location.origin.replace('/apps/client-portal', '');
    window.open(dealerDashboardUrl, '_blank');
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 md:hidden"
              onClick={onMenuToggle}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">Renter Insight</span>
              <span className="ml-2 text-sm text-gray-500">Client Portal</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link to="/quotes" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Quotes
                </Link>
                <Link to="/documents" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Documents
                </Link>
                <Link to="/service" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Service
                </Link>
                <Link to="/tracking" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Order Tracking
                </Link>
                <Link to="/surveys" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Surveys
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button 
              onClick={handleViewDealerDashboard}
              className="mr-3 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span className="hidden md:inline-block">Dealer Dashboard</span>
            </button>
            <button className="p-1 rounded-full text-gray-700 hover:text-gray-900 focus:outline-none">
              <Bell className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div className="flex items-center">
                <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  <User className="h-6 w-6" />
                  <span className="hidden md:inline-block">{customerName}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;