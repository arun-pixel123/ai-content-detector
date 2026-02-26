import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalysisResult {
  aiScore: number; // 0 to 100
  humanScore: number; // 0 to 100
  readability: string;
  tone: string;
  keyFindings: string[];
  suggestions: {
    title: string;
    description: string;
  }[];
  detailedMetrics: {
    label: string;
    value: number; // 0 to 100
  }[];
}

export async function analyzeContent(text: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following text for AI-generated patterns and content quality. Provide a detailed breakdown of its characteristics.
    
    Text to analyze:
    "${text}"`,
    config: {
      systemInstruction: "You are an expert content analyst and AI detection specialist. Your goal is to evaluate text for its likelihood of being AI-generated versus human-written, and provide constructive feedback on its quality, tone, and readability. Be objective and precise.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          aiScore: { type: Type.NUMBER, description: "Likelihood percentage that the text is AI-generated (0-100)" },
          humanScore: { type: Type.NUMBER, description: "Likelihood percentage that the text is human-written (0-100)" },
          readability: { type: Type.STRING, description: "Readability level (e.g., Easy, Moderate, Academic)" },
          tone: { type: Type.STRING, description: "The perceived tone of the writing" },
          keyFindings: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "3-4 key observations about the text structure and patterns"
          },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            },
            description: "Actionable suggestions to improve the content or make it more human-like"
          },
          detailedMetrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: "Metric name (e.g., Perplexity, Burstiness, Emotional Depth)" },
                value: { type: Type.NUMBER, description: "Score from 0-100" }
              }
            }
          }
        },
        required: ["aiScore", "humanScore", "readability", "tone", "keyFindings", "suggestions", "detailedMetrics"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Failed to analyze content. Please try again.");
  }
}
