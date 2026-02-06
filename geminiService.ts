import { GoogleGenAI } from "@google/genai";

export const enhanceDescription = async (name: string, category: string) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    console.warn("Gemini API Key is missing. Using fallback description.");
    return "A beautiful piece crafted with precision and elegance.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a 2-sentence luxury marketing description for a jewelry item named "${name}" in the category "${category}".`,
    });
    return response.text || "A beautiful piece crafted with precision and elegance.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "A beautiful piece crafted with precision and elegance.";
  }
};