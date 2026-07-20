import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper function to call Gemini with retry and fallback models
async function generateWithFallback(
  aiInstance: GoogleGenAI,
  contents: any,
  config: any
) {
  // Ordered candidate models
  const models = [
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite"
  ];

  let lastError: any = null;

  for (const model of models) {
    const maxRetries = 3;
    let attempt = 0;
    let delay = 500;

    while (attempt < maxRetries) {
      try {
        console.log(`[Gemini API] Attempting generateContent with model: ${model} (attempt ${attempt + 1}/${maxRetries})`);
        const response = await aiInstance.models.generateContent({
          model,
          contents,
          config,
        });
        console.log(`[Gemini API] Success with model: ${model}`);
        return response;
      } catch (error: any) {
        lastError = error;
        console.error(`[Gemini API] Error with model ${model} on attempt ${attempt + 1}:`, error);

        // Check if error is transient (503 Service Unavailable, 429 Too Many Requests, or high demand messages)
        const errorStatus = error.status || (error.error && error.error.code) || 0;
        const errorMessage = (error.message || "").toLowerCase() || JSON.stringify(error).toLowerCase();
        
        const isTransient =
          errorStatus === 503 ||
          errorStatus === 429 ||
          errorMessage.includes("503") ||
          errorMessage.includes("429") ||
          errorMessage.includes("demand") ||
          errorMessage.includes("temporary") ||
          errorMessage.includes("unavailable");

        if (isTransient && attempt < maxRetries - 1) {
          attempt++;
          console.log(`[Gemini API] Transient error detected. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
        } else {
          // Break retry loop to proceed to the next fallback model
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content with all available models.");
}

// Secure API endpoint for Gemini Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, systemInstruction } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not configured. Please add it in the Secrets panel." 
      });
    }

    const response = await generateWithFallback(
      ai,
      message,
      {
        systemInstruction: systemInstruction || "You are ROBANI AI, the elite Second Brain intelligence. Provide concise, premium, highly intellectual advice on finance, history, geopolitics, and knowledge management. Format beautifully using markdown.",
        temperature: 0.7,
      }
    );

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error after fallback/retries:", error);
    
    let userFriendlyMsg = error.message || "An error occurred with Gemini AI service";
    if (userFriendlyMsg.includes("503") || userFriendlyMsg.toLowerCase().includes("demand") || userFriendlyMsg.toLowerCase().includes("unavailable")) {
      userFriendlyMsg = "The Gemini model is currently experiencing extremely high demand. We attempted multiple retry configurations, but the upstream servers are still busy. Please wait a few seconds and try sending your request again.";
    }

    res.status(500).json({ error: userFriendlyMsg });
  }
});

// Setup Vite Development Server or Serve Production Static Files
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ROBANI Second Brain Server running on http://localhost:${PORT}`);
  });
}

setupServer();
