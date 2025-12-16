"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { ShoppingBag, Search, User, Heart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const { totalItems } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleCartClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      setShowLoginDialog(true)
    }
  }

  const getCurrentRedirect = () => {
    return pathname !== "/login" && pathname !== "/register" ? pathname : "/products"
  }

  const navLinks = [
    { href: "/products?category=men", label: "Men" },
    { href: "/products?category=women", label: "Women" },
    { href: "/products?category=kids", label: "Kids" },
  ]

  const isActive = (href: string) => {
    if (href.includes("?")) {
      return pathname.includes("/products") && href.includes(pathname.split("?")[0])
    }
    return pathname === href
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">E-Fashion</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-sm mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-secondary/50 border-0 rounded-full"
                />
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link href={user ? "/profile" : "/login"}>
                {user ? (
                  <Button variant="ghost" size="icon" className="rounded-full overflow-hidden p-0 w-9 h-9">
                    <img
                      src="/60111.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <span className="sr-only">Profile</span>
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Login</span>
                  </Button>
                )}
              </Link>

              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>

              <Link href="/cart" className="relative" onClick={handleCartClick}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-6 mt-6">
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </form>
                    <nav className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>Please login or create an account to access your shopping cart.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => router.push(`/login?redirect=${getCurrentRedirect()}`)}
              className="w-full rounded-full"
            >
              Login
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/register?redirect=${getCurrentRedirect()}`)}
              className="w-full rounded-full"
            >
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
