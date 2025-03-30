import { NextResponse } from 'next/server';

const RATE_LIMIT = 10; // Max requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute in milliseconds
const requestCounts = new Map<string, { count: number; startTime: number }>();

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json({ error: "Invalid prompt provided." }, { status: 400 });
        }

        // Get IP address
        const ip = req.headers.get("x-forwarded-for") || "unknown";

        // Enforce rate limiting
        const now = Date.now();
        if (!requestCounts.has(ip)) {
            requestCounts.set(ip, { count: 1, startTime: now });
        } else {
            const requestData = requestCounts.get(ip)!;
            if (now - requestData.startTime < WINDOW_MS) {
                if (requestData.count >= RATE_LIMIT) {
                    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
                }
                requestData.count++;
            } else {
                requestCounts.set(ip, { count: 1, startTime: now });
            }
        }

        // Make the API request with user's prompt
        const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${process.env.AIMLAPI_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "ai21/jamba-1-5-mini",
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 100,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful AI assistant."
                    },
                    {
                        "role": "user",
                        "content": prompt // 👈 User's dynamic input
                    }
                ]
            })
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
