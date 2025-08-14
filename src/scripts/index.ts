import { GoogleGenAI } from "@google/genai";


let genAI: GoogleGenAI | null = null;

export function getGenAI() {
  if (!genAI) {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error("Gemini API key is missing!");
    }
    genAI = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    });
  }
  return genAI;
}

export async function askGemini(prompt: string) {
  try {
    const instance = getGenAI();
    const result = await instance.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! Something went wrong.";
  }
}
