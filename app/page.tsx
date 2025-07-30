"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Heart,
  Send,
  Wind,
  FileText,
  Brain,
  Loader2,
  Plus,
  MessageSquare,
  Settings,
  User,
  Menu,
  X,
  Trash2,
  AlertCircle,
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ActivityCard {
  icon: React.ReactNode
  title: string
  subtitle: string
  gradient: string
  action: string
  prompt: string
}

interface APIResponse {
  answer?: string
  error?: string
  details?: string
}

export default function LumidApp() {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      setIsSidebarOpen(false)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const activities: ActivityCard[] = [
    {
      icon: <Wind className="w-6 h-6 text-white" />,
      title: "Breathing Exercise",
      subtitle: "Guided relaxation",
      gradient: "from-emerald-400 to-teal-500",
      action: "breathing",
      prompt: "I'd like to do a breathing exercise. Can you guide me through some relaxation techniques?",
    },
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      title: "Journal Thoughts",
      subtitle: "Express yourself",
      gradient: "from-green-400 to-emerald-500",
      action: "journal",
      prompt: "I want to journal my thoughts and feelings. Can you help me process what's on my mind?",
    },
    {
      icon: <Heart className="w-6 h-6 text-white" />,
      title: "Positive Affirmation",
      subtitle: "Build confidence",
      gradient: "from-teal-400 to-cyan-500",
      action: "affirmation",
      prompt: "I need some positive affirmations to boost my confidence and mood. Can you help me?",
    },
    {
      icon: <Brain className="w-6 h-6 text-white" />,
      title: "Reframe Thoughts",
      subtitle: "New perspective",
      gradient: "from-green-500 to-teal-600",
      action: "reframe",
      prompt: "I'm having negative thoughts and need help reframing them into a more positive perspective.",
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [sessions, currentSessionId])

  // API call using our proxy route to avoid CORS issues
  const getAIResponse = async (question: string): Promise<string> => {
    try {
      setError(null)

      // Use our internal API route instead of calling external API directly
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      })

      const data: APIResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (!data.answer) {
        throw new Error("Invalid response format from API")
      }

      return data.answer
    } catch (error: any) {
      console.error("API Error:", error)

      let errorMessage = "I'm having trouble connecting right now. "

      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Unable to reach the server. "
      } else if (error.message.includes("timeout")) {
        errorMessage = "The request timed out. "
      } else if (error.message.includes("network")) {
        errorMessage = "Network connection issue. "
      }

      setError(errorMessage + "Using offline mode for now.")

      // Enhanced fallback responses based on question content
      return getFallbackResponse(question)
    }
  }

  // Fallback response system
  const getFallbackResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("breathing") || lowerQuestion.includes("relaxation")) {
      return "Let's try a simple breathing exercise together. Take a slow, deep breath in through your nose for 4 counts... hold it for 4 counts... and slowly exhale through your mouth for 6 counts. Repeat this a few times and notice how your body begins to relax. Focus on the sensation of your breath moving in and out."
    }

    if (lowerQuestion.includes("journal") || lowerQuestion.includes("thoughts") || lowerQuestion.includes("feelings")) {
      return "Journaling is a powerful way to process emotions. Try writing about these prompts: What am I feeling right now? What triggered this feeling? What would I tell a friend in this situation? What's one thing I'm grateful for today? Remember, there's no right or wrong way to express your thoughts."
    }

    if (
      lowerQuestion.includes("affirmation") ||
      lowerQuestion.includes("confidence") ||
      lowerQuestion.includes("positive")
    ) {
      return "Here are some powerful affirmations for you: 'I am worthy of love and respect.' 'I have the strength to overcome challenges.' 'I am growing and learning every day.' 'I trust in my ability to handle whatever comes my way.' Choose one that resonates with you and repeat it with intention."
    }

    if (
      lowerQuestion.includes("reframe") ||
      lowerQuestion.includes("negative") ||
      lowerQuestion.includes("perspective")
    ) {
      return "Let's work on reframing those thoughts. Instead of 'I can't do this,' try 'I'm learning how to do this.' Instead of 'This is too hard,' try 'This is challenging, and that's how I grow.' Instead of 'I always mess up,' try 'I'm human and I'm improving.' What's one small step you can take right now?"
    }

    if (lowerQuestion.includes("stressed") || lowerQuestion.includes("anxiety") || lowerQuestion.includes("anxious")) {
      return "I understand you're feeling stressed. That's completely normal and valid. Try this grounding technique: Take three deep breaths, then name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This can help bring you back to the present moment."
    }

    if (lowerQuestion.includes("sad") || lowerQuestion.includes("down") || lowerQuestion.includes("depressed")) {
      return "I'm sorry you're feeling this way. Your emotions are completely valid, and it's okay to feel sad sometimes. Remember that feelings are temporary, even when they feel overwhelming. You don't have to carry this alone. What's one small thing that usually brings you a bit of comfort or peace?"
    }

    if (lowerQuestion.includes("happy") || lowerQuestion.includes("good") || lowerQuestion.includes("excited")) {
      return "I'm so glad to hear you're feeling positive! It's wonderful to recognize and celebrate these moments of joy. What's contributing to this good feeling? How can you carry this positive energy forward? Sometimes writing down what made you happy can help you recreate these moments."
    }

    if (lowerQuestion.includes("angry") || lowerQuestion.includes("frustrated") || lowerQuestion.includes("mad")) {
      return "I hear that you're feeling angry or frustrated. These are valid emotions that tell us something important. Take a moment to breathe deeply. What's underneath this anger? Sometimes anger masks hurt, fear, or disappointment. It's okay to feel this way, and you can work through it."
    }

    // Default fallback
    return "I'm here to listen and support you. While I'm having some technical difficulties connecting to my full capabilities right now, I want you to know that your feelings matter and you're not alone. Your emotional well-being is important. Can you tell me more about what's on your mind? Even in offline mode, I'm here to provide support and guidance."
  }

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    return newSession
  }

  const getCurrentSession = () => {
    return sessions.find((s) => s.id === currentSessionId)
  }

  const updateSessionTitle = (sessionId: string, firstMessage: string) => {
    const title = firstMessage.length > 30 ? firstMessage.substring(0, 30) + "..." : firstMessage
    setSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, title, updatedAt: new Date() } : session)),
    )
  }

  const handleSendMessage = async (activityPrompt?: string) => {
    const messageText = message.trim()
    const questionToSend = activityPrompt || messageText

    if (!questionToSend) return

    // Create session if none exists
    let session = getCurrentSession()
    if (!session) {
      session = createNewSession()
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: activityPrompt || messageText,
      sender: "user",
      timestamp: new Date(),
    }

    // Clear input immediately
    setMessage("")
    setIsLoading(true)

    // Update session with user message
    setSessions((prev) =>
      prev.map((s) =>
        s.id === session!.id
          ? {
              ...s,
              messages: [...s.messages, newUserMessage],
              updatedAt: new Date(),
            }
          : s,
      ),
    )

    // Update title if it's the first message
    if (session.messages.length === 0) {
      updateSessionTitle(session.id, questionToSend)
    }

    try {
      // Get AI response from our proxy API
      const aiResponseText = await getAIResponse(questionToSend)

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        sender: "ai",
        timestamp: new Date(),
      }

      setSessions((prev) =>
        prev.map((s) =>
          s.id === session!.id
            ? {
                ...s,
                messages: [...s.messages, aiResponse],
                updatedAt: new Date(),
              }
            : s,
        ),
      )
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      // Error is already handled in getAIResponse
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleActivityClick = (activity: ActivityCard) => {
    handleSendMessage(activity.prompt)
  }

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const retryLastMessage = () => {
    const currentSession = getCurrentSession()
    if (currentSession && currentSession.messages.length > 0) {
      const lastUserMessage = [...currentSession.messages].reverse().find((msg) => msg.sender === "user")
      if (lastUserMessage) {
        handleSendMessage(lastUserMessage.content)
      }
    }
  }

  const currentSession = getCurrentSession()
  const currentMessages = currentSession?.messages || []

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed z-50 w-80 h-full transition-transform duration-300 bg-white border-r border-green-100 flex flex-col shadow-lg`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Lumid</h1>
                <p className="text-xs text-green-600">Emotional AI</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)} className="p-1 h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={createNewSession}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-green-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No conversations yet</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    setCurrentSessionId(session.id)
                    if (isMobile) setIsSidebarOpen(false)
                  }}
                  className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentSessionId === session.id
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 shadow-sm"
                      : "hover:bg-green-50"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{session.title}</p>
                    <p className="text-xs text-gray-500">{session.updatedAt.toLocaleDateString()}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSession(session.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-green-100 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm text-gray-600 hover:text-gray-900 hover:bg-green-50"
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm text-gray-600 hover:text-gray-900 hover:bg-green-50"
          >
            <User className="w-4 h-4 mr-3" />
            Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-16 border-b border-green-100 bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-2 hover:bg-green-50">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h2 className="font-semibold text-gray-900">Lumid AI</h2>
                <p className="text-xs text-green-600">Emotional Support Assistant</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-green-100 to-emerald-100 text-green-700">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <p className="text-sm text-amber-700 flex-1">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={retryLastMessage}
              className="text-amber-700 hover:text-amber-800 text-xs px-2 py-1 h-auto"
            >
              Retry
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="p-1 h-6 w-6 text-amber-600 hover:text-amber-700"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {currentMessages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 overflow-y-auto">
              <div className="max-w-2xl w-full text-center">
                <div className="mb-8 lg:mb-12">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Heart className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                  </div>
                  <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      How can I help you today?
                    </span>
                  </h2>
                  <p className="text-base lg:text-lg text-gray-600 mb-8 lg:mb-12">
                    I'm here to provide emotional support and guidance. Share what's on your mind or choose an activity
                    below.
                  </p>
                </div>

                {/* Activity Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {activities.map((activity, index) => (
                    <Card
                      key={index}
                      onClick={() => handleActivityClick(activity)}
                      className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 group overflow-hidden"
                    >
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${activity.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          >
                            {activity.icon}
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900 text-base mb-1">{activity.title}</h3>
                            <p className="text-sm text-gray-600">{activity.subtitle}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 lg:p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom duration-300`}
                    >
                      <div
                        className={`flex gap-3 max-w-[85%] lg:max-w-2xl ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                          <AvatarFallback
                            className={
                              msg.sender === "user"
                                ? "bg-green-100 text-green-700"
                                : "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                            }
                          >
                            {msg.sender === "user" ? <User className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-2xl px-4 py-3 shadow-sm max-w-full ${
                            msg.sender === "user"
                              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                              : "bg-white border border-green-100 shadow-md"
                          }`}
                        >
                          <p
                            className={`text-sm leading-relaxed ${msg.sender === "user" ? "text-white" : "text-gray-800"}`}
                          >
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start animate-in slide-in-from-bottom duration-300">
                      <div className="flex gap-3 max-w-2xl">
                        <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                            <Heart className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white border border-green-100 rounded-2xl px-4 py-3 shadow-md">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                            <span className="text-sm text-gray-600">Lumid is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          )}

          {/* Message Input - Fixed at bottom */}
          <div className="border-t border-green-100 bg-white/90 backdrop-blur-sm p-4 lg:p-6 flex-shrink-0">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2 lg:gap-3 items-end">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Message Lumid..."
                    className="w-full rounded-2xl border-green-200 px-4 py-3 text-sm focus:border-green-400 focus:ring-green-400 bg-white shadow-sm resize-none min-h-[48px]"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={() => handleSendMessage()}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  disabled={!message.trim() || isLoading}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
