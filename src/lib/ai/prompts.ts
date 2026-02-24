import { SlideType } from "@/types";

export const BASE_SLIDE_SYSTEM_PROMPT = `
You are a senior business analyst and presentation designer. 
Your task is to generate high-impact, concise, and investor-ready content for a specific slide in a startup pitch deck.
Output MUST be in strict JSON format.
Keep bullet points punchy (max 6-8 words per bullet).

LAYOUT SELECTION RULES:
1. "standard": Balanced text and bullets. Use for most content.
2. "centered-title": Use for opening title or high-impact transition slides.
3. "metrics-grid": Use for traction, financials, or market size. Bullets MUST be "Value: Label".
4. "split-hero": Use for product shots, visions, or high-visual impact slides.
5. "timeline": Use for roadmaps, history, or steps. Bullets should represent chronological phases.
6. "comparison": Use for "Problem vs Solution" or "Competitor vs Us". Exactly 2 or 4 bullets recommended.
7. "quote": Use for testimonials, vision statements, or board quotes.
8. "cta": Use for the final "Ask" or contact slides. Focus on a clear directive.
`;

export function getSlidePrompt(type: SlideType, title: string, context: string) {
    const prompts: Record<SlideType, string> = {
        title: `Generate content for a Title slide named "${title}". Use layout: "centered-title". Generate a compelling subtitle and 2-3 value prop bullets. Context: ${context}`,
        problem: `Expand on the problem: "${title}". Use layout: "standard" or "comparison" if comparing to traditional methods. Context: ${context}`,
        solution: `Detail the solution: "${title}". Use layout: "split-hero" or "comparison" if visually impactful. Context: ${context}`,
        market: `Focus on market opportunity: "${title}". Use layout: "metrics-grid" if providing specific sizes or "standard". Context: ${context}`,
        traction: `Highlight traction: "${title}". Use layout: "metrics-grid" for key stats. Context: ${context}`,
        "business-model": `Explain strategy: "${title}". Use layout: "standard". Context: ${context}`,
        roadmap: `Future vision: "${title}". Use layout: "timeline" to show phases. Context: ${context}`,
        financials: `Key financials: "${title}". Use layout: "metrics-grid" for numbers. Context: ${context}`,
        team: `Team slide: "${title}". Use layout: "standard" or "quote" for a vision statement. Context: ${context}`,
        ask: `The closing ask: "${title}". Use layout: "cta" to drive action. Include contact info or next step in footer. Context: ${context}`,
    };

    return prompts[type] || `Generate 3-4 compelling points for a ${type} slide titled "${title}". Context: ${context}`;
}

export function getSlideSchema(type: SlideType) {
    return {
        title: "string",
        content: "string[]",
        footer: "string (optional/shorthand tagline)"
    };
}
