import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { OutlineJSON } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const OUTLINE_SYSTEM_PROMPT = `
You are a principal startup pitch deck strategist. 
Your goal is to transform business raw data into a structured 10-12 slide pitch deck outline.

STRICT RULES:
1. Output MUST be in valid JSON.
2. Tone: Professional, concise, investor-ready.
3. Use strategic frameworks (e.g., Sequoia Pitch Deck format).
4. No fluff or generic bullet points.
`;

// Define the schema for the output based on existing types
const schema = {
  type: SchemaType.OBJECT,
  properties: {
    slides: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          bullets: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          }
        },
        required: ["type", "title"]
      }
    }
  },
  required: ["slides"]
};

export async function generateDeckOutline(projectTitle: string, projectData: Record<string, string>): Promise<OutlineJSON> {
  const modelsToTry = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.5-pro-latest", "gemini-1.5-flash-latest"];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Generating deck outline using ${modelName} for:`, projectTitle);

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        throw new Error("Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.");
      }

      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema as any,
        },
      });

      const userPrompt = `
      Project Title: ${projectTitle}
      Business Data:
      - Problem: ${projectData.problem}
      - Solution: ${projectData.solution}
      - Market: ${projectData.market}
      - Ask: ${projectData.ask}
      ${projectData.promptContext ? `\n      TEMPLATE INSTRUCTION:\n      ${projectData.promptContext}` : ""}
    `;

      const result = await model.generateContent([
        { text: OUTLINE_SYSTEM_PROMPT },
        { text: userPrompt }
      ]);

      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("AI failed to generate content");
      }

      console.log(`${modelName} generated outline successfully`);
      return JSON.parse(text) as OutlineJSON;
    } catch (error: any) {
      lastError = error;
      console.warn(`Attempt with ${modelName} failed:`, error.message);

      const isFatal = error.message?.includes("API key not valid") || error.message?.includes("not authorized");

      if (!isFatal && modelName !== modelsToTry[modelsToTry.length - 1]) {
        console.warn(`Falling back from ${modelName} to next model...`);
        continue;
      }
      break;
    }
  }

  // Handle errors after all retries
  console.error("Gemini API Error Final:", lastError);

  if (lastError.message?.includes("API key not valid")) {
    throw new Error("Invalid Gemini API Key. Please check your AI configuration in AI Studio.");
  }

  if (lastError.message?.includes("quota") || lastError.message?.includes("429")) {
    throw new Error("Gemini API quota exceeded across all models. Please wait or check your Google AI Studio limits.");
  }

  throw new Error(`AI Generation failed: ${lastError.message || "Unknown error"}`);
}
