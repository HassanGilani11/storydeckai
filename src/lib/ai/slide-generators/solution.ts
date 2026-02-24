import { generateSlideContent } from "../slide-generator";

export async function generateSolutionSlide(title: string, context: string) {
    return generateSlideContent("solution", title, context);
}
