import { generateSlideContent } from "../slide-generator";

export async function generateFinancialsSlide(title: string, context: string) {
    return generateSlideContent("financials", title, context);
}
