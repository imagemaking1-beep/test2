
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateQuizzesByTheme(themeName: string): Promise<QuizQuestion[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 10 movie emoji quiz questions for the theme: "${themeName}". 
                 The quiz is for Korean speakers, so the "answer" should be the Korean movie title.
                 Include "aliases" (other ways people call the movie, English title, or common abbreviations).
                 Provide a "hint" in Korean that doesn't reveal the answer too easily.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              emojis: { type: Type.STRING, description: "3-4 emojis representing the movie" },
              answer: { type: Type.STRING, description: "Official Korean movie title" },
              aliases: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "English title or common shorthand"
              },
              hint: { type: Type.STRING, description: "A helpful hint in Korean" }
            },
            required: ["emojis", "answer", "aliases", "hint"]
          }
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quizzes:", error);
    throw error;
  }
}

export async function getAIEvaluation(userInput: string, correctAnswer: string): Promise<string> {
  // Optional feature to explain why an answer was close or funny
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user guessed "${userInput}" for the movie "${correctAnswer}". 
                 If they were wrong, give a funny or witty comment in Korean (under 20 words).
                 If they were right, give a cool compliment in Korean.`,
    });
    return response.text.trim();
  } catch {
    return "";
  }
}
