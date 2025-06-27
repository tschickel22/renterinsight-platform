import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Renter Insight. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;