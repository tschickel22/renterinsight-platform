import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage } from '@/lib/utils'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  hasPermission: (resource: string, action: string) => boolean
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const token = loadFromLocalStorage('auth_token', null)
    if (token) {
      // Simulate user data - in real app, validate token with API
      setUser({
        id: '1',
        email: 'admin@renterinsight.com',
        name: 'Admin User',
        role: UserRole.ADMIN,
        tenantId: 'tenant-1',
        permissions: [
          { id: '1', name: 'All Access', resource: '*', action: '*' }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call for authentication
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Mock authentication logic
      if (email === 'admin@renterinsight.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          email,
          name: 'Admin User',
          role: UserRole.ADMIN,
          tenantId: 'tenant-1',
          permissions: [
            { id: '1', name: 'All Access', resource: '*', action: '*' }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        setUser(mockUser)
        saveToLocalStorage('auth_token', 'mock-token')
        
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    removeFromLocalStorage('auth_token')
  }

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false
    
    return user.permissions.some(permission => 
      (permission.resource === '*' || permission.resource === resource) &&
      (permission.action === '*' || permission.action === action)
    )
  }

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false
    return user.role === role || user.role === UserRole.ADMIN
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
    hasPermission,
    hasRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
