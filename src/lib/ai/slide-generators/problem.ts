import { generateSlideContent } from "../slide-generator";

export async function generateProblemSlide(title: string, context: string) {
    const customPrompt = `Focus specifically on the acute pain points described in: ${title}. ${context}`;
    return generateSlideContent("problem", title, customPrompt);
}
