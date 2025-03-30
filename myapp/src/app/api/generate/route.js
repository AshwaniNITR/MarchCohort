import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

const API_KEYS = [
  process.env.STABILITY_API_KEY_1,
  process.env.STABILITY_API_KEY_2,
  process.env.STABILITY_API_KEY_3,
  process.env.STABILITY_API_KEY_4,
  process.env.STABILITY_API_KEY_5,
  process.env.STABILITY_API_KEY_6,
  process.env.STABILITY_API_KEY_7,
  process.env.STABILITY_API_KEY_8,
  process.env.STABILITY_API_KEY_9,
  process.env.STABILITY_API_KEY_10,
  process.env.STABILITY_API_KEY_11,
];

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

    let apiKeyIndex = 0; // Start with the first API key

    while (apiKeyIndex < API_KEYS.length) {
      const apiKey = API_KEYS[apiKeyIndex];
      console.log(apiKeyIndex, "API Key Index:-", apiKey);

      try {
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("output_format", "webp");

        const response = await axios.post(
          "https://api.stability.ai/v2beta/stable-image/generate/ultra",
          formData,
          {
            responseType: "arraybuffer",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              Accept: "image/*",
            },
          }
        );

        if (response.status === 200) {
          return new Response(response.data, {
            status: 200,
            headers: { "Content-Type": "image/webp" },
          });
        }
      } catch (error) {
        const status = error.response?.status;
        console.error(`API key at index ${apiKeyIndex} failed with status: ${status}. Error:`, error.message);
        // Increase API key index and try the next one
        apiKeyIndex++;
        continue;
      }

      // If we reach here, increase API key index
      apiKeyIndex++;
    }

    return NextResponse.json({ error: "All API keys failed" }, { status: 500 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Final error: ", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}