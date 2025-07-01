import { useState, useEffect } from 'react'
import { Delivery, DeliveryStatus } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useDeliveryManagement() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Load existing deliveries from localStorage or use mock data
    const savedDeliveries = loadFromLocalStorage('renter-insight-deliveries', [
      {
        id: '1',
        customerId: 'cust-1',
        vehicleId: 'veh-1',
        status: DeliveryStatus.SCHEDULED,
        scheduledDate: new Date('2024-01-25'),
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          country: 'USA'
        },
        driver: 'Driver-001',
        notes: 'Customer prefers morning delivery',
        customFields: {
          contactPhone: '(555) 123-4567',
          contactEmail: 'customer@example.com',
          sendSMSUpdates: true,
          sendEmailUpdates: true,
          estimatedArrival: '10:00'
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: '2',
        customerId: 'cust-2',
        vehicleId: 'veh-2',
        status: DeliveryStatus.IN_TRANSIT,
        scheduledDate: new Date('2024-01-20'),
        deliveredDate: undefined,
        address: {
          street: '456 Oak Ave',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        driver: 'Driver-002',
        notes: 'Call customer 30 minutes before arrival',
        customFields: {
          contactPhone: '(555) 987-6543',
          contactEmail: 'customer2@example.com',
          sendSMSUpdates: true,
          sendEmailUpdates: true,
          estimatedArrival: '14:30',
          departureTime: '2024-01-20T08:00:00',
          departureNotes: 'Left dealership on schedule',
          customerNotified: '2024-01-20T08:15:00',
          notificationMethod: 'SMS',
          etaUpdated: '2024-01-20T10:30:00'
        },
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-20')
      }
    ])

    setDeliveries(savedDeliveries)
  }

  const saveDeliveriesToStorage = (updatedDeliveries: Delivery[]) => {
    saveToLocalStorage('renter-insight-deliveries', updatedDeliveries)
  }

  const getDeliveriesByCustomerId = (customerId: string) => {
    return deliveries.filter(delivery => delivery.customerId === customerId)
  }

  const getDeliveriesByVehicleId = (vehicleId: string) => {
    return deliveries.filter(delivery => delivery.vehicleId === vehicleId)
  }

  const getDeliveryById = (deliveryId: string) => {
    return deliveries.find(delivery => delivery.id === deliveryId)
  }

  const createDelivery = async (deliveryData: Partial<Delivery>) => {
    setLoading(true)
    try {
      const newDelivery: Delivery = {
        id: Math.random().toString(36).substr(2, 9),
        customerId: deliveryData.customerId || '',
        vehicleId: deliveryData.vehicleId || '',
        status: deliveryData.status || DeliveryStatus.SCHEDULED,
        scheduledDate: deliveryData.scheduledDate || new Date(),
        deliveredDate: deliveryData.deliveredDate,
        address: deliveryData.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA'
        },
        driver: deliveryData.driver || '',
        notes: deliveryData.notes || '',
        customFields: deliveryData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedDeliveries = [...deliveries, newDelivery]
      setDeliveries(updatedDeliveries)
      saveDeliveriesToStorage(updatedDeliveries)

      return newDelivery
    } finally {
      setLoading(false)
    }
  }

  const updateDelivery = async (deliveryId: string, deliveryData: Partial<Delivery>) => {
    const updatedDeliveries = deliveries.map(delivery => 
      delivery.id === deliveryId 
        ? { 
            ...delivery, 
            ...deliveryData,
            updatedAt: new Date() 
          }
        : delivery
    )
    setDeliveries(updatedDeliveries)
    saveDeliveriesToStorage(updatedDeliveries)
  }

  const deleteDelivery = async (deliveryId: string) => {
    const updatedDeliveries = deliveries.filter(delivery => delivery.id !== deliveryId)
    setDeliveries(updatedDeliveries)
    saveDeliveriesToStorage(updatedDeliveries)
  }

  const updateDeliveryStatus = async (deliveryId: string, status: DeliveryStatus) => {
    const updatedDeliveries = deliveries.map(delivery => 
      delivery.id === deliveryId 
        ? { 
            ...delivery, 
            status,
            deliveredDate: status === DeliveryStatus.DELIVERED ? new Date() : delivery.deliveredDate,
            updatedAt: new Date() 
          }
        : delivery
    )
    setDeliveries(updatedDeliveries)
    saveDeliveriesToStorage(updatedDeliveries)
  }

  const sendNotification = async (deliveryId: string, notificationType: 'sms' | 'email', message: string) => {
    // In a real app, this would send an actual notification
    // For this demo, we'll just update the delivery record
    
    const delivery = deliveries.find(d => d.id === deliveryId)
    if (!delivery) return
    
    const updatedDeliveries = deliveries.map(d => 
      d.id === deliveryId 
        ? { 
            ...d, 
            customFields: {
              ...d.customFields,
              customerNotified: new Date().toISOString(),
              notificationMethod: notificationType === 'sms' ? 'SMS' : 'Email',
              lastNotificationMessage: message
            },
            updatedAt: new Date() 
          }
        : d
    )
    
    setDeliveries(updatedDeliveries)
    saveDeliveriesToStorage(updatedDeliveries)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return true
  }

  const updateETA = async (deliveryId: string, estimatedArrival: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId)
    if (!delivery) return
    
    const updatedDeliveries = deliveries.map(d => 
      d.id === deliveryId 
        ? { 
            ...d, 
            customFields: {
              ...d.customFields,
              estimatedArrival,
              etaUpdated: new Date().toISOString()
            },
            updatedAt: new Date() 
          }
        : d
    )
    
    setDeliveries(updatedDeliveries)
    saveDeliveriesToStorage(updatedDeliveries)
  }

  const addDeliveryPhotos = async (deliveryId: string, photos: string[], captions: string[]) => {
    const delivery = deliveries.find(d => d.id === deliveryId)
    if (!delivery) return
    
    // Create photo objects with captions
    const photoObjects = photos.map((url, index) => ({
      url,
      caption: captions[index] || ''
    }))
    
    const updatedDeliveries = deliveries.map(d => 
      d.id === deliveryId 
        ? { 
            ...d, 
            customFields: {
              ...d.customFields,
              deliveryPhotos: [...(d.customFields?.deliveryPhotos || []), ...photos],
              photoDetails: [...(d.customFields?.photoDetails || []), ...photoObjects]
            },
            updatedAt: new Date() 
          }
        : d
    )
    
    setDeliveries(updatedDeliveries)
    saveDeliveriesToStorage(updatedDeliveries)
  }

  return {
    deliveries,
    loading,
    getDeliveriesByCustomerId,
    getDeliveriesByVehicleId,
    getDeliveryById,
    createDelivery,
    updateDelivery,
    deleteDelivery,
    updateDeliveryStatus,
    sendNotification,
    updateETA,
    addDeliveryPhotos
  }
}