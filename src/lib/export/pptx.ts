import { Slide as SlideData } from "@/types";

export async function generatePptx(title: string, slides: SlideData[]) {
    // Dynamic import to avoid SSR issues with pptxgenjs
    const pptxgen = (await import("pptxgenjs")).default;
    const pptx = new pptxgen();

    pptx.layout = "LAYOUT_16x9";
    pptx.defineLayout({ name: "STORYDECK", width: 13.33, height: 7.5 });

    slides.forEach((slideData) => {
        const slide = pptx.addSlide();
        const content = slideData.content_json || { title: "", bullets: [] };

        // Slide Title
        slide.addText(content.title || slideData.slide_type, {
            x: 0.5,
            y: 0.5,
            w: "90%",
            fontSize: 32,
            bold: true,
            color: "363636",
        });

        // Slide Bullets
        if (content.bullets && Array.isArray(content.bullets)) {
            slide.addText(
                content.bullets.map((b: string) => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
                {
                    x: 0.5,
                    y: 1.5,
                    w: "90%",
                    h: "60%",
                    fontSize: 18,
                    color: "666666",
                    valign: "top",
                }
            );
        }

        // Footer
        if (content.footer) {
            slide.addText(content.footer, {
                x: 0.5,
                y: 6.8,
                w: "90%",
                fontSize: 10,
                italic: true,
                color: "999999"
            });
        }
    });

    return pptx.writeFile({ fileName: `${title.replace(/\s+/g, "_")}_StoryDeck.pptx` });
}
