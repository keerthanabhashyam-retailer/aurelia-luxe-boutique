
import { GoogleGenAI } from "@google/genai";

// Always use the named parameter for API key and obtain it directly from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceDescription = async (name: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a 2-sentence luxury marketing description for a jewelry item named "${name}" in the category "${category}".`,
    });
    // response.text is a property, not a method. Ensure a fallback value is provided.
    return response.text || "A beautiful piece crafted with precision and elegance.";
  } catch (error) {
    return "A beautiful piece crafted with precision and elegance.";
  }
};
