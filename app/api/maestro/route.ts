import { NextRequest, NextResponse } from 'next/server';
import AI21Client, { type Requirement } from '@/lib/ai21-client';
import { callAI21Chat } from '@/lib/ai21-simple';

const client = new AI21Client(process.env.AI21_API_KEY!);

const REQUIREMENTS: Requirement[] = [
  {
    name: 'style_preference',
    description:
      '- Identify and extract clothing style preference (casual, formal, trendy, classic, office, sporty) or "any".\n' +
      '- Return in markdown: `- Style: <value>`',
  },
  {
    name: 'size',
    description:
      '- Identify clothing size if mentioned: XS, S, M, L, XL, XXL or "any".\n' +
      '- Return in markdown: `- Size: <value>`',
  },
  {
    name: 'color_preference',
    description:
      '- Identify preferred color(s) or "any".\n' +
      '- Return in markdown: `- Color: <value>`',
  },
  {
    name: 'budget_range',
    description:
      '- Determine budget range: "low" (< $50), "medium" ($50–150), "high" (> $150), or "any".\n' +
      '- Return in markdown: `- Budget: <value>`',
  },
  {
    name: 'occasion',
    description:
      '- Extract occasion (daily, party, office, travel, workout, etc.) or "any".\n' +
      '- Return in markdown: `- Occasion: <value>`',
  },
  {
    name: 'summary_trigger',
    description:
      '- Once all attributes are collected, return this exact block:\n' +
      '```markdown\n' +
      '**FILTER_PRODUCTS**\n' +
      '- Style: ...\n' +
      '- Size: ...\n' +
      '- Color: ...\n' +
      '- Budget: ...\n' +
      '- Occasion: ...\n' +
      '```',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Step-by-step consultation via AI21 with injected rules
    const chatResponse = await callAI21Chat(
      message,
      process.env.AI21_API_KEY!,
      conversationHistory,
      REQUIREMENTS
    );

    const aiResponse = chatResponse.choices[0].message.content;

    // Check for tool calls format
    if (aiResponse.includes('<tool_calls>') && aiResponse.includes('filter_products')) {
      const preferences = extractPreferencesFromToolCall(aiResponse);
      
      // Call filter API
      const filterResponse = await fetch(`${request.nextUrl.origin}/api/products/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      const filterData = await filterResponse.json();
      
      return NextResponse.json({
        response: `I found ${filterData.count} products that match your preferences!`,
        preferences,
        products: filterData.products,
        triggerFilter: true,
      });
    }

    if (aiResponse.includes('**FILTER_PRODUCTS**')) {
      const preferences = extractPreferencesFromSummary(aiResponse);
      
      // Call filter API
      const filterResponse = await fetch(`${request.nextUrl.origin}/api/products/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      const filterData = await filterResponse.json();

      return NextResponse.json({
        response: `I found ${filterData.count} products that match your preferences!`,
        preferences,
        products: filterData.products,
        triggerFilter: true,
      });
    }

    return NextResponse.json({
      response: aiResponse,
      preferences: {},
      summary: {
        style: 'any',
        size: 'any',
        color: 'any',
        budget: 'any',
        occasion: 'any',
      },
      shouldFilter: false,
    });
  } catch (err) {
    console.error('Failed to run maestro:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function extractPreferencesFromToolCall(text: string) {
  try {
    const match = text.match(/"arguments":\s*({[^}]+})/);
    if (match) {
      const args = JSON.parse(match[1]);
      const preferences: any = {};
      
      if (args.style && args.style !== 'any') preferences.style_preference = args.style;
      if (args.size && args.size !== 'any') preferences.size = args.size;
      if (args.color && args.color !== 'any') preferences.color_preference = args.color;
      if (args.budget && args.budget !== 'any') preferences.budget_range = args.budget;
      if (args.occasion && args.occasion !== 'any') preferences.occasion = args.occasion;
      
      console.log('Tool call preferences:', preferences);
      return preferences;
    }
  } catch (e) {
    console.error('Error parsing tool call:', e);
  }
  return {};
}

function extractPreferencesFromSummary(text: string) {
  const lines = text.split('\n');
  const preferences: any = {};

  lines.forEach((line) => {
    if (line.includes('- Style:')) {
      const value = line.split(':')[1]?.trim();
      if (value && value !== 'any') preferences.style_preference = value;
    }
    if (line.includes('- Size:')) {
      const value = line.split(':')[1]?.trim();
      if (value && value !== 'any') preferences.size = value;
    }
    if (line.includes('- Color:')) {
      const value = line.split(':')[1]?.trim();
      if (value && value !== 'any') preferences.color_preference = value;
    }
    if (line.includes('- Budget:')) {
      const value = line.split(':')[1]?.trim();
      if (value && value !== 'any') preferences.budget_range = value;
    }
    if (line.includes('- Occasion:')) {
      const value = line.split(':')[1]?.trim();
      if (value && value !== 'any') preferences.occasion = value;
    }
  });

  console.log(preferences)

  return preferences;
}
