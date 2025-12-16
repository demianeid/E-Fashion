"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Minus, Plus, X, ArrowLeft } from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/cart")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Cart</span>
          </nav>

          <h1 className="text-3xl font-bold text-foreground mb-2">Your Bag</h1>
          <p className="text-muted-foreground mb-8">{items.length} Items in Your Cart</p>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-0">
                  {items.map((item, index) => (
                    <div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      className={`flex items-center gap-6 py-6 ${
                        index !== items.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      {/* Product Image */}
                      <div className="w-24 h-28 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          width={96}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.size}, Color: {item.color}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          title="minus"
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          title="plus"
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                        <button
                          title="remove"
                          onClick={() => removeItem(item.product.id, item.size, item.color)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-muted-foreground">Calculated at next step</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full rounded-full py-6 bg-[#C9A67A] hover:bg-[#B8956A] text-foreground">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <div className="mt-6">
                    <p className="text-sm text-muted-foreground mb-3">Accepted Payment Methods</p>
                    <div className="flex gap-2">
                      <div className="w-10 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded" />
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded" />
                      <div className="w-10 h-6 bg-gradient-to-r from-teal-400 to-teal-600 rounded" />
                      <div className="w-10 h-6 bg-gradient-to-r from-cyan-300 to-cyan-500 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
