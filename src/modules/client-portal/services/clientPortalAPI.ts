import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

// Mock data for client portal users
const mockPortalUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    status: 'active',
    lastLogin: new Date('2024-01-18'),
    vehicleCount: 1,
    serviceTickets: 2,
    invoices: 3
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    status: 'active',
    lastLogin: new Date('2024-01-16'),
    vehicleCount: 1,
    serviceTickets: 0,
    invoices: 1
  }
]

export const clientPortalAPI = {
  // Get all portal users
  getUsers: async () => {
    // In a real app, this would be an API call
    const savedUsers = loadFromLocalStorage('client-portal-users', mockPortalUsers)
    return savedUsers
  },
  
  // Get a specific user by ID
  getUserById: async (userId: string) => {
    const users = await clientPortalAPI.getUsers()
    return users.find(user => user.id === userId)
  },
  
  // Invite a new user to the portal
  inviteUser: async (userData: any) => {
    const users = await clientPortalAPI.getUsers()
    
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      status: 'active',
      lastLogin: null,
      vehicleCount: 0,
      serviceTickets: 0,
      invoices: 0
    }
    
    const updatedUsers = [...users, newUser]
    saveToLocalStorage('client-portal-users', updatedUsers)
    
    // In a real app, this would send an email invitation
    console.log('Invitation email would be sent to:', userData.email)
    
    return newUser
  },
  
  // Update a user's status
  updateUserStatus: async (userId: string, status: string) => {
    const users = await clientPortalAPI.getUsers()
    
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status } : user
    )
    
    saveToLocalStorage('client-portal-users', updatedUsers)
    return updatedUsers.find(user => user.id === userId)
  },
  
  // Get user activity
  getUserActivity: async (userId: string) => {
    // In a real app, this would fetch activity logs
    return [
      {
        id: '1',
        userId,
        type: 'login',
        timestamp: new Date('2024-01-18T10:30:00'),
        details: 'User logged in'
      },
      {
        id: '2',
        userId,
        type: 'view_document',
        timestamp: new Date('2024-01-18T10:35:00'),
        details: 'Viewed warranty document'
      }
    ]
  }
}