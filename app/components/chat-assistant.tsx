"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

interface MaestroMessage {
  role: 'user' | 'assistant'
  content: string
}

function extractPreferencesFromResponse(response: string) {
  const lines = response.split('\n');
  const preferences: any = {};
  
  lines.forEach(line => {
    if (line.includes('- Style:')) preferences.style_preference = line.split(':')[1]?.trim() !== 'any' ? line.split(':')[1]?.trim() : undefined;
    if (line.includes('- Size:')) preferences.size = line.split(':')[1]?.trim() !== 'any' ? line.split(':')[1]?.trim() : undefined;
    if (line.includes('- Color:')) preferences.color_preference = line.split(':')[1]?.trim() !== 'any' ? line.split(':')[1]?.trim() : undefined;
    if (line.includes('- Budget:')) preferences.budget_range = line.split(':')[1]?.trim() !== 'any' ? line.split(':')[1]?.trim() : undefined;
    if (line.includes('- Occasion:')) preferences.occasion = line.split(':')[1]?.trim() !== 'any' ? line.split(':')[1]?.trim() : undefined;
  });
  
  return preferences;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! Looking for something specific today? I'm here to help you find the perfect outfit!",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<MaestroMessage[]>([])

  // Reset conversation on component mount
  useEffect(() => {
    setMessages([
      {
        id: "1",
        text: "Hi! Looking for something specific today? I'm here to help you find the perfect outfit!",
        isBot: true,
        timestamp: new Date(),
      },
    ])
    setConversationHistory([])
    // Clear any stored filters
    localStorage.removeItem('chatFilters')
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/maestro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isBot: true,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      
      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: currentInput },
        { role: 'assistant', content: data.response }
      ])

      // Apply filters to home page if products are returned
      if (data.products && data.products.length > 0) {
        // Store filters in localStorage for home page to use
        const preferences = extractPreferencesFromResponse(data.response);
        localStorage.setItem('chatFilters', JSON.stringify(preferences));
        // Trigger custom event to notify home page
        window.dispatchEvent(new CustomEvent('chatFiltersApplied', { detail: preferences }));
      }

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl bg-black hover:bg-gray-800 text-white z-50 ${
          isOpen ? "hidden" : "flex"
        } items-center justify-center hover:scale-110 transition-all duration-300`}
      >
        <MessageCircle className="w-7 h-7" />
      </Button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 glass-effect rounded-3xl shadow-2xl border border-white/30 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Style Assistant</h3>
                <p className="text-xs text-green-500 font-medium">● Online</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMessages([
                    {
                      id: "1",
                      text: "Hi! Looking for something specific today? I'm here to help you find the perfect outfit!",
                      isBot: true,
                      timestamp: new Date(),
                    },
                  ])
                  setConversationHistory([])
                  localStorage.removeItem('chatFilters')
                  window.dispatchEvent(new CustomEvent('chatFiltersReset'))
                }}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all text-xs"
              >
                Reset
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-md ${
                    message.isBot
                      ? "bg-gray-100 text-gray-800 border border-gray-200"
                      : "bg-black text-white shadow-lg"
                  }`}
                >
                  {message.isBot ? (
                    <div className="prose prose-sm max-w-none [&>*]:mb-2 [&>*:last-child]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&>p]:leading-relaxed [&>strong]:font-semibold">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 border border-gray-200 px-4 py-3 rounded-2xl text-sm font-medium shadow-md flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/20 bg-gray-50">
            <div className="flex space-x-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 rounded-full border-gray-200 focus:border-gray-400 bg-white"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={isLoading}
                className="bg-black hover:bg-gray-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
