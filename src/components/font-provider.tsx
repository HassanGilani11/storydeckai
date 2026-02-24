"use client";

import { useEffect, useState } from "react";

interface FontProviderProps {
    fontFamily: string | null;
    children: React.ReactNode;
}

export function FontProvider({ fontFamily, children }: FontProviderProps) {
    const [currentFont, setCurrentFont] = useState(fontFamily || "Inter");

    useEffect(() => {
        if (fontFamily) {
            setCurrentFont(fontFamily);
        }
    }, [fontFamily]);

    useEffect(() => {
        if (!currentFont) return;

        // Create link element for Google Fonts
        const linkId = "dynamic-font-link";
        let link = document.getElementById(linkId) as HTMLLinkElement;

        if (!link) {
            link = document.createElement("link");
            link.id = linkId;
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }

        const formattedFont = currentFont.replace(/\s+/g, "+");
        link.href = `https://fonts.googleapis.com/css2?family=${formattedFont}:wght@400;500;600;700;800;900&display=swap`;

        // Apply font to body
        document.body.style.fontFamily = `'${currentFont}', sans-serif`;

        return () => {
            // We don't necessarily want to remove it on unmount if it's the global provider
            // but we update it when the prop changes.
        };
    }, [currentFont]);

    return <>{children}</>;
}
