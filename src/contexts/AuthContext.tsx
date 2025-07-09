import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'admin@renterinsight.com',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'manager@renterinsight.com',
    name: 'Manager User',
    role: 'manager'
  },
  {
    id: '3',
    email: 'sales@renterinsight.com',
    name: 'Sales User',
    role: 'sales'
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('renter-insight-user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('renter-insight-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Find user by email
    const foundUser = mockUsers.find(u => u.email === email)
    
    if (!foundUser) {
      setIsLoading(false)
      throw new Error('Invalid email or password')
    }
    
    // For demo purposes, accept any password
    // In a real app, you would validate the password
    if (password.length < 1) {
      setIsLoading(false)
      throw new Error('Password is required')
    }
    
    setUser(foundUser)
    localStorage.setItem('renter-insight-user', JSON.stringify(foundUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('renter-insight-user')
  }

  const value = {
    user,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}