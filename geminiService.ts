import { GoogleGenAI } from "@google/genai";

export const enhanceDescription = async (name: string, category: string) => {
  // Use process.env.API_KEY which is injected by Vite at build time
  const apiKey = process.env.API_KEY;
  
  // Strict check for missing, empty, or placeholder key strings
  if (!apiKey || apiKey === 'undefined' || apiKey === '' || apiKey === '""') {
    console.warn("Gemini API Key is not configured. Falling back to default description.");
    return "A beautiful piece crafted with precision and elegance.";
  }

  try {
    // We only create the instance when the function is actually called
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a 2-sentence luxury marketing description for a jewelry item named "${name}" in the category "${category}".`,
    });
    return response.text || "A beautiful piece crafted with precision and elegance.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "A beautiful piece crafted with precision and elegance.";
  }
};