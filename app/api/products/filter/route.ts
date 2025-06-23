import { NextRequest, NextResponse } from 'next/server';
import { CustomerPreferences, ProductItem } from '@/lib/types';

// Sample product data matching frontend structure
const SAMPLE_PRODUCTS = [
  {
    id: "SKU123456",
    title: "Men's Formal Cotton Shirt",
    style: ["office", "basic"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["white", "light blue", "gray"],
    price: 369000,
    tags: ["new", "office", "sale"],
  },
  {
    id: "SKU123457",
    title: "Women's Casual Denim Jacket",
    style: ["casual", "trendy"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["blue", "black", "white"],
    price: 599000,
    tags: ["trending", "casual"],
  },
  {
    id: "SKU123458",
    title: "Unisex Hoodie",
    style: ["casual", "streetwear"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["black", "gray", "navy", "burgundy"],
    price: 449000,
    tags: ["eco-friendly", "comfort"],
  }
];

function filterProducts(products: any[], preferences: CustomerPreferences) {
  console.log('Filtering with preferences:', preferences);
  
  return products.filter(product => {
    console.log('Checking product:', product.name);
    
    // Budget filtering (convert IDR to USD)
    if (preferences.budget_range && preferences.budget_range !== 'any') {
      const priceUSD = product.price / 15000; // Convert IDR to USD
      const budgetRanges: Record<string, [number, number]> = {
        low: [0, 50],
        medium: [50, 150],
        high: [150, Infinity]
      };
      const range = budgetRanges[preferences.budget_range];
      if (range) {
        const [min, max] = range;
        console.log(`Price check: $${priceUSD} vs range [${min}, ${max}]`);
        if (priceUSD < min || priceUSD > max) return false;
      }
    }

    // Style filtering
    if (preferences.style_preference) {
      const hasStyle = Array.isArray(product.style) 
        ? product.style.some((style: string) => 
            style.toLowerCase().includes(preferences.style_preference!.toLowerCase())
          )
        : product.style?.toLowerCase().includes(preferences.style_preference.toLowerCase());
      console.log(`Style check: ${preferences.style_preference} vs ${product.style} = ${hasStyle}`);
      if (!hasStyle) return false;
    }

    // Size filtering
    if (preferences.size) {
      const hasSize = product.sizes.includes(preferences.size.toUpperCase());
      console.log(`Size check: ${preferences.size} vs ${product.sizes} = ${hasSize}`);
      if (!hasSize) return false;
    }

    // Color filtering
    if (preferences.color_preference) {
      const hasColor = product.colors.some(color => 
        color.toLowerCase().includes(preferences.color_preference!.toLowerCase())
      );
      console.log(`Color check: ${preferences.color_preference} vs ${product.colors} = ${hasColor}`);
      if (!hasColor) return false;
    }

    // Occasion filtering - map to product style/tags
    if (preferences.occasion) {
      const occasionMap: Record<string, string[]> = {
        'daily': ['casual', 'basic', 'comfort'],
        'work': ['office', 'professional', 'formal'],
        'party': ['elegant', 'trendy', 'formal'],
        'casual': ['casual', 'basic', 'streetwear']
      };
      
      const mappedStyles = occasionMap[preferences.occasion.toLowerCase()] || [preferences.occasion.toLowerCase()];
      const hasOccasion = product.style.some(style => 
        mappedStyles.some(mapped => style.toLowerCase().includes(mapped))
      ) || product.tags?.some(tag => 
        mappedStyles.some(mapped => tag.toLowerCase().includes(mapped))
      );
      
      console.log(`Occasion check: ${preferences.occasion} (${mappedStyles}) vs ${product.style}/${product.tags} = ${hasOccasion}`);
      if (!hasOccasion) return false;
    }

    return true;
  });
}

export async function POST(request: NextRequest) {
  try {
    const preferences: CustomerPreferences = await request.json();
    
    const filteredProducts = filterProducts(SAMPLE_PRODUCTS, preferences);
    
    return NextResponse.json({
      products: filteredProducts.map(p => ({
        ...p,
        name: p.title
      })),
      count: filteredProducts.length,
      preferences
    });

  } catch (error) {
    console.error('Product filtering error:', error);
    return NextResponse.json(
      { error: 'Failed to filter products' },
      { status: 500 }
    );
  }
}