import { create } from "zustand";
import { Slide } from "@/types";

interface EditorState {
    slides: Slide[];
    activeSlideId: string | null;
    isSaving: boolean;
    brandKit: any | null;
    setSlides: (slides: Slide[]) => void;
    setBrandKit: (brandKit: any | null) => void;
    setActiveSlideId: (id: string | null) => void;
    updateActiveSlideContent: (content: any) => void;
    reorderSlides: (startIndex: number, endIndex: number) => void;
    addSlide: (projectId: string) => void;
    removeSlide: (id: string) => void;
    setIsSaving: (isSaving: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    slides: [],
    activeSlideId: null,
    isSaving: false,
    brandKit: null,
    setSlides: (slides) => set({ slides }),
    setBrandKit: (brandKit) => set({ brandKit }),
    setActiveSlideId: (id) => set({ activeSlideId: id }),
    updateActiveSlideContent: (content) =>
        set((state) => ({
            slides: state.slides.map((s) =>
                s.id === state.activeSlideId ? { ...s, content_json: content } : s
            ),
        })),
    reorderSlides: (startIndex: number, endIndex: number) =>
        set((state) => {
            const nextSlides = [...state.slides];
            const [removed] = nextSlides.splice(startIndex, 1);
            nextSlides.splice(endIndex, 0, removed);
            return { slides: nextSlides.map((s, i) => ({ ...s, slide_order: i })) };
        }),
    addSlide: (projectId: string) =>
        set((state) => {
            const newSlide: Slide = {
                id: crypto.randomUUID(),
                project_id: projectId,
                slide_type: "solution",
                slide_order: state.slides.length,
                content_json: { title: "New Slide", bullets: [] },
                template: "standard",
            };
            return {
                slides: [...state.slides, newSlide],
                activeSlideId: newSlide.id
            };
        }),
    removeSlide: (id: string) =>
        set((state) => {
            const nextSlides = state.slides.filter((s) => s.id !== id);
            let nextActiveId = state.activeSlideId;
            if (state.activeSlideId === id) {
                nextActiveId = nextSlides.length > 0 ? nextSlides[0].id : null;
            }
            return {
                slides: nextSlides.map((s, i) => ({ ...s, slide_order: i })),
                activeSlideId: nextActiveId
            };
        }),
    setIsSaving: (isSaving) => set({ isSaving }),
}));
