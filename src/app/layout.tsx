import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "StoryDeck AI | Structured Business Storytelling",
    description: "AI-powered structured business presentation builder for startup pitch decks.",
};

import { ThemeProvider } from "@/components/theme-provider";
import { FontProvider } from "@/components/font-provider";
import { Toaster } from "sonner";
import { createClient } from "@/lib/db/server";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let brandKit = null;
    if (user) {
        const { data } = await supabase
            .from("brand_kits")
            .select("font_family")
            .eq("user_id", user.id)
            .maybeSingle();
        brandKit = data;
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <FontProvider fontFamily={brandKit?.font_family || "Inter"}>
                        {children}
                        <Toaster richColors position="bottom-right" />
                    </FontProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
