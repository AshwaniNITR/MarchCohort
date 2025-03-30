// import { NextResponse } from "next/server";
// import axios from "axios";
// import FormData from "form-data";

// let callCount = 8;
// const API_KEYS = [
//   process.env.STABILITY_API_KEY_1,
//   process.env.STABILITY_API_KEY_2,
//   process.env.STABILITY_API_KEY_3,
//   process.env.STABILITY_API_KEY_4,
//   process.env.STABILITY_API_KEY_5,
//   process.env.STABILITY_API_KEY_6,
//   process.env.STABILITY_API_KEY_7,
//   process.env.STABILITY_API_KEY_8,
// ];

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();

//     if (!prompt) {
//       return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
//     }

//     // Rotate API keys every 3 calls
//     const apiKeyIndex = Math.floor(callCount / 3) % API_KEYS.length;
//     const apiKey = API_KEYS[apiKeyIndex];
//     callCount++;
//     console.log("Current Call Count:-",callCount);
//     console.log("Current API KEY:-",apiKey);
//     const payload = {
//       prompt,
//       output_format: "webp",
//     };

//     const formData = new FormData();
//     for (const key in payload) {
//       formData.append(key, (payload as any)[key]);
//     }

//     const response = await axios.post(
//       "https://api.stability.ai/v2beta/stable-image/generate/ultra",
//       formData,
//       {
//         responseType: "arraybuffer",
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           Accept: "image/*",
//         },
//       }
//     );

//     if (response.status === 200) {
//       return new Response(response.data, {
//         status: 200,
//         headers: { "Content-Type": "image/webp" },
//       });
//     } else {
//       return NextResponse.json({ error: response.data.toString() }, { status: response.status });
//     }
//   } catch (error: any) {
//     console.log("Current Call Count:-",callCount);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


// import { NextResponse } from "next/server";
// import axios from "axios";
// import FormData from "form-data";
// import mongoose from "mongoose";
// import CallCount from "@/models/CallCount"; // Import the model
// import connectMongo from "@/dbConnect/dbConnect";

// let API_KEYS = [
//   process.env.STABILITY_API_KEY_1,
//   process.env.STABILITY_API_KEY_2,
//   process.env.STABILITY_API_KEY_3,
//   process.env.STABILITY_API_KEY_4,
//   process.env.STABILITY_API_KEY_5,
//   process.env.STABILITY_API_KEY_6,
//   process.env.STABILITY_API_KEY_7,
//   process.env.STABILITY_API_KEY_8,
// ];

// async function getCallCount() {
//   await mongoose.connect(process.env.MONGODB_URI!);
//   let countDoc = await CallCount.findOne();
//   if (!countDoc) {
//     countDoc = await CallCount.create({ count: 14 });
//   }
//   return countDoc;
// }
// connectMongo();
// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();
//     if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

//     const countDoc = await getCallCount();
//     const callCount = countDoc.count;
//     const apiKeyIndex = Math.floor(callCount / 3) % API_KEYS.length;
//     const apiKey = API_KEYS[apiKeyIndex];

//     const payload = { prompt, output_format: "webp" };
//     const formData = new FormData();
//     for (const key in payload) {
//       formData.append(key, (payload as any)[key]);
//     }

//     const response = await axios.post(
//       "https://api.stability.ai/v2beta/stable-image/generate/ultra",
//       formData,
//       { responseType: "arraybuffer", headers: { Authorization: `Bearer ${apiKey}`, Accept: "image/*" } }
//     );

//     if (response.status === 200) {
//       await CallCount.updateOne({}, { $inc: { count: 1 } }); // Increment count in DB
//       return new Response(response.data, { status: 200, headers: { "Content-Type": "image/webp" } });
//     } else {
//       return NextResponse.json({ error: response.data.toString() }, { status: response.status });
//     }
//   } catch (error: unknown) {
//     let errorMessage = "An unknown error occurred";
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     } else if (typeof error === "string") {
//       errorMessage = error;
//     }

//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
// import axios from "axios";
// import FormData from "form-data";
// import mongoose from "mongoose";
// import CallCount from "@/models/CallCount";
// import connectMongo from "@/dbConnect/dbConnect";

// const API_KEYS = [
//   process.env.STABILITY_API_KEY_1,
//   process.env.STABILITY_API_KEY_2,
//   process.env.STABILITY_API_KEY_3,
//   process.env.STABILITY_API_KEY_4,
//   process.env.STABILITY_API_KEY_5,
//   process.env.STABILITY_API_KEY_6,
//   process.env.STABILITY_API_KEY_7,
//   process.env.STABILITY_API_KEY_8,
// ];

// async function getCallCount() {
//   await mongoose.connect(process.env.MONGODB_URI!);
//   let countDoc = await CallCount.findOne();
//   if (!countDoc) {
//     countDoc = await CallCount.create({ count: 0 });
//   }
//   return countDoc;
// }

// connectMongo();

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();
//     if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

//     const countDoc = await getCallCount();
//     let apiKeyIndex = countDoc.count % API_KEYS.length;

//     let response;
//     let success = false;
//     let attempts = 0;

//     while (attempts < API_KEYS.length) {
//       const apiKey = API_KEYS[apiKeyIndex];
      
//       try {
//         const payload = { prompt, output_format: "webp" };
//         const formData = new FormData();
//         for (const key in payload) {
//           formData.append(key, (payload as any)[key]);
//         }

//         response = await axios.post(
//           "https://api.stability.ai/v2beta/stable-image/generate/ultra",
//           formData,
//           { responseType: "arraybuffer", headers: { Authorization: `Bearer ${apiKey}`, Accept: "image/*" } }
//         );

//         if (response.status === 200) {
//           success = true;
//           break;
//         }
//       } catch (error: any) {
//         if (error.response && error.response.status === 500) {
//           apiKeyIndex = (apiKeyIndex + 1) % API_KEYS.length;
//         } else {
//           return NextResponse.json({ error: error.message }, { status: 500 });
//         }
//       }

//       attempts++;
//     }

//     if (success) {
//       await CallCount.updateOne({}, { count: apiKeyIndex });
//       return new Response(response!.data, { status: 200, headers: { "Content-Type": "image/webp" } });
//     } else {
//       return NextResponse.json({ error: "All API keys failed" }, { status: 500 });
//     }
//   } catch (error: unknown) {
//     let errorMessage = "An unknown error occurred";
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     } else if (typeof error === "string") {
//       errorMessage = error;
//     }

//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }
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

export async function POST(req: Request) {
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
      } catch (error: string | any) {
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Final error: ", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}




