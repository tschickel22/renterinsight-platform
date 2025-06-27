import React from 'react';
import { X, Truck, MapPin, Calendar, Clock, CheckCircle, Package, Phone, Mail } from 'lucide-react';

const DeliveryDetailModal = ({ delivery, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Delivery Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">{delivery.vehicleInfo}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500">Delivery #{delivery.id}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">VIN: {delivery.vehicleId}</span>
            </div>
          </div>
          
          {/* Delivery Status */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium
                ${delivery.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                  delivery.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' : 
                  delivery.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-100 text-gray-800'}`}
              >
                {delivery.status === 'scheduled' ? 'Scheduled' : 
                 delivery.status === 'in_transit' ? 'In Transit' : 
                 delivery.status === 'delivered' ? 'Delivered' : 
                 delivery.status}
              </div>
              
              {delivery.status === 'in_transit' && (
                <span className="text-sm text-gray-500">
                  ETA: {delivery.estimatedArrival}
                </span>
              )}
            </div>
            
            {delivery.status === 'in_transit' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm font-medium">Delivery Progress</span>
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
                
                {delivery.currentLocation && (
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                    <span>
                      Current Location: {delivery.currentLocation.city}, {delivery.currentLocation.state}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Delivery Information */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Delivery Information</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium">
                      {delivery.status === 'delivered' ? 'Delivered Date' : 'Scheduled Date'}:
                    </span>
                  </div>
                  <p className="text-sm ml-6">
                    {delivery.status === 'delivered' ? delivery.deliveredDate : delivery.scheduledDate}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium">Time Window:</span>
                  </div>
                  <p className="text-sm ml-6">{delivery.estimatedArrival}</p>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium">Delivery Address:</span>
                  </div>
                  <p className="text-sm ml-6">
                    {delivery.address.street}<br />
                    {delivery.address.city}, {delivery.address.state} {delivery.address.zipCode}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium">Contact Phone:</span>
                  </div>
                  <p className="text-sm ml-6">{delivery.contactPhone}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium">Contact Name:</span>
                  </div>
                  <p className="text-sm ml-6">{delivery.contactName}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tracking History */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Tracking History</h4>
            <div className="space-y-4">
              {delivery.trackingUpdates.map((update, index) => (
                <div key={update.id} className="relative pl-6">
                  {index < delivery.trackingUpdates.length - 1 && (
                    <div className="absolute left-[7px] top-6 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                  
                  <div className="flex items-start">
                    <div className="absolute left-0 mt-1.5">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">{update.status}</h5>
                        <span className="text-xs text-gray-500">{update.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{update.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailModal;