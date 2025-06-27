import axios from 'axios'
import { loadFromLocalStorage } from './utils'

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = loadFromLocalStorage('auth_token', null)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Client Portal API functions
export const clientPortalApi = {
  createClientAccount: async (data: { 
    email: string; 
    name: string; 
    sendInvite: boolean; 
    leadId?: string 
  }) => {
    // In a real app, this would call the Supabase Edge Function
    // For this demo, we'll simulate a successful response
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate a random ID
    const userId = Math.random().toString(36).substring(2, 15)
    
    return {
      success: true,
      message: data.sendInvite ? "Account created and invitation sent" : "Account created successfully",
      user: {
        id: userId,
        email: data.email,
        name: data.name,
      }
    }
  },
  
  getClientAccounts: async () => {
    // In a real app, this would fetch from the database
    // For this demo, we'll return mock data
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return [
      {
        id: 'user-1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        status: 'active',
        lastLogin: new Date('2024-01-18'),
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'user-2',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        status: 'active',
        lastLogin: new Date('2024-01-16'),
        createdAt: new Date('2023-12-15')
      }
    ]
  },
  
  updateClientAccount: async (userId: string, data: { status?: string }) => {
    // In a real app, this would update the database
    // For this demo, we'll simulate a successful response
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      message: "Account updated successfully"
    }
  },
  
  resetClientPassword: async (userId: string) => {
    // In a real app, this would trigger a password reset
    // For this demo, we'll simulate a successful response
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      message: "Password reset email sent"
    }
  }
}

export default api