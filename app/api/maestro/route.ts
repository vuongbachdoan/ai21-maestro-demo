import { NextRequest, NextResponse } from 'next/server';
import AI21Client, { type MaestroMessage, type Requirement } from '@/lib/ai21-client';
import { callAI21Chat } from '@/lib/ai21-simple';

const client = new AI21Client(process.env.AI21_API_KEY!);

const SYSTEM_PROMPT = `You are a helpful fashion assistant for an online clothing store. Follow this exact process:

1. Ask about ONE attribute at a time in this order: Style → Size → Color → Budget → Occasion
2. Only ask the next question after getting an answer (or if user says "I don't know")
3. After collecting all 5 attributes, ask: "Do you have any other specific requirements?"
4. If no other requirements, provide this exact format:

**PREFERENCES SUMMARY:**
- Style: [value or "any"]
- Size: [value or "any"]
- Color: [value or "any"]
- Budget: [low/medium/high or "any"]
- Occasion: [value or "any"]

**FILTER_PRODUCTS**

DO NOT use tool_calls or any other format. Only use the exact format above.`;

function extractPreferences(aiResponse: string) {
  const lines = aiResponse.split('\n');
  const preferences: any = {};
  
  lines.forEach(line => {
    if (line.includes('- Style:')) preferences.style_preference = line.split(':')[1]?.trim().replace(/"/g, '') !== 'any' ? line.split(':')[1]?.trim().replace(/"/g, '') : undefined;
    if (line.includes('- Size:')) preferences.size = line.split(':')[1]?.trim().replace(/"/g, '') !== 'any' ? line.split(':')[1]?.trim().replace(/"/g, '') : undefined;
    if (line.includes('- Color:')) preferences.color_preference = line.split(':')[1]?.trim().replace(/"/g, '') !== 'any' ? line.split(':')[1]?.trim().replace(/"/g, '') : undefined;
    if (line.includes('- Budget:')) preferences.budget_range = line.split(':')[1]?.trim().replace(/"/g, '') !== 'any' ? line.split(':')[1]?.trim().replace(/"/g, '') as 'low' | 'medium' | 'high' : undefined;
    if (line.includes('- Occasion:')) preferences.occasion = line.split(':')[1]?.trim().replace(/"/g, '') !== 'any' ? line.split(':')[1]?.trim().replace(/"/g, '') : undefined;
  });
  
  return preferences;
}

const REQUIREMENTS: Requirement[] = [
  {
    name: "style_preference",
    description: "Customer's preferred clothing style (casual, formal, trendy, classic, etc.)",
    is_mandatory: false
  },
  {
    name: "size",
    description: "Customer's size requirements (XS, S, M, L, XL, etc.)",
    is_mandatory: false
  },
  {
    name: "color_preference", 
    description: "Customer's preferred colors or color families",
    is_mandatory: false
  },
  {
    name: "budget_range",
    description: "Customer's budget range (low: under $50, medium: $50-150, high: over $150)",
    is_mandatory: false
  },
  {
    name: "occasion",
    description: "The occasion or context for the clothing (work, casual, party, date, etc.)",
    is_mandatory: false
  }
];

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Use simple chat API (Maestro timing out)
    const chatResponse = await callAI21Chat(message, process.env.AI21_API_KEY!, conversationHistory);
    let aiResponse = chatResponse.choices[0].message.content;
    
    // Clean up tool_calls format and convert to proper summary
    if (aiResponse.includes('<tool_calls>')) {
      try {
        const argsMatch = aiResponse.match(/"arguments":\s*({[^}]*})/);
        if (argsMatch) {
          const argsStr = argsMatch[1].replace(/([a-zA-Z_]+):/g, '"$1":').replace(/'/g, '"');
          const args = JSON.parse(argsStr);
          aiResponse = `**PREFERENCES SUMMARY:**
- Style: ${args.style || 'any'}
- Size: ${args.size || 'any'}
- Color: ${args.color || 'any'}
- Budget: ${args.budget || 'any'}
- Occasion: ${args.occasion || 'any'}

**FILTER_PRODUCTS**`;
        }
      } catch (error) {
        console.error('Failed to parse tool_calls:', error);
        // Fallback: just remove tool_calls and show generic summary
        aiResponse = aiResponse.replace(/<tool_calls>.*?<\/tool_calls>/s, 
          `**PREFERENCES SUMMARY:**
- Style: any
- Size: any
- Color: any
- Budget: any
- Occasion: any

**FILTER_PRODUCTS**`);
      }
    }
    
    // Check if AI wants to filter products
    if (aiResponse.includes('**FILTER_PRODUCTS**')) {
      const preferences = extractPreferences(aiResponse);
      
      const filterResponse = await fetch(`${request.nextUrl.origin}/api/products/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      
      if (filterResponse.ok) {
        const { products = [] } = await filterResponse.json();
        
        const responseWithProducts = aiResponse.replace('**FILTER_PRODUCTS**', 
          `\n\n**RECOMMENDED PRODUCTS:**\n${products.length > 0 ? products.map((p: any) => 
            `- ${p.name} - $${p.price} (${p.colors.join(', ')}) - Sizes: ${p.sizes.join(', ')}`
          ).join('\n') : 'No products match your preferences.'}`);
        
        return NextResponse.json({
          response: responseWithProducts,
          products,
          requirements: null,
          runId: 'chat-' + Date.now()
        });
      }
    }
    
    return NextResponse.json({
      response: aiResponse,
      requirements: null,
      runId: 'chat-' + Date.now()
    });

  } catch (error) {
    console.error('All API methods failed:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}