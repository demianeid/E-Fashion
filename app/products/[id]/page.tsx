"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getProductById } from "@/lib/data"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Minus, Plus } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const product = getProductById(params.id as string)
  const { addItem } = useCart()
  const { user } = useAuth()

  const [selectedSize, setSelectedSize] = useState(product?.sizes[1] || "")
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || "")
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Product not found</p>
        </main>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginDialog(true)
      return
    }
    addItem(product, selectedSize, selectedColor, quantity)
  }

  const reviews = product.reviewsList || []

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
            <Link href={`/products?category=${product.category}`} className="hover:text-foreground capitalize">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/products?category=${product.category}&subcategory=${product.subcategory}`}
              className="hover:text-foreground"
            >
              {product.subcategory}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2">
                {product.images.slice(0, 4).map((img, i) => (
                  <button
                    title="select"
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-foreground" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} view ${i + 1}`}
                      width={64}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              {/* Main Image */}
              <div className="flex-1 aspect-[4/5] relative rounded-lg overflow-hidden bg-accent/20">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-2xl text-primary font-semibold mb-4">${product.price.toFixed(2)}</p>

              <p className="text-muted-foreground mb-6">{product.description}</p>

              {/* Size Selector */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedSize === size
                          ? "bg-foreground text-background border-foreground"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Color</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? "border-foreground ring-2 ring-foreground ring-offset-2"
                          : "border-border"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center">
                  <span className="font-medium mr-3">Quantity</span>
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      title="minus"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <button 
                      title="plus"
                      onClick={() => setQuantity((q) => q + 1)} className="p-2 hover:bg-muted transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Button onClick={handleAddToCart} className="flex-1 rounded-full py-6" disabled={!product.inStock}>
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">Based on {product.reviews} reviews</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-lg p-6 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{review.title}</h3>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{`"${review.text}"`}</p>
                    <p className="text-sm text-muted-foreground">- {review.userName}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground col-span-3 text-center py-8">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>Please login or create an account to add items to your cart.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => router.push(`/login?redirect=/products/${product.id}`)}
              className="w-full rounded-full"
            >
              Login
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/register?redirect=/products/${product.id}`)}
              className="w-full rounded-full"
            >
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
