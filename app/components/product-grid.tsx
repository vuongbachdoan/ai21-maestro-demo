"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"

// Sample product data based on the provided JSON structure
const products = [
  {
    id: "SKU123456",
    title: "Men's Formal Cotton Shirt",
    description: "Premium cotton shirt, breathable and sweat-absorbent, perfect for office wear.",
    gender: "Male",
    productType: "shirt",
    style: ["office", "basic"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["white", "light blue", "gray"],
    price: 369000,
    material: "Stretch cotton",
    features: ["anti-wrinkle", "cooling", "easy to iron"],
    availableStock: 42,
    images: ["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c4f4b548-9a89-42ef-86f7-f3e89a22e704/AS+M+NK+CLUB+COACHES+JKT.png", "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c4f4b548-9a89-42ef-86f7-f3e89a22e704/AS+M+NK+CLUB+COACHES+JKT.png"],
    tags: ["new", "office", "sale"],
  },
  {
    id: "SKU123457",
    title: "Women's Casual Denim Jacket",
    description: "Stylish denim jacket perfect for casual outings and layering.",
    gender: "Female",
    productType: "jacket",
    style: ["casual", "trendy"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["blue", "black", "white"],
    price: 599000,
    material: "Premium denim",
    features: ["durable", "comfortable", "versatile"],
    availableStock: 28,
    images: ["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2a3ab9cb-6460-4827-9914-16e0657577fa/AS+M+NK+TRAIL+AIREEZ+JKT.png", "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2a3ab9cb-6460-4827-9914-16e0657577fa/AS+M+NK+TRAIL+AIREEZ+JKT.png"],
    tags: ["trending", "casual"],
  },
  {
    id: "SKU123458",
    title: "Unisex Hoodie",
    description: "Comfortable hoodie made from organic cotton blend, perfect for everyday wear.",
    gender: "Unisex",
    productType: "hoodie",
    style: ["casual", "streetwear"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["black", "gray", "navy", "burgundy"],
    price: 449000,
    material: "Organic cotton blend",
    features: ["soft", "warm", "eco-friendly"],
    availableStock: 35,
    images: ["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fd12f804-7a74-4dd5-8b19-dbbe3271e3ed/AS+M+NK+DF+TCH+WVN+WR+FZ+JKT.png", "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fd12f804-7a74-4dd5-8b19-dbbe3271e3ed/AS+M+NK+DF+TCH+WVN+WR+FZ+JKT.png"],
    tags: ["eco-friendly", "comfort"],
  },
  {
    id: "SKU123459",
    title: "Women's Summer Dress",
    description: "Light and airy summer dress perfect for warm weather and special occasions.",
    gender: "Female",
    productType: "dress",
    style: ["summer", "elegant"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["floral", "white", "pink", "yellow"],
    price: 529000,
    material: "Cotton blend",
    features: ["breathable", "lightweight", "wrinkle-resistant"],
    availableStock: 22,
    images: ["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9d6b1459-f92e-4197-87ac-3f02aa84455e/AS+M+NK+UV+RPL+STRIDE+JACKET.png", "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9d6b1459-f92e-4197-87ac-3f02aa84455e/AS+M+NK+UV+RPL+STRIDE+JACKET.png"],
    tags: ["summer", "elegant", "new"],
  },
  {
    id: "SKU123460",
    title: "Men's Chino Pants",
    description: "Classic chino pants suitable for both casual and semi-formal occasions.",
    gender: "Male",
    productType: "pants",
    style: ["casual", "smart-casual"],
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["khaki", "navy", "black", "olive"],
    price: 399000,
    material: "Cotton twill",
    features: ["comfortable", "versatile", "durable"],
    availableStock: 45,
    images: ["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4ca0e459-e1c4-4f83-82b6-52127348f999/AS+M+NK+WVN+LND+WR+HD+JKT.png", "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4ca0e459-e1c4-4f83-82b6-52127348f999/AS+M+NK+WVN+LND+WR+HD+JKT.png"],
    tags: ["versatile", "classic"],
  },
  {
    id: "SKU123461",
    title: "Women's Blazer",
    description: "Professional blazer perfect for office wear and business meetings.",
    gender: "Female",
    productType: "blazer",
    style: ["office", "professional"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["black", "navy", "gray", "burgundy"],
    price: 799000,
    material: "Wool blend",
    features: ["tailored", "professional", "comfortable"],
    availableStock: 18,
    images: ["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/308d7aec-63c7-458f-abdb-4de906db4b45/AS+M+NK+DF+WVN+ICON+JKT+STRTFV.png", "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/308d7aec-63c7-458f-abdb-4de906db4b45/AS+M+NK+DF+WVN+ICON+JKT+STRTFV.png"],
    tags: ["professional", "office", "sale"],
  },
]

export default function ProductGrid() {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [activeFilters, setActiveFilters] = useState<any>(null)

  useEffect(() => {
    // Listen for chat filter events
    const handleChatFilters = (event: any) => {
      const filters = event.detail
      setActiveFilters(filters)
      
      // Apply filters to products
      const filtered = products.filter(product => {
        // Style filtering
        if (filters.style_preference && !product.style.some((s: string) => 
          s.toLowerCase().includes(filters.style_preference.toLowerCase()))) {
          return false
        }
        
        // Size filtering
        if (filters.size && !product.sizes.includes(filters.size.toUpperCase())) {
          return false
        }
        
        // Color filtering
        if (filters.color_preference && !product.colors.some((c: string) => 
          c.toLowerCase().includes(filters.color_preference.toLowerCase()))) {
          return false
        }
        
        // Budget filtering (convert price from IDR to USD for comparison)
        if (filters.budget_range && filters.budget_range !== 'any') {
          const priceUSD = product.price / 15000
          const budgetRanges = { low: [0, 50], medium: [50, 150], high: [150, Infinity] }
          const [min, max] = budgetRanges[filters.budget_range as keyof typeof budgetRanges] || [0, Infinity]
          if (priceUSD < min || priceUSD > max) return false
        }
        
        // Occasion filtering
        if (filters.occasion && filters.occasion !== 'any') {
          const occasionMap: Record<string, string[]> = {
            'daily': ['casual', 'basic', 'comfort'],
            'work': ['office', 'professional'],
            'party': ['elegant', 'trendy'],
            'casual': ['casual', 'streetwear']
          }
          
          const mappedStyles = occasionMap[filters.occasion.toLowerCase()] || [filters.occasion.toLowerCase()]
          const hasOccasion = product.style.some((s: string) => 
            mappedStyles.some(mapped => s.toLowerCase().includes(mapped))
          ) || product.tags?.some((tag: string) => 
            mappedStyles.some(mapped => tag.toLowerCase().includes(mapped))
          )
          
          if (!hasOccasion) return false
        }
        
        return true
      })
      
      setFilteredProducts(filtered)
    }

    const handleChatReset = () => {
      setActiveFilters(null)
      setFilteredProducts(products)
    }

    window.addEventListener('chatFiltersApplied', handleChatFilters)
    window.addEventListener('chatFiltersReset', handleChatReset)
    return () => {
      window.removeEventListener('chatFiltersApplied', handleChatFilters)
      window.removeEventListener('chatFiltersReset', handleChatReset)
    }
  }, [])

  return (
    <section id="products" className="py-20 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-pink-50/30"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
              Featured Collection
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Trending Now
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our carefully curated collection of premium clothing designed for every moment of your life
          </p>
        </div>

        {activeFilters && (
          <div className="mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Applied Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([key, value]) => 
                value && (
                  <span key={key} className="px-3 py-1 bg-black text-white text-sm rounded-full">
                    {key.replace('_', ' ')}: {value}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && activeFilters && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products match your preferences. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </section>
  )
}
