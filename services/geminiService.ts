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

export const generateVideo = async (imageUrl: string, prompt: string): Promise<Blob> => {
  // 1. API Key Selection Logic for Veo
  const win = window as any;
  if (win.aistudio) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await win.aistudio.openSelectKey();
    }
  }

  // 2. Fetch Image & Convert to Base64 (from public URL)
  const imageResp = await fetch(imageUrl);
  const imageBlob = await imageResp.blob();
  
  const base64String = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const res = reader.result as string;
        if (res) resolve(res.split(',')[1]);
        else reject(new Error("Failed to convert image"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageBlob);
  });

  // 3. Create fresh client instance with potentially new key
  const client = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 4. Generate Video
  let operation = await client.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: base64String,
      mimeType: imageBlob.type || 'image/png',
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9' // Safe default for Veo
    }
  });

  // 5. Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await client.operations.getVideosOperation({operation: operation});
  }

  if (operation.error) {
      throw new Error(operation.error.message || "Video generation failed");
  }

  // 6. Download Result
  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("No video URI returned from API");

  // Fetch the actual video bytes using the API Key
  const videoResp = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  if (!videoResp.ok) throw new Error("Failed to download generated video");
  
  return await videoResp.blob();
};