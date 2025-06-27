import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, FileSignature, Wrench, Truck, BarChart2, Bell } from 'lucide-react';

const Dashboard = () => {
  // Mock data
  const recentActivity = [
    { id: 1, type: 'quote', title: 'Quote #Q-2024-001 sent', date: '2 days ago' },
    { id: 2, type: 'service', title: 'Service ticket #ST-2024-003 updated', date: '3 days ago' },
    { id: 3, type: 'document', title: 'Purchase agreement signed', date: '1 week ago' },
    { id: 4, type: 'delivery', title: 'Delivery scheduled for your Home/RV', date: '1 week ago' },
  ];

  const notifications = [
    { id: 1, title: 'Your quote is ready for review', description: 'Please review and accept by June 15', isNew: true },
    { id: 2, title: 'Service completed', description: 'Your Home/RV service has been completed', isNew: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome, John</h1>
        <p className="text-gray-500">
          Here's what's happening with your Home/RV
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Link to="/quotes" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-blue-50 rounded-full mb-2">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-medium">Quotes</h3>
            <p className="text-xs text-gray-500 mt-1">View & accept quotes</p>
          </div>
        </Link>
        
        <Link to="/documents" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-purple-50 rounded-full mb-2">
              <FileSignature className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-medium">Documents</h3>
            <p className="text-xs text-gray-500 mt-1">Sign & view documents</p>
          </div>
        </Link>
        
        <Link to="/service" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-green-50 rounded-full mb-2">
              <Wrench className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="font-medium">Service</h3>
            <p className="text-xs text-gray-500 mt-1">Request & track service</p>
          </div>
        </Link>
        
        <Link to="/tracking" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-yellow-50 rounded-full mb-2">
              <Truck className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="font-medium">Tracking</h3>
            <p className="text-xs text-gray-500 mt-1">Track your delivery</p>
          </div>
        </Link>
        
        <Link to="/surveys" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-red-50 rounded-full mb-2">
              <BarChart2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="font-medium">Surveys</h3>
            <p className="text-xs text-gray-500 mt-1">Share your feedback</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <a href="#" className="text-sm text-primary hover:underline">View all activity</a>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start">
                {notification.isNew && (
                  <span className="h-2 w-2 bg-red-500 rounded-full mt-2 mr-3"></span>
                )}
                {!notification.isNew && (
                  <span className="h-2 w-2 bg-gray-300 rounded-full mt-2 mr-3"></span>
                )}
                <div>
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <a href="#" className="text-sm text-primary hover:underline">View all notifications</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;