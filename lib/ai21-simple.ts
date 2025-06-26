// Enhanced AI21 client with requirement-based instruction injection
export async function callAI21Chat(
  message: string,
  apiKey: string,
  conversationHistory: any[] = [],
  requirements?: { name: string; description: string }[]
) {
  const defaultInstruction = `You are a helpful fashion assistant for an online clothing store. Follow this exact process:

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

  const systemContent = requirements?.length
    ? `You are a helpful fashion assistant for an online clothing store.
Your task is to understand customer preferences and return a summary block for filtering.

Follow these requirements strictly:
${requirements.map((r, i) => `${i + 1}. ${r.description}`).join('\n')}`
    : defaultInstruction;

  const messages = [
    {
      role: 'system',
      content: systemContent,
    },
    ...conversationHistory,
    {
      role: 'user',
      content: message,
    },
  ];

  const response = await fetch('https://api.ai21.com/studio/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'jamba-large-1.6',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI21 API Error:', errorText);
    throw new Error(`AI21 API failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
