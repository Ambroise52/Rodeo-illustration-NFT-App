import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini Client
let ai: GoogleGenAI | null = null;

const getClient = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API Key not found in environment variables");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const initializeGemini = () => {
  // Pre-initialization if needed
  try {
    getClient();
  } catch (e) {
    console.error("Failed to initialize Gemini client:", e);
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const client = getClient();
  
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Construct data URL
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};

// Placeholder for future image analysis functionality
export const analyzeImageForVideoPrompt = async (imagePrompt: string): Promise<string> => {
    // This will eventually use Gemini to generate a perfect video prompt
    // For V1, we return a deterministic template based on the image prompt
    return `Animate the following scene in a seamless loop: ${imagePrompt}. Ensure smooth motion, high frame rate, and maintain the exact visual style.`;
};