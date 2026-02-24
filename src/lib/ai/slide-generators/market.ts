import { generateSlideContent } from "../slide-generator";

export async function generateMarketSlide(title: string, context: string) {
    return generateSlideContent("market", title, context);
}
