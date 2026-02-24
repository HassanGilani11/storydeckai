import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { SlideType } from "@/types";
import { BASE_SLIDE_SYSTEM_PROMPT, getSlidePrompt } from "./prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const slideSchema = {
    type: SchemaType.OBJECT,
    properties: {
        title: { type: SchemaType.STRING },
        subtitle: { type: SchemaType.STRING },
        layout: {
            type: SchemaType.STRING,
            enum: ["standard", "centered-title", "metrics-grid", "split-hero", "timeline", "comparison", "quote", "cta"]
        },
        content: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
        },
        footer: { type: SchemaType.STRING }
    },
    required: ["title", "content", "layout"]
};

export async function generateSlideContent(type: SlideType, title: string, context: string) {
    const modelsToTry = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.5-pro-latest", "gemini-1.5-flash-latest"];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error("Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.");
            }

            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: slideSchema as any,
                },
            });

            const prompt = getSlidePrompt(type, title, context);

            const result = await model.generateContent([
                { text: BASE_SLIDE_SYSTEM_PROMPT },
                { text: prompt }
            ]);

            const response = await result.response;
            const text = response.text();

            if (!text) {
                throw new Error(`AI failed to generate content for slide: ${title}`);
            }

            return JSON.parse(text);
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

    console.error("Gemini Slide Generation Error Final:", lastError);
    throw new Error(`Slide generation failed: ${lastError.message || "Unknown error"}`);
}
