"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Order, CartItem, Address } from "./types"

interface OrdersContextType {
  orders: Order[]
  addOrder: (
    items: CartItem[],
    address: Address,
    phone: string,
    paymentMethod: "credit-card" | "wallet" | "cash-on-delivery",
    subtotal: number,
    shipping: number,
    taxes: number,
  ) => Order
  getOrderById: (id: string) => Order | undefined
  cancelOrder: (id: string) => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const savedOrders = localStorage.getItem("e-fashion-orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("e-fashion-orders", JSON.stringify(orders))
  }, [orders])

  const addOrder = (
    items: CartItem[],
    address: Address,
    phone: string,
    paymentMethod: "credit-card" | "wallet" | "cash-on-delivery",
    subtotal: number,
    shipping: number,
    taxes: number,
  ): Order => {
    const orderId = `EF${Date.now()}`
    const now = new Date()
    const estimatedDelivery = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

    const newOrder: Order = {
      id: orderId,
      userId: "1",
      items,
      status: "placed",
      total: subtotal + shipping + taxes,
      subtotal,
      shipping,
      taxes,
      paymentMethod,
      shippingAddress: address,
      phone,
      createdAt: now.toISOString(),
      estimatedDelivery: estimatedDelivery.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      statusHistory: [{ status: "placed", date: now.toLocaleDateString("en-US", { month: "long", day: "numeric" }) }],
    }

    setOrders((prev) => [newOrder, ...prev])
    return newOrder
  }

  const getOrderById = (id: string): Order | undefined => {
    return orders.find((o) => o.id === id)
  }

  const cancelOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" as const } : o)))
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder, getOrderById, cancelOrder }}>{children}</OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
