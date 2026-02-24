export type PlanType = "free" | "pro" | "business";

export interface User {
    id: string;
    email: string;
    plan_type: PlanType;
    created_at: string;
}

export type ProjectType = "startup_pitch" | "business_presentation";

export interface Project {
    id: string;
    user_id: string;
    title: string;
    type: ProjectType;
    is_archived: boolean;
    created_at: string;
}

export interface DeckOutline {
    id: string;
    project_id: string;
    structured_json: OutlineJSON;
    approved: boolean;
}

export interface OutlineJSON {
    slides: {
        type: SlideType;
        title: string;
        bullets?: string[];
        imageUrl?: string;
        icon?: string;
        ctaLink?: string;
    }[];
}

export type SlideType =
    | "title"
    | "problem"
    | "solution"
    | "market"
    | "traction"
    | "business-model"
    | "roadmap"
    | "financials"
    | "team"
    | "ask";

export interface Slide {
    id: string;
    project_id: string;
    slide_type: SlideType;
    slide_order: number;
    content_json: any; // specific to slide type
    template: string;
}

export interface BrandKit {
    id: string;
    user_id: string;
    primary_color: string;
    secondary_color: string;
    font_family: string;
    logo_url?: string;
}
