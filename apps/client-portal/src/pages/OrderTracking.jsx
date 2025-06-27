import React, { useState } from 'react';
import { Truck, MapPin, Calendar, Clock, CheckCircle, Package, Eye } from 'lucide-react';
import DeliveryDetailModal from '../components/tracking/DeliveryDetailModal';

const OrderTracking = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock deliveries data
  const deliveries = [
    {
      id: 'DEL-2024-001',
      vehicleId: 'VIN-12345',
      vehicleInfo: '2024 Forest River Georgetown',
      status: 'scheduled',
      scheduledDate: '2024-02-15',
      estimatedArrival: '10:00 AM - 12:00 PM',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701'
      },
      trackingUpdates: [
        { id: 1, date: '2024-01-15', status: 'Order Confirmed', message: 'Your delivery has been scheduled' },
        { id: 2, date: '2024-01-20', status: 'Preparing for Delivery', message: 'Your Home/RV is being prepared for delivery' }
      ],
      contactName: 'John Smith',
      contactPhone: '(555) 123-4567'
    },
    {
      id: 'DEL-2024-002',
      vehicleId: 'VIN-67890',
      vehicleInfo: '2023 Winnebago View',
      status: 'in_transit',
      scheduledDate: '2024-01-25',
      estimatedArrival: '2:00 PM - 4:00 PM',
      currentLocation: {
        city: 'Chicago',
        state: 'IL'
      },
      address: {
        street: '456 Oak Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601'
      },
      trackingUpdates: [
        { id: 1, date: '2024-01-10', status: 'Order Confirmed', message: 'Your delivery has been scheduled' },
        { id: 2, date: '2024-01-15', status: 'Preparing for Delivery', message: 'Your Home/RV is being prepared for delivery' },
        { id: 3, date: '2024-01-25 08:00 AM', status: 'In Transit', message: 'Your Home/RV has left our facility and is on its way to you' }
      ],
      contactName: 'Sarah Johnson',
      contactPhone: '(555) 987-6543'
    },
    {
      id: 'DEL-2024-003',
      vehicleId: 'VIN-54321',
      vehicleInfo: 'Jayco Eagle Fifth Wheel',
      status: 'delivered',
      scheduledDate: '2024-01-10',
      deliveredDate: '2024-01-10',
      address: {
        street: '789 Pine St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62702'
      },
      trackingUpdates: [
        { id: 1, date: '2024-01-01', status: 'Order Confirmed', message: 'Your delivery has been scheduled' },
        { id: 2, date: '2024-01-05', status: 'Preparing for Delivery', message: 'Your Home/RV is being prepared for delivery' },
        { id: 3, date: '2024-01-10 08:00 AM', status: 'In Transit', message: 'Your Home/RV has left our facility and is on its way to you' },
        { id: 4, date: '2024-01-10 02:30 PM', status: 'Delivered', message: 'Your Home/RV has been delivered successfully' }
      ],
      contactName: 'Mike Davis',
      contactPhone: '(555) 456-7890'
    }
  ];

  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Scheduled</span>;
      case 'in_transit':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">In Transit</span>;
      case 'delivered':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Delivered</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Order Tracking</h1>
        <p className="text-gray-500">
          Track the delivery of your Home/RV
        </p>
      </div>

      {/* Deliveries List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Your Deliveries</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="p-4 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <Truck className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{delivery.vehicleInfo}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">Delivery #{delivery.id}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {delivery.status === 'delivered' 
                          ? `Delivered: ${delivery.deliveredDate}` 
                          : `Scheduled: ${delivery.scheduledDate}`}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">
                        {delivery.address.city}, {delivery.address.state}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end space-x-2">
                  <div className="mr-4">
                    {getStatusBadge(delivery.status)}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewDelivery(delivery)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar for In Transit */}
              {delivery.status === 'in_transit' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-sm font-medium">In Transit</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      ETA: {delivery.estimatedArrival}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Departed</span>
                    <span>In Transit</span>
                    <span>Delivered</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {deliveries.length === 0 && (
            <div className="p-8 text-center">
              <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No deliveries found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any deliveries scheduled yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedDelivery && showDetailModal && (
        <DeliveryDetailModal 
          delivery={selectedDelivery} 
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default OrderTracking;