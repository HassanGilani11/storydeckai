import { generateSlideContent } from "../slide-generator";

export async function generateRoadmapSlide(title: string, context: string) {
    return generateSlideContent("roadmap", title, context);
}
