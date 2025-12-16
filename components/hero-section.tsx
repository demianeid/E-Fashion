import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="relative rounded-xl overflow-hidden bg-cover bg-center min-h-[400px] flex items-center justify-center"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/fashion-model-wearing-brown-outfit-stylish.jpg')",
          }}
        >
          <div className="text-center text-white px-4 py-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold italic leading-tight text-balance">
              Effortless Style for Every Season
            </h1>
            <p className="mt-4 text-base sm:text-lg max-w-xl mx-auto opacity-90 text-pretty">
              Discover our new collection designed for the modern wardrobe, featuring timeless pieces with a
              contemporary edge.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/products">Shop Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
