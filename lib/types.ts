export interface ProductItem {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'accessories';
  style: 'casual' | 'formal' | 'trendy' | 'classic' | 'sporty';
  price: number;
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  colors: string[];
  occasion: ('work' | 'casual' | 'party' | 'date' | 'formal' | 'everyday')[];
  description: string;
  imageUrl: string;
  inStock: boolean;
}

export interface CustomerPreferences {
  style_preference?: string;
  size?: string;
  color_preference?: string;
  budget_range?: 'low' | 'medium' | 'high';
  occasion?: string;
}

export interface ChatResponse {
  response: string;
  requirements?: {
    score: number;
    finish_reason: string;
    requirements: Array<{
      name: string;
      description: string;
      score: number;
      reason?: string;
    }>;
  };
  runId: string;
}