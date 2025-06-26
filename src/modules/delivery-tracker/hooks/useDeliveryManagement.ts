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
          estimatedTime: '10:00',
          photos: []
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
          estimatedTime: '14:00',
          photos: []
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
        driver: deliveryData.driver,
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
    const updatedDeliveries = deliveries.map(delivery => {
      if (delivery.id === deliveryId) {
        const updatedDelivery = { 
          ...delivery, 
          status,
          updatedAt: new Date() 
        }
        
        // If status is DELIVERED, set the deliveredDate
        if (status === DeliveryStatus.DELIVERED) {
          updatedDelivery.deliveredDate = new Date()
        }
        
        return updatedDelivery
      }
      return delivery
    })
    
    setDeliveries(updatedDeliveries)
    saveDeliveriesToStorage(updatedDeliveries)
  }

  const assignDriver = async (deliveryId: string, driverId: string) => {
    const updatedDeliveries = deliveries.map(delivery => 
      delivery.id === deliveryId 
        ? { 
            ...delivery, 
            driver: driverId,
            updatedAt: new Date() 
          }
        : delivery
    )
    setDeliveries(updatedDeliveries)
    saveDeliveriesToStorage(updatedDeliveries)
  }

  const sendNotification = async (deliveryId: string, type: 'email' | 'sms', message: string) => {
    // In a real app, this would send an actual email or SMS
    console.log(`Sending ${type} for delivery ${deliveryId}:`, message)
    
    // Log the notification in the delivery's history
    const updatedDeliveries = deliveries.map(delivery => {
      if (delivery.id === deliveryId) {
        const notifications = delivery.customFields?.notifications || []
        return {
          ...delivery,
          customFields: {
            ...delivery.customFields,
            notifications: [
              ...notifications,
              {
                id: Math.random().toString(36).substr(2, 9),
                type,
                message,
                sentAt: new Date()
              }
            ]
          },
          updatedAt: new Date()
        }
      }
      return delivery
    })
    
    setDeliveries(updatedDeliveries)
    saveDeliveriesToStorage(updatedDeliveries)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const addDeliveryPhoto = async (deliveryId: string, photoUrl: string, caption: string) => {
    const updatedDeliveries = deliveries.map(delivery => {
      if (delivery.id === deliveryId) {
        const photos = delivery.customFields?.photos || []
        return {
          ...delivery,
          customFields: {
            ...delivery.customFields,
            photos: [
              ...photos,
              {
                id: Math.random().toString(36).substr(2, 9),
                url: photoUrl,
                caption,
                uploadedAt: new Date()
              }
            ]
          },
          updatedAt: new Date()
        }
      }
      return delivery
    })
    
    setDeliveries(updatedDeliveries)
    saveDeliveriesToStorage(updatedDeliveries)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
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
    assignDriver,
    sendNotification,
    addDeliveryPhoto
  }
}