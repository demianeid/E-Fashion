import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { OrdersProvider } from "@/lib/orders-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-Fashion | Effortless Style for Every Season",
  description:
    "Discover our new collection designed for the modern wardrobe, featuring timeless pieces with a contemporary edge.",
  keywords: ["fashion", "clothing", "online shopping", "men fashion", "women fashion", "kids fashion"],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#E89830",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>{children}</OrdersProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
