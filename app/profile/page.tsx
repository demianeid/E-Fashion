"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [showOtpSent, setShowOtpSent] = useState(false)

  // Handle redirect when user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Return null while checking auth or if no user (will redirect in useEffect)
  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleVerifyOtp = () => {
    setShowOtpSent(true)
    setTimeout(() => setShowOtpSent(false), 3000)
  }

  const displayName = user.name || user.username || "User"
  const displayPhone = user.phone || "+1 (123) 456-7890"
  const displayAddress = user.address
    ? `${user.address.street}${user.address.city ? `, ${user.address.city}` : ""}${user.address.postalCode ? `, ${user.address.postalCode}` : ""}`
    : "123 Fashion Ave, Style City, 12345"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">My Profile</h1>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            {/* Profile Header */}
            <div className="flex flex-col items-center py-8 px-6 border-b border-border">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-primary/20">
                <img src="/60111.jpg" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{displayName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            {/* Contact Info */}
            <div className="px-6 py-6 space-y-6">
              {/* Phone */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-foreground">{displayPhone}</span>
                </div>
                {showOtpSent ? (
                  <span className="text-sm text-green-600">OTP Sent!</span>
                ) : (
                  <button
                    onClick={handleVerifyOtp}
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    Verify via OTP
                  </button>
                )}
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Shipping Address</p>
                  <p className="text-muted-foreground">{displayAddress}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6 pt-2">
              <div className="flex gap-4">
                <Button
                  onClick={() => router.push("/profile/edit")}
                  className="flex-1 bg-[#c4b5a4] hover:bg-[#b5a695] text-foreground"
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex-1 border-border hover:bg-secondary bg-transparent"
                >
                  Logout
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