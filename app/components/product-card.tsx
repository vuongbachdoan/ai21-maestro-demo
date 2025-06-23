import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  title: string
  description: string
  gender: string
  productType: string
  style: string[]
  sizes: string[]
  colors: string[]
  price: number
  material: string
  features: string[]
  availableStock: number
  images: string[]
  tags: string[]
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    const priceUSD = price / 15000 // Convert IDR to USD
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(priceUSD)
  }

  return (
    <div className="group cursor-pointer">
      <div className="glass-effect rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20">
        <div className="relative overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.title}
            width={300}
            height={400}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge
                key={tag}
                className={`text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm border-0 ${
                  tag === "sale"
                    ? "bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-lg"
                    : tag === "new"
                      ? "bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-lg"
                      : "bg-white/80 text-gray-700 shadow-md"
                }`}
              >
                {tag.toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {product.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {product.style.map((styleTag) => (
              <Badge
                key={styleTag}
                className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 hover:from-purple-200 hover:to-pink-200 transition-all"
              >
                {styleTag}
              </Badge>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Sizes:</span>
              <span className="text-sm text-gray-600 font-medium">{product.sizes.join(", ")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Colors:</span>
              <div className="flex gap-2">
                {product.colors.slice(0, 3).map((color) => (
                  <div
                    key={color}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                    style={{
                      backgroundColor: color === "white" ? "#ffffff" : color === "light blue" ? "#87CEEB" : color,
                    }}
                    title={color}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-gray-500 font-medium">+{product.colors.length - 3}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
