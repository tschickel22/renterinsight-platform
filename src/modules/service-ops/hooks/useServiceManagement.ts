import { useState, useEffect } from 'react'
import { ServiceTicket, ServiceStatus, Priority } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { Technician, ServiceStage, WarrantyType } from '../types'
import { generateServiceTicketPDF } from '../components/ServiceTicketPDF'

export function useServiceManagement() {
  const [tickets, setTickets] = useState<ServiceTicket[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Load existing tickets from localStorage or use mock data
    const savedTickets = loadFromLocalStorage('renter-insight-service-tickets', [
      {
        id: '1',
        customerId: 'cust-1',
        vehicleId: 'veh-1',
        title: 'Annual Maintenance Service',
        description: 'Complete annual maintenance including oil change, filter replacement, and system checks',
        priority: Priority.MEDIUM,
        status: ServiceStatus.IN_PROGRESS,
        assignedTo: 'Tech-001',
        scheduledDate: new Date('2024-01-20'),
        parts: [
          {
            id: '1',
            partNumber: 'OIL-001',
            description: 'Engine Oil Filter',
            quantity: 1,
            unitCost: 25.99,
            total: 25.99
          }
        ],
        labor: [
          {
            id: '1',
            description: 'Annual Maintenance',
            hours: 3,
            rate: 85,
            total: 255
          }
        ],
        notes: 'Customer requested additional inspection of brake system',
        customFields: {
          warrantyType: WarrantyType.MANUFACTURER,
          isWarrantyCovered: true,
          warrantyProvider: 'Forest River'
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: '2',
        customerId: 'cust-2',
        vehicleId: 'veh-2',
        title: 'AC System Repair',
        description: 'Air conditioning not cooling properly, needs diagnostic and repair',
        priority: Priority.HIGH,
        status: ServiceStatus.WAITING_PARTS,
        assignedTo: 'Tech-002',
        scheduledDate: new Date('2024-01-22'),
        parts: [
          {
            id: '2',
            partNumber: 'AC-COMP-001',
            description: 'AC Compressor',
            quantity: 1,
            unitCost: 450.00,
            total: 450.00
          }
        ],
        labor: [
          {
            id: '2',
            description: 'AC System Diagnostic',
            hours: 2,
            rate: 85,
            total: 170
          }
        ],
        notes: 'Waiting for compressor part to arrive',
        customFields: {
          warrantyType: WarrantyType.EXTENDED,
          isWarrantyCovered: true,
          warrantyProvider: 'Good Sam'
        },
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-16')
      }
    ])

    // Mock technicians
    const mockTechnicians: Technician[] = [
      {
        id: 'Tech-001',
        name: 'John Smith',
        email: 'john.smith@example.com',
        specialties: ['Engine', 'Electrical', 'Plumbing'],
        isActive: true,
        currentLoad: 3,
        maxCapacity: 5,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'Tech-002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        specialties: ['HVAC', 'Appliances', 'Electrical'],
        isActive: true,
        currentLoad: 4,
        maxCapacity: 4,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'Tech-003',
        name: 'Mike Davis',
        email: 'mike.davis@example.com',
        specialties: ['Chassis', 'Engine', 'Suspension'],
        isActive: true,
        currentLoad: 2,
        maxCapacity: 5,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      }
    ]

    setTickets(savedTickets)
    setTechnicians(mockTechnicians)
  }

  const saveTicketsToStorage = (updatedTickets: ServiceTicket[]) => {
    saveToLocalStorage('renter-insight-service-tickets', updatedTickets)
  }

  const getTicketsByStatus = (status: ServiceStatus) => {
    return tickets.filter(ticket => ticket.status === status)
  }

  const getTicketsByTechnician = (technicianId: string) => {
    return tickets.filter(ticket => ticket.assignedTo === technicianId)
  }

  const getTicketById = (ticketId: string) => {
    return tickets.find(ticket => ticket.id === ticketId)
  }

  const createTicket = async (ticketData: Partial<ServiceTicket>) => {
    setLoading(true)
    try {
      const newTicket: ServiceTicket = {
        id: Math.random().toString(36).substr(2, 9),
        customerId: ticketData.customerId || '',
        vehicleId: ticketData.vehicleId,
        title: ticketData.title || '',
        description: ticketData.description || '',
        priority: ticketData.priority || Priority.MEDIUM,
        status: ticketData.status || ServiceStatus.OPEN,
        assignedTo: ticketData.assignedTo,
        scheduledDate: ticketData.scheduledDate ? new Date(ticketData.scheduledDate) : undefined,
        parts: ticketData.parts || [],
        labor: ticketData.labor || [],
        notes: ticketData.notes || '',
        customFields: ticketData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedTickets = [...tickets, newTicket]
      setTickets(updatedTickets)
      saveTicketsToStorage(updatedTickets)

      // If a technician is assigned, update their current load
      if (newTicket.assignedTo) {
        updateTechnicianLoad(newTicket.assignedTo, 1)
      }

      return newTicket
    } finally {
      setLoading(false)
    }
  }

  const updateTicket = async (ticketId: string, ticketData: Partial<ServiceTicket>) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (!ticket) return null

    // Check if technician assignment has changed
    const technicianChanged = ticket.assignedTo !== ticketData.assignedTo

    // Update the ticket
    const updatedTicket = {
      ...ticket,
      ...ticketData,
      scheduledDate: ticketData.scheduledDate ? new Date(ticketData.scheduledDate) : ticket.scheduledDate,
      updatedAt: new Date()
    }

    const updatedTickets = tickets.map(t => 
      t.id === ticketId ? updatedTicket : t
    )

    setTickets(updatedTickets)
    saveTicketsToStorage(updatedTickets)

    // Update technician loads if assignment changed
    if (technicianChanged) {
      if (ticket.assignedTo) {
        updateTechnicianLoad(ticket.assignedTo, -1)
      }
      if (ticketData.assignedTo) {
        updateTechnicianLoad(ticketData.assignedTo, 1)
      }
    }

    return updatedTicket
  }

  const updateTicketStatus = async (ticketId: string, status: ServiceStatus) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (!ticket) return null

    // If status is changing to completed, set completedDate
    const completedDate = status === ServiceStatus.COMPLETED ? new Date() : ticket.completedDate

    const updatedTicket = {
      ...ticket,
      status,
      completedDate,
      updatedAt: new Date()
    }

    const updatedTickets = tickets.map(t => 
      t.id === ticketId ? updatedTicket : t
    )

    setTickets(updatedTickets)
    saveTicketsToStorage(updatedTickets)

    // If status is changing to completed or cancelled, update technician load
    if ((status === ServiceStatus.COMPLETED || status === ServiceStatus.CANCELLED) && ticket.assignedTo) {
      updateTechnicianLoad(ticket.assignedTo, -1)
    }

    return updatedTicket
  }

  const assignTechnician = async (ticketId: string, technicianId: string) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (!ticket) return null

    // If ticket already has a technician, update their load
    if (ticket.assignedTo) {
      updateTechnicianLoad(ticket.assignedTo, -1)
    }

    // Update the ticket with the new technician
    const updatedTicket = {
      ...ticket,
      assignedTo: technicianId,
      updatedAt: new Date()
    }

    const updatedTickets = tickets.map(t => 
      t.id === ticketId ? updatedTicket : t
    )

    setTickets(updatedTickets)
    saveTicketsToStorage(updatedTickets)

    // Update the new technician's load
    updateTechnicianLoad(technicianId, 1)

    return updatedTicket
  }

  const updateTechnicianLoad = (technicianId: string, change: number) => {
    const updatedTechnicians = technicians.map(tech => 
      tech.id === technicianId
        ? { 
            ...tech, 
            currentLoad: Math.max(0, Math.min(tech.maxCapacity, tech.currentLoad + change)),
            updatedAt: new Date()
          }
        : tech
    )
    
    setTechnicians(updatedTechnicians)
  }

  const generatePDF = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (!ticket) return null

    const doc = generateServiceTicketPDF(ticket)
    doc.save(`service-ticket-${ticketId}.pdf`)
    return true
  }

  const shareWithCustomer = async (ticketId: string) => {
    // In a real app, this would send an email or notification to the customer
    // with a link to view the ticket in the customer portal
    return true
  }

  const submitCustomerFeedback = async (ticketId: string, feedback: string, rating: number) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (!ticket) return null

    const updatedTicket = {
      ...ticket,
      customFields: {
        ...ticket.customFields,
        customerFeedback: feedback,
        customerRating: rating,
        feedbackDate: new Date()
      },
      updatedAt: new Date()
    }

    const updatedTickets = tickets.map(t => 
      t.id === ticketId ? updatedTicket : t
    )

    setTickets(updatedTickets)
    saveTicketsToStorage(updatedTickets)

    return updatedTicket
  }

  return {
    tickets,
    technicians,
    loading,
    getTicketsByStatus,
    getTicketsByTechnician,
    getTicketById,
    createTicket,
    updateTicket,
    updateTicketStatus,
    assignTechnician,
    generatePDF,
    shareWithCustomer,
    submitCustomerFeedback
  }
}