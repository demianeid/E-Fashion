import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    name: "Men",
    href: "/products?category=men",
    image: "/mens-fashion.png",
    count: "120+ Products",
  },
  {
    name: "Women",
    href: "/products?category=women",
    image: "/womens-fashion.png",
    count: "150+ Products",
  },
  {
    name: "Kids",
    href: "/products?category=kids",
    image: "/kids-fashion.png",
    count: "80+ Products",
  },
]

export function CategorySection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Shop by Category</h2>
          <p className="mt-2 text-muted-foreground">Find the perfect style for everyone</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-card">
                <h3 className="text-2xl font-bold">{category.name}</h3>
                <p className="text-sm text-card/80 mt-1">{category.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
