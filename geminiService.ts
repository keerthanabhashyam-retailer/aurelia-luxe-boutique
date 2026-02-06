import { GoogleGenAI } from "@google/genai";

export const enhanceDescription = async (name: string, category: string) => {
  // Access the API key provided via Vite's define or Vercel's env
  const apiKey = process.env.API_KEY;
  
  // Guard clause: If key is missing or is a placeholder string, don't initialize
  if (!apiKey || apiKey === "undefined" || apiKey === '""' || apiKey.trim() === "") {
    console.warn("Gemini API Key not found. Using fallback description.");
    return "A beautiful piece crafted with precision and elegance.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a 2-sentence luxury marketing description for a jewelry item named "${name}" in the category "${category}". Focus on craftsmanship.`,
    });

    return response.text || "A beautiful piece crafted with precision and elegance.";
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "A beautiful piece crafted with precision and elegance.";
  }
};