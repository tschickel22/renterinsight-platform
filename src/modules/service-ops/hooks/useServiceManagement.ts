import { useState, useEffect } from 'react'
import { ServiceTicket, ServiceStatus, Priority, ServicePart, ServiceLabor } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useServiceManagement() {
  const [tickets, setTickets] = useState<ServiceTicket[]>([])
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
          warrantyStatus: 'not_covered',
          estimatedCompletionDate: '2024-01-22',
          customerAuthorization: true,
          technicianNotes: 'Check brake pads and rotors during service',
          customerPortalAccess: true
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
          warrantyStatus: 'partial',
          estimatedCompletionDate: '2024-01-25',
          customerAuthorization: true,
          technicianNotes: 'Compressor needs replacement, on order from supplier',
          customerPortalAccess: true
        },
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-16')
      }
    ])

    setTickets(savedTickets)
  }

  const saveTicketsToStorage = (updatedTickets: ServiceTicket[]) => {
    saveToLocalStorage('renter-insight-service-tickets', updatedTickets)
  }

  const getTicketsByCustomerId = (customerId: string) => {
    return tickets.filter(ticket => ticket.customerId === customerId)
  }

  const getTicketsByVehicleId = (vehicleId: string) => {
    return tickets.filter(ticket => ticket.vehicleId === vehicleId)
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
        scheduledDate: ticketData.scheduledDate,
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

      return newTicket
    } finally {
      setLoading(false)
    }
  }

  const updateTicket = async (ticketId: string, ticketData: Partial<ServiceTicket>) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            ...ticketData,
            updatedAt: new Date() 
          }
        : ticket
    )
    setTickets(updatedTickets)
    saveTicketsToStorage(updatedTickets)
  }

  const deleteTicket = async (ticketId: string) => {
    const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId)
    setTickets(updatedTickets)
    saveTicketsToStorage(updatedTickets)
  }

  const updateTicketStatus = async (ticketId: string, status: ServiceStatus) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            status,
            completedDate: status === ServiceStatus.COMPLETED ? new Date() : ticket.completedDate,
            updatedAt: new Date() 
          }
        : ticket
    )
    setTickets(updatedTickets)
    saveTicketsToStorage(updatedTickets)
  }

  const assignTechnician = async (ticketId: string, technicianId: string) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            assignedTo: technicianId,
            updatedAt: new Date() 
          }
        : ticket
    )
    setTickets(updatedTickets)
    saveTicketsToStorage(updatedTickets)
  }

  const addPart = async (ticketId: string, partData: Partial<ServicePart>) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (!ticket) return null

    const newPart: ServicePart = {
      id: Math.random().toString(36).substr(2, 9),
      partNumber: partData.partNumber || '',
      description: partData.description || '',
      quantity: partData.quantity || 1,
      unitCost: partData.unitCost || 0,
      total: partData.total || 0
    }

    const updatedTickets = tickets.map(t => 
      t.id === ticketId 
        ? { 
            ...t, 
            parts: [...t.parts, newPart],
            updatedAt: new Date() 
          }
        : t
    )
    setTickets(updatedTickets)
    saveTicketsToStorage(updatedTickets)

    return newPart
  }

  const addLabor = async (ticketId: string, laborData: Partial<ServiceLabor>) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (!ticket) return null

    const newLabor: ServiceLabor = {
      id: Math.random().toString(36).substr(2, 9),
      description: laborData.description || '',
      hours: laborData.hours || 1,
      rate: laborData.rate || 85,
      total: laborData.total || 85
    }

    const updatedTickets = tickets.map(t => 
      t.id === ticketId 
        ? { 
            ...t, 
            labor: [...t.labor, newLabor],
            updatedAt: new Date() 
          }
        : t
    )
    setTickets(updatedTickets)
    saveTicketsToStorage(updatedTickets)

    return newLabor
  }

  return {
    tickets,
    loading,
    getTicketsByCustomerId,
    getTicketsByVehicleId,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    updateTicketStatus,
    assignTechnician,
    addPart,
    addLabor
  }
}