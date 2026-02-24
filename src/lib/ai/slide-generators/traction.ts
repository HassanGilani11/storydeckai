import { generateSlideContent } from "../slide-generator";

export async function generateTractionSlide(title: string, context: string) {
    return generateSlideContent("traction", title, context);
}
