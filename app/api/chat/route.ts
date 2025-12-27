import { NextRequest, NextResponse } from "next/server";

// FastAPI backend URL - you can change this to your backend URL
const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to FastAPI
    const response = await fetch(`${FASTAPI_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`FastAPI returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        response: "⚠️ Unable to connect to AI backend. Please make sure the FastAPI server is running on port 8000.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
