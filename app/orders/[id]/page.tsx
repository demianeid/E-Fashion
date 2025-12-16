"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useOrders } from "@/lib/orders-context"
import { sampleOrders } from "@/lib/data"
import { CheckCircle, Package, Truck, Home, Search, User, ShoppingBag } from "lucide-react"

export default function OrderTrackingPage() {
  const params = useParams()
  const { getOrderById, cancelOrder } = useOrders()

  // Try to get order from context first, then fallback to sample orders
  const order = getOrderById(params.id as string) || sampleOrders.find((o) => o.id === params.id)

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Order not found</p>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusSteps = [
    { key: "placed", label: "Order Placed", icon: CheckCircle },
    { key: "processing", label: "Processing", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Home },
  ]

  const getStatusIndex = () => {
    const statusOrder = ["placed", "processing", "shipped", "delivered"]
    return statusOrder.indexOf(order.status)
  }

  const currentStatusIndex = getStatusIndex()

  const handleCancelOrder = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      cancelOrder(order.id)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Custom Header for Order Tracking */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">E-Fashion</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                New In
              </Link>
              <Link
                href="/products?category=women"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Clothing
              </Link>
              <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Shoes
              </Link>
              <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Accessories
              </Link>
              <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Sale
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">Track Your Order</h1>

          {/* Order Info Card */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                <p className="font-semibold text-lg">Estimated Delivery: {order.estimatedDelivery}</p>
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {order.status === "cancelled"
                    ? "This order has been cancelled."
                    : "Your order is currently processing."}
                </span>
              </div>
            </div>

            {/* Status Timeline */}
            {order.status !== "cancelled" && (
              <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-border">
                  <div
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>

                {statusSteps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex

                  return (
                    <div key={step.key} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          isCurrent ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                      {order.statusHistory?.find((h) => h.status === step.key) && (
                        <span className="text-xs text-muted-foreground">
                          {order.statusHistory.find((h) => h.status === step.key)?.date}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              {order.status !== "cancelled" && order.status !== "delivered" && (
                <Button variant="outline" onClick={handleCancelOrder}>
                  Cancel Order
                </Button>
              )}
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground ml-auto">
                Need help with your order?
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/products" className="hover:text-foreground">
                    New In
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-foreground">
                    Clothing
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-foreground">
                    Shoes
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-foreground">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Help</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-foreground">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-foreground">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-foreground">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
              <div className="flex gap-4">{/* Social icons would go here */}</div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2025 E-Fashion. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
