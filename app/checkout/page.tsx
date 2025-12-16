"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { useOrders } from "@/lib/orders-context"
import { MapPin, Phone, CreditCard, Wallet, Truck, ChevronUp } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { addOrder } = useOrders()

  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    promoCode: "",
  })

  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "wallet" | "cash-on-delivery">("credit-card")
  const [expandedSections, setExpandedSections] = useState({
    address: true,
    phone: true,
    payment: true,
  })

  const shipping = 0 // Free shipping
  const taxRate = 0.08
  const taxes = totalPrice * taxRate
  const total = totalPrice + shipping + taxes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePlaceOrder = () => {
    if (!formData.fullName || !formData.street || !formData.city || !formData.postalCode || !formData.phone) {
      alert("Please fill in all required fields")
      return
    }

    const order = addOrder(
      items,
      {
        fullName: formData.fullName,
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: "USA",
      },
      formData.phone,
      paymentMethod,
      totalPrice,
      shipping,
      taxes,
    )

    clearCart()
    router.push(`/orders/${order.id}`)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <Link href="/cart" className="hover:text-foreground">
              Cart
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary">Information & Payment</span>
          </nav>

          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address Section */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => toggleSection("address")}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold">Address</span>
                  </div>
                  <ChevronUp
                    className={`h-5 w-5 transition-transform ${expandedSections.address ? "" : "rotate-180"}`}
                  />
                </button>

                {expandedSections.address && (
                  <div className="p-4 pt-0 space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        name="street"
                        placeholder="123 Fashion Ave"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Section */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => toggleSection("phone")}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold">Phone number</span>
                  </div>
                  <ChevronUp className={`h-5 w-5 transition-transform ${expandedSections.phone ? "" : "rotate-180"}`} />
                </button>

                {expandedSections.phone && (
                  <div className="p-4 pt-0">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="(123) 456-7890"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => toggleSection("payment")}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold">Payment methods</span>
                  </div>
                  <ChevronUp
                    className={`h-5 w-5 transition-transform ${expandedSections.payment ? "" : "rotate-180"}`}
                  />
                </button>

                {expandedSections.payment && (
                  <div className="p-4 pt-0 space-y-4">
                    {/* Credit Card Option */}
                    <div
                      className={`rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                        paymentMethod === "credit-card" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setPaymentMethod("credit-card")}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              paymentMethod === "credit-card" ? "border-primary bg-primary" : "border-muted-foreground"
                            }`}
                          >
                            {paymentMethod === "credit-card" && (
                              <div className="w-full h-full rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="font-medium">Credit Card</span>
                        </div>
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">Pay with Visa, Mastercard, or Amex.</p>

                      {paymentMethod === "credit-card" && (
                        <div className="space-y-3">
                          <Input
                            name="cardNumber"
                            placeholder="Card Number"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              name="cardExpiry"
                              placeholder="MM / YY"
                              value={formData.cardExpiry}
                              onChange={handleInputChange}
                            />
                            <Input
                              name="cardCvv"
                              placeholder="CVV"
                              value={formData.cardCvv}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Wallet Option */}
                    <div
                      className={`rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                        paymentMethod === "wallet" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setPaymentMethod("wallet")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              paymentMethod === "wallet" ? "border-primary bg-primary" : "border-muted-foreground"
                            }`}
                          />
                          <span className="font-medium">Wallet</span>
                        </div>
                        <Wallet className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 ml-7">Apple Pay, Google Pay, etc.</p>
                    </div>

                    {/* Cash on Delivery Option */}
                    <div
                      className={`rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                        paymentMethod === "cash-on-delivery" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setPaymentMethod("cash-on-delivery")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              paymentMethod === "cash-on-delivery"
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                            }`}
                          />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <Truck className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 ml-7">
                        Pay in cash when your order is delivered.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 border border-border sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order summary</h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          width={64}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.product.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size}, Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <Input
                    name="promoCode"
                    placeholder="Promo code"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                  <Button variant="outline">Apply</Button>
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={handlePlaceOrder} className="w-full rounded-full py-6">
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
