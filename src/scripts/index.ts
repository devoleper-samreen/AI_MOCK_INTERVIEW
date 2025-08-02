import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function askGemini(prompt: string) {
  try {
    const result = await genAI.models.generateContent({
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
