"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const subcategoryParam = searchParams.get("subcategory")
  const searchQuery = searchParams.get("search")

  const [selectedCategory, setSelectedCategory] = useState<string | null>(subcategoryParam)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    size: true,
    color: true,
    price: true,
    brand: false,
  })

  const itemsPerPage = 6

  const categories = ["Dresses", "Tops", "Jeans", "Skirts", "Outerwear"]
  const sizes = ["XS", "S", "M", "L", "XL"]
  const colors = [
    { name: "White", hex: "#F5F5F5" },
    { name: "Beige", hex: "#D2B48C" },
    { name: "Brown", hex: "#8B4513" },
    { name: "Black", hex: "#000000" },
    { name: "Blue", hex: "#4169E1" },
    { name: "Pink", hex: "#FFB6C1" },
  ]

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filter by main category (men/women/kids)
    if (categoryParam) {
      result = result.filter((p) => p.category === categoryParam)
    }

    // Filter by subcategory
    if (selectedCategory) {
      result = result.filter((p) => p.subcategory === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query))
    }

    // Filter by sizes
    if (selectedSizes.length > 0) {
      result = result.filter((p) => selectedSizes.some((s) => p.sizes.includes(s)))
    }

    // Filter by colors
    if (selectedColors.length > 0) {
      result = result.filter((p) => selectedColors.some((c) => p.colors.some((pc) => pc.name === c)))
    }

    const min = minPrice ? Number.parseFloat(minPrice) : 0
    const max = maxPrice ? Number.parseFloat(maxPrice) : Number.POSITIVE_INFINITY
    if (minPrice || maxPrice) {
      result = result.filter((p) => p.price >= min && p.price <= max)
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        // newest - keep original order
        break
    }

    return result
  }, [categoryParam, selectedCategory, selectedSizes, selectedColors, minPrice, maxPrice, sortBy, searchQuery])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleFilter = (filter: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({ ...prev, [filter]: !prev[filter] }))
  }

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
    setCurrentPage(1)
  }

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedSizes([])
    setSelectedColors([])
    setMinPrice("")
    setMaxPrice("")
    setCurrentPage(1)
  }

  const getCategoryTitle = () => {
    if (searchQuery) return `Search: "${searchQuery}"`
    if (categoryParam === "women") return "Women's Dresses"
    if (categoryParam === "men") return "Men's Collection"
    if (categoryParam === "kids") return "Kids' Collection"
    return "All Products"
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
            {categoryParam && (
              <>
                <Link href={`/products?category=${categoryParam}`} className="hover:text-foreground capitalize">
                  {categoryParam}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-foreground">{selectedCategory || "All"}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="border-b border-border pb-4 mb-4">
                <button
                  onClick={() => toggleFilter("category")}
                  className="flex items-center justify-between w-full text-left font-medium mb-3"
                >
                  Category
                  {expandedFilters.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedFilters.category && (
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(selectedCategory === cat ? null : cat)
                          setCurrentPage(1)
                        }}
                        className={`block text-sm ${
                          selectedCategory === cat ? "text-foreground font-medium" : "text-muted-foreground"
                        } hover:text-foreground`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="border-b border-border pb-4 mb-4">
                <button
                  onClick={() => toggleFilter("size")}
                  className="flex items-center justify-between w-full text-left font-medium mb-3"
                >
                  Size
                  {expandedFilters.size ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedFilters.size && (
                  <div className="space-y-2">
                    {sizes.map((size) => (
                      <label key={size} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedSizes.includes(size)}
                          onCheckedChange={() => handleSizeChange(size)}
                        />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div className="border-b border-border pb-4 mb-4">
                <button
                  onClick={() => toggleFilter("color")}
                  className="flex items-center justify-between w-full text-left font-medium mb-3"
                >
                  Color
                  {expandedFilters.color ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedFilters.color && (
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => handleColorChange(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColors.includes(color.name)
                            ? "border-primary ring-2 ring-primary ring-offset-2"
                            : "border-border"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="border-b border-border pb-4 mb-4">
                <button
                  onClick={() => toggleFilter("price")}
                  className="flex items-center justify-between w-full text-left font-medium mb-3"
                >
                  Price
                  {expandedFilters.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedFilters.price && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                          Min
                        </Label>
                        <Input
                          id="minPrice"
                          type="number"
                          placeholder="$0"
                          value={minPrice}
                          onChange={(e) => {
                            setMinPrice(e.target.value)
                            setCurrentPage(1)
                          }}
                          className="h-9"
                          min="0"
                        />
                      </div>
                      <span className="text-muted-foreground mt-5">-</span>
                      <div className="flex-1">
                        <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                          Max
                        </Label>
                        <Input
                          id="maxPrice"
                          type="number"
                          placeholder="$999"
                          value={maxPrice}
                          onChange={(e) => {
                            setMaxPrice(e.target.value)
                            setCurrentPage(1)
                          }}
                          className="h-9"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setMinPrice("0")
                          setMaxPrice("50")
                          setCurrentPage(1)
                        }}
                        className="text-xs px-2 py-1 rounded border border-border hover:bg-muted transition-colors"
                      >
                        Under $50
                      </button>
                      <button
                        onClick={() => {
                          setMinPrice("50")
                          setMaxPrice("100")
                          setCurrentPage(1)
                        }}
                        className="text-xs px-2 py-1 rounded border border-border hover:bg-muted transition-colors"
                      >
                        $50 - $100
                      </button>
                      <button
                        onClick={() => {
                          setMinPrice("100")
                          setMaxPrice("")
                          setCurrentPage(1)
                        }}
                        className="text-xs px-2 py-1 rounded border border-border hover:bg-muted transition-colors"
                      >
                        Over $100
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Brand Filter */}
              <div className="pb-4 mb-4">
                <button
                  onClick={() => toggleFilter("brand")}
                  className="flex items-center justify-between w-full text-left font-medium mb-3"
                >
                  Brand
                  {expandedFilters.brand ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              <Button onClick={clearFilters} className="w-full rounded-full">
                Apply Filters
              </Button>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{getCategoryTitle()}</h1>
                <select
                title="sortby"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-border rounded-lg px-4 py-2 text-sm bg-card"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showRating />
                ))}
              </div>

              {paginatedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found matching your criteria.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    {"<"}
                  </Button>
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(page)}
                        className="rounded-full"
                      >
                        {page}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(totalPages)}
                        className="rounded-full"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {">"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
