"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  showRating?: boolean
}

export function ProductCard({ product, showRating = false }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-accent/30 rounded-lg mb-3">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-muted-foreground font-medium">Out of Stock</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-medium text-foreground text-sm mb-1">{product.name}</h3>
        <p className="text-sm text-foreground">${product.price.toFixed(2)}</p>
        {showRating && (
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
          </div>
        )}
      </div>
    </Link>
  )
}
