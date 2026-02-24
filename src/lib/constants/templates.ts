import { Rocket, Presentation, FileText, Layout } from "lucide-react";

export interface TemplateBlueprintSlide {
    type: string;
    title: string;
    bullets: string[];
}

export interface Template {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: any;
    color: string;
    slideCount: number;
}

export const TEMPLATES: Template[] = [
    {
        id: "startup-pitch",
        title: "The Unicorn Pitch",
        description: "Standard 12-slide investor deck optimized for Series A funding rounds.",
        category: "pitch-decks",
        icon: Rocket,
        color: "indigo",
        slideCount: 12
    },
    {
        id: "sales-closing",
        title: "Enterprise Sales",
        description: "Solution-focused deck designed to close complex high-ticket deals.",
        category: "sales",
        icon: Presentation,
        color: "purple",
        slideCount: 8
    },
    {
        id: "board-report",
        title: "Strategic Quarterly",
        description: "Data-heavy layout for executive summaries and KPI reporting.",
        category: "reports",
        icon: FileText,
        color: "emerald",
        slideCount: 6
    },
    {
        id: "product-launch",
        title: "Visionary Launch",
        description: "High-impact visual storytelling for new product unveils and announcements.",
        category: "marketing",
        icon: Layout,
        color: "rose",
        slideCount: 6
    },
    {
        id: "minimal-modern",
        title: "Zen Minimalist",
        description: "Ultra-clean design that puts your content front and center.",
        category: "all",
        icon: Rocket,
        color: "slate",
        slideCount: 5
    }
];

export const TEMPLATE_BLUEPRINTS: Record<string, TemplateBlueprintSlide[]> = {
    "startup-pitch": [
        { type: "title", title: "Title & Vision", bullets: ["Company name", "One-sentence vision statement"] },
        { type: "problem", title: "The Problem", bullets: ["Pain points being solved", "The scale of the issue"] },
        { type: "market", title: "Target Market", bullets: ["TAM/SAM/SOM", "Target demographics"] },
        { type: "solution", title: "The Solution", bullets: ["How it works", "Value proposition"] },
        { type: "market", title: "Why Now?", bullets: ["Market trends", "Consumer shift"] },
        { type: "solution", title: "Competitive Advantage", bullets: ["Moat/IP", "Unique selling point"] },
        { type: "solution", title: "Product Demo", bullets: ["Key features", "User experience"] },
        { type: "solution", title: "Business Model", bullets: ["Revenue streams", "Pricing strategy"] },
        { type: "solution", title: "Sales & Marketing", bullets: ["GTM strategy", "Acquisition channels"] },
        { type: "team", title: "The Team", bullets: ["Founder backgrounds", "Key expertise"] },
        { type: "market", title: "Financials", bullets: ["Revenue roadmap", "Key metrics"] },
        { type: "ask", title: "The Ask", bullets: ["Funding needed", "Strategic allocation"] }
    ],
    "sales-closing": [
        { type: "title", title: "Value Proposition", bullets: ["Core promise", "Immediate benefit"] },
        { type: "problem", title: "Customer Pain Points", bullets: ["Specific issues observed", "Current inefficiencies"] },
        { type: "solution", title: "Demonstration", bullets: ["Live use case", "Result preview"] },
        { type: "solution", title: "Case Studies", bullets: ["Success stories", "Client testimonials"] },
        { type: "market", title: "Pricing & ROI", bullets: ["Investment required", "Expected return"] },
        { type: "solution", title: "Implementation Plan", bullets: ["Onboarding steps", "Timeline"] },
        { type: "solution", title: "Strategic Fit", bullets: ["Integration", "Long-term partnership"] },
        { type: "ask", title: "Next Steps", bullets: ["Closing commitment", "Action items"] }
    ],
    "board-report": [
        { type: "title", title: "Executive Summary", bullets: ["Quarterly highlights", "Overall performance"] },
        { type: "market", title: "KPI Dashboard", bullets: ["Revenue vs Target", "Customer growth"] },
        { type: "market", title: "Revenue & P&L", bullets: ["Expense breakdown", "Cash runway"] },
        { type: "solution", title: "Strategic Initiatives", bullets: ["Project status", "Major wins"] },
        { type: "problem", title: "Operational Risks", bullets: ["Hiring needs", "Market threats"] },
        { type: "ask", title: "Board Actions Required", bullets: ["Approvals needed", "Critical discussions"] }
    ],
    "product-launch": [
        { type: "title", title: "Campaign Concept", bullets: ["The Big Idea", "Theme"] },
        { type: "solution", title: "Visual Direction", bullets: ["Key assets", "Tone of voice"] },
        { type: "market", title: "Channel Strategy", bullets: ["Social media", "Email/Ads"] },
        { type: "market", title: "Target Personas", bullets: ["Focus groups", "Messaging per group"] },
        { type: "market", title: "Launch Timeline", bullets: ["Pre-launch", "Go-live"] },
        { type: "ask", title: "Success Metrics", bullets: ["Conversion goals", "Reach target"] }
    ],
    "minimal-modern": [
        { type: "title", title: "Core Narrative", bullets: ["The main story", "One key takeaway"] },
        { type: "market", title: "Key Figures", bullets: ["Data point 1", "Data point 2"] },
        { type: "solution", title: "Impact Summary", bullets: ["What's changed", "Value added"] },
        { type: "solution", title: "Future Outlook", bullets: ["Roadmap", "Next horizon"] },
        { type: "ask", title: "The Call to Action", bullets: ["Closing request", "Contact info"] }
    ]
};
