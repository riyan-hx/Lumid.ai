import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question } = body

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question is required and must be a string" }, { status: 400 })
    }

    // Make the API call from the server side to avoid CORS issues
    const response = await fetch("https://t3st1.onrender.com/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        question: question.trim(),
      }),
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.answer) {
      throw new Error("Invalid response format from API")
    }

    return NextResponse.json({ answer: data.answer })
  } catch (error: any) {
    console.error("API Proxy Error:", error)

    // Return a structured error response
    return NextResponse.json(
      {
        error: "Failed to get response from AI service",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
