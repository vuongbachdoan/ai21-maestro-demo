# AI-Powered Clothing Store

An intelligent e-commerce platform that uses AI21 Maestro to provide personalized shopping assistance through natural language conversations.

## Features

- **AI Shopping Assistant**: Chat with an AI assistant to find products based on your preferences
- **Smart Product Filtering**: AI extracts preferences from natural language and filters products automatically
- **Responsive Design**: Modern, mobile-friendly interface with beautiful gradients and animations
- **Real-time Chat**: Interactive chat interface with conversation history

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI Integration**: AI21 Maestro API
- **UI Components**: Lucide React icons, React Markdown
- **Styling**: Custom glass-morphism effects, gradient backgrounds

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- AI21 API key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/vuongbachdoan/ai21-maestro-demo.git
   cd clothing-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_AI21_API_KEY=your_ai21_api_key_here
   ```

   To get your AI21 API key:
   - Visit [AI21 Studio](https://studio.ai21.com/)
   - Sign up/login to your account
   - Navigate to API Keys section
   - Generate a new API key

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## How AI21 Maestro Integration Works

### Architecture Overview

The AI shopping assistant uses AI21's Maestro model to understand customer preferences and provide intelligent product recommendations through a multi-step conversation flow.

### Key Components

#### 1. Maestro API Route (`/app/api/maestro/route.ts`)

**Purpose**: Handles AI conversations and preference extraction

**Key Features**:
- Processes natural language input from customers
- Uses structured requirements to guide AI responses
- Extracts shopping preferences (style, size, color, budget, occasion)
- Calls product filter API when preferences are complete

**AI21 Integration**:
```typescript
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
```

#### 2. Product Filter API (`/app/api/products/filter/route.ts`)

**Purpose**: Filters products based on extracted preferences

**Filtering Logic**:
- **Style**: Matches product style arrays with preferences
- **Size**: Supports multiple sizes (e.g., "S, M, L")
- **Color**: Partial matching for color preferences
- **Budget**: Converts IDR to USD and applies range filtering
- **Occasion**: Maps occasions to relevant styles

#### 3. Chat Assistant Component (`/app/components/chat-assistant.tsx`)

**Purpose**: Provides the chat interface and handles AI responses

**Key Features**:
- Real-time conversation with AI
- Extracts preferences from AI responses
- Triggers product filtering via custom events
- Maintains conversation history

### Usage Examples

#### Example 1: Complete Preference Set
```
User: "I need office clothes in size M, preferably black, budget around $80"
AI Extraction: {
  style_preference: 'office',
  size: 'M',
  color_preference: 'black', 
  budget_range: 'medium'
}
Result: Shows office shirts and blazers in size M, black color, $50-$150 range
```

#### Example 2: Partial Preferences
```
User: "Looking for casual wear"
AI Extraction: {
  style_preference: 'casual'
}
Result: Shows all casual items (jackets, hoodies, pants) in all sizes/colors
```

#### Example 3: Multi-Size Request
```
User: "I wear size S or M, need something for the office"
AI Extraction: {
  style_preference: 'office',
  size: 'S, M'
}
Result: Shows office wear available in either S or M sizes
```

#### Example 4: Occasion-Based
```
User: "What should I wear for daily activities?"
AI Extraction: {
  style_preference: 'casual',
  occasion: 'daily'
}
Result: Maps 'daily' to casual/basic/comfort styles, shows appropriate items
```

### AI21 Maestro Configuration

#### Defined Preferences Structure

The system defines **5 core customer preferences** extracted from natural language:

##### 1. Style Preference (`style_preference`)
```typescript
{
  name: 'style_preference',
  description: 'Identify clothing style preference (casual, formal, trendy, classic, office, sporty) or "any"'
}
```
- **Valid Values**: `casual`, `formal`, `trendy`, `classic`, `office`, `sporty`, `any`
- **Example**: "I like casual clothes" → `{ style_preference: 'casual' }`

##### 2. Size (`size`)
```typescript
{
  name: 'size', 
  description: 'Identify clothing size: XS, S, M, L, XL, XXL or "any"'
}
```
- **Valid Values**: `XS`, `S`, `M`, `L`, `XL`, `XXL`, `any`
- **Multi-Size Support**: `"S, M"` for flexible fitting
- **Example**: "I wear medium" → `{ size: 'M' }`

##### 3. Color Preference (`color_preference`)
```typescript
{
  name: 'color_preference',
  description: 'Identify preferred color(s) or "any"'
}
```
- **Flexible Matching**: Partial matching ("blue" matches "light blue")
- **Example**: "I prefer black clothes" → `{ color_preference: 'black' }`

##### 4. Budget Range (`budget_range`)
```typescript
{
  name: 'budget_range',
  description: 'Determine budget range: "low" (< $50), "medium" ($50–150), "high" (> $150), or "any"'
}
```
- **Categories**:
  - `low`: Under $50 USD
  - `medium`: $50-$150 USD
  - `high`: Over $150 USD
- **Auto-conversion**: IDR prices ÷ 15000 to USD
- **Example**: "under $100" → `{ budget_range: 'medium' }`

##### 5. Occasion (`occasion`)
```typescript
{
  name: 'occasion',
  description: 'Extract occasion (daily, party, office, travel, workout, etc.) or "any"'
}
```
- **Smart Mapping**: Maps occasions to relevant styles
- **Example**: "for work meetings" → `{ occasion: 'office' }`

#### AI Prompting Strategy

**Primary Approach: Structured Requirements**
```typescript
const REQUIREMENTS: Requirement[] = [
  // Individual requirement objects with extraction rules
];
```
- Returns tool call format: `<tool_calls>[{"name": "filter_products", "arguments": {...}}]</tool_calls>`
- Processes all preferences simultaneously

**Fallback Approach: Conversational Flow**
```typescript
const defaultInstruction = `
1. Ask about ONE attribute at a time: Style → Size → Color → Budget → Occasion
2. Only ask next question after getting an answer
3. Return **FILTER_PRODUCTS** format when complete
`;
```
- Step-by-step dialogue
- Sequential preference collection

#### Advanced Features

**Multi-Size Support**:
- Input: `"size S or M"` → Output: `{ size: 'S, M' }`
- Filter matches any specified size

**Occasion Mapping**:
```typescript
const occasionMap = {
  'daily': ['casual', 'basic', 'comfort'],
  'work': ['office', 'professional', 'formal'],
  'party': ['elegant', 'trendy', 'formal']
};
```

**Flexible Matching**:
- **Style**: Exact match (`casual` in `["casual", "trendy"]`)
- **Color**: Partial match (`blue` matches `"light blue"`)
- **Budget**: Range-based with currency conversion

### Conversation Flow

1. **Initial Greeting**: AI welcomes user and asks about preferences
2. **Preference Collection**: AI asks follow-up questions to gather details
3. **Preference Extraction**: System parses AI response for structured data
4. **Product Filtering**: Calls filter API with extracted preferences
5. **Results Display**: Shows filtered products with applied filters indicator

### Customization

#### Adding New Product Attributes

1. **Update Requirements** in `/app/api/maestro/route.ts`
2. **Modify Filter Logic** in `/app/api/products/filter/route.ts`
3. **Update Product Schema** in sample data

#### Modifying AI Behavior

1. **Adjust Requirements**: Change AI instruction prompts
2. **Update Extraction Logic**: Modify preference parsing functions
3. **Customize Responses**: Change AI response templates

## Project Structure

```
clothing-store/
├── app/
│   ├── api/
│   │   ├── maestro/route.ts          # AI21 Maestro integration
│   │   └── products/filter/route.ts  # Product filtering logic
│   ├── components/
│   │   ├── chat-assistant.tsx        # Chat interface
│   │   ├── product-grid.tsx          # Product display & filtering
│   │   └── product-card.tsx          # Individual product cards
│   └── page.tsx                      # Main page
├── lib/
│   ├── ai21-client.ts               # AI21 API client
│   ├── ai21-simple.ts               # Simplified AI21 calls
│   └── types.ts                     # TypeScript definitions
└── README.md
```

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_AI21_API_KEY` | Your AI21 Studio API key | Yes |

## Troubleshooting

### Common Issues

1. **AI not responding**: Check AI21 API key in `.env.local`
2. **Filtering not working**: Verify product data structure matches filter logic
3. **Chat not opening**: Check for JavaScript errors in browser console

### Debug Mode

Enable debug logging by checking browser console for:
- API responses from maestro endpoint
- Extracted preferences
- Filter application events

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
