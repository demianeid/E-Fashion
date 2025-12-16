"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, Address } from "./types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  register: (username: string, email: string, password: string, phone: string, address: string) => Promise<boolean>
  logout: () => void
  updateAddress: (address: Address) => void
  updateProfile: (data: { name?: string; phone?: string; address?: Address }) => Promise<void>
  requestPasswordReset: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("e-fashion-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email && password.length >= 6) {
      const newUser: User = {
        id: "1",
        username: email.split("@")[0],
        name: email.split("@")[0],
        email,
        isVerified: true,
      }
      setUser(newUser)
      localStorage.setItem("e-fashion-user", JSON.stringify(newUser))
      return true
    }
    return false
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate Google OAuth response
    const googleUser: User = {
      id: "google-" + Date.now().toString(),
      username: "jane.doe",
      name: "Jane Doe",
      email: "janedoe@email.com",
      phone: "+1 (123) 456-7890",
      avatar: "/woman-avatar-illustration-cartoon-style-brown-hair.jpg",
      address: {
        fullName: "Jane Doe",
        street: "123 Fashion Ave",
        city: "Style City",
        postalCode: "12345",
        country: "USA",
      },
      isVerified: true,
    }

    setUser(googleUser)
    localStorage.setItem("e-fashion-user", JSON.stringify(googleUser))
    return true
  }

  const register = async (
    username: string,
    email: string,
    password: string,
    phone: string,
    address: string,
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username && email && password.length >= 6) {
      const newUser: User = {
        id: Date.now().toString(),
        username,
        name: username,
        email,
        phone,
        address: {
          fullName: username,
          street: address,
          city: "",
          postalCode: "",
          country: "",
        },
        isVerified: false,
      }
      setUser(newUser)
      localStorage.setItem("e-fashion-user", JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("e-fashion-user")
  }

  const updateAddress = (address: Address) => {
    if (user) {
      const updatedUser = { ...user, address }
      setUser(updatedUser)
      localStorage.setItem("e-fashion-user", JSON.stringify(updatedUser))
    }
  }

  const updateProfile = async (data: { name?: string; phone?: string; address?: Address }): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (user) {
      const updatedUser = {
        ...user,
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.address && { address: data.address }),
      }
      setUser(updatedUser)
      localStorage.setItem("e-fashion-user", JSON.stringify(updatedUser))
    }
  }

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return !!email
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateAddress,
        updateProfile,
        requestPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
