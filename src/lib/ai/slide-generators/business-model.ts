import { generateSlideContent } from "../slide-generator";

export async function generateBusinessModelSlide(title: string, context: string) {
    return generateSlideContent("business-model", title, context);
}
