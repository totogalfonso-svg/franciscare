import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHealthResponse = async (userQuery: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: "You are Francis, a helpful, empathetic, and professional health assistant for St. Francis College Guihulngan (SFCG). Your goal is to provide general wellness advice, explain medical terms simply, and guide users to book appointments at the school clinic for serious issues. Do not provide definitive medical diagnoses or prescribe medication. Always maintain a caring tone suitable for students and faculty.",
        temperature: 0.7,
      }
    });
    
    return response.text || "I apologize, but I couldn't generate a response at this time. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the wellness server. Please try again later.";
  }
};

export const generateDailyHealthTip = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a short, single-sentence, inspiring health or wellness tip for college students.",
      config: {
        temperature: 0.9,
      }
    });
    return response.text || "Drink plenty of water today!";
  } catch (error) {
    return "Take a deep breath and stretch every hour.";
  }
};