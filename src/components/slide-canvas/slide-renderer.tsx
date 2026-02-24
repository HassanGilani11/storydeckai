"use client";

import { Slide } from "@/types";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";

interface SlideRendererProps {
    slide: Slide;
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "99, 102, 241";
}

export function SlideRenderer({ slide }: SlideRendererProps) {
    const content = slide.content_json || { title: slide.slide_type, bullets: [] };
    const layout = content.layout || "standard";

    // Dynamic Icon Resolver
    const IconComponent = content.icon ? (LucideIcons as any)[content.icon] : null;

    const renderLayout = () => {
        switch (layout) {
            case "centered-title":
                return (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="flex flex-col items-center mb-10">
                            {IconComponent && (
                                <div className="w-16 h-16 rounded-3xl bg-muted border border-border flex items-center justify-center text-[var(--brand-primary)] mb-6 shadow-inner">
                                    <IconComponent className="w-8 h-8" />
                                </div>
                            )}
                            <span className="text-xs font-black uppercase tracking-[0.4em] mb-2" style={{ color: 'rgba(var(--brand-primary-rgb), 0.8)' }}>
                                {slide.slide_type.replace("-", " ")}
                            </span>
                            <div className="h-1 w-20 bg-gradient-to-r from-[var(--brand-primary)] to-[rgba(var(--brand-primary-rgb),0.2)] rounded-full" />
                        </div>

                        <h2 className="text-5xl lg:text-7xl font-extrabold text-foreground tracking-tighter leading-none max-w-5xl balance italic">
                            {content.title || "Slide Title"}
                        </h2>

                        {content.subtitle && (
                            <p className="text-2xl lg:text-3xl text-muted-foreground mt-8 font-medium leading-relaxed max-w-3xl opacity-80">
                                {content.subtitle}
                            </p>
                        )}
                    </div>
                );

            case "metrics-grid":
                return (
                    <div className="flex-1 flex flex-col">
                        <div className="mb-12">
                            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">{content.title}</h2>
                            <p className="text-xl text-muted-foreground font-medium">{content.subtitle}</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 flex-1 content-center">
                            {(content.bullets || []).map((bullet: string, i: number) => {
                                const [val, label] = bullet.includes(":") ? bullet.split(":") : [bullet, ""];
                                return (
                                    <div key={i} className="glass-panel p-8 rounded-3xl border border-border/50 flex flex-col items-center justify-center text-center group/metric transition-all slide-zoom-in" style={{ animationDelay: `${0.2 + i * 0.1}s`, borderColor: 'rgba(var(--brand-primary-rgb), 0.1)' }}>
                                        <span className="text-4xl lg:text-5xl font-black italic mb-3 group-hover:scale-110 transition-transform" style={{ color: 'var(--brand-primary)' }}>
                                            {val.trim()}
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                                            {label.trim() || `Metric ${i + 1}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            case "timeline":
                return (
                    <div className="flex-1 flex flex-col">
                        <div className="mb-12">
                            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 italic italic">{content.title}</h2>
                            <p className="text-xl text-muted-foreground font-medium">{content.subtitle}</p>
                        </div>
                        <div className="flex-1 flex items-center justify-between gap-4 relative">
                            {/* Connector Line */}
                            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/30 to-transparent -translate-y-1/2 -z-10" />

                            {(content.bullets || []).map((bullet: string, i: number) => (
                                <div key={i} className="flex-1 flex flex-col items-center text-center group/step slide-fade-in" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                                    <div className="w-14 h-14 rounded-2xl bg-card border border-[var(--brand-primary)]/20 flex items-center justify-center text-lg font-black italic mb-6 shadow-xl group-hover:scale-110 group-hover:border-[var(--brand-primary)] transition-all bg-[rgba(var(--brand-primary-rgb),0.02)]">
                                        {i + 1}
                                    </div>
                                    <div className="px-4">
                                        <p className="text-lg font-bold text-foreground mb-2 group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                                            {bullet}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "comparison":
                return (
                    <div className="flex-1 flex flex-col">
                        <div className="mb-12">
                            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 italic italic">{content.title}</h2>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-8 lg:gap-12">
                            {(content.bullets || []).slice(0, 2).map((bullet: string, i: number) => (
                                <div key={i} className={cn(
                                    "p-10 rounded-[2.5rem] border flex flex-col slide-zoom-in",
                                    i === 0 ? "bg-muted/30 border-border" : "bg-[rgba(var(--brand-primary-rgb),0.03)] border-[var(--brand-primary)]/20"
                                )} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-6">
                                        {i === 0 ? "The Challenge" : "The Solution"}
                                    </span>
                                    <p className="text-2xl lg:text-3xl font-bold leading-tight italic italic">
                                        {bullet}
                                    </p>
                                    <div className="mt-auto pt-8">
                                        <div className={cn(
                                            "w-12 h-1 rounded-full",
                                            i === 0 ? "bg-muted-foreground/20" : "bg-[var(--brand-primary)]"
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "quote":
                return (
                    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
                        <LucideIcons.Quote className="w-16 h-16 text-[var(--brand-primary)]/20 mb-10" />
                        <h2 className="text-4xl lg:text-5xl font-extrabold italic italic tracking-tight leading-tight text-foreground balance">
                            "{content.title}"
                        </h2>
                        {content.subtitle && (
                            <div className="mt-12 flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden mb-4 shrink-0 shadow-xl">
                                    <LucideIcons.User className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <p className="text-xl font-bold text-[var(--brand-primary)] uppercase tracking-widest italic italic">
                                    {content.subtitle}
                                </p>
                                {content.bullets?.[0] && (
                                    <p className="text-sm text-muted-foreground font-medium mt-1 uppercase tracking-widest opacity-60">
                                        {content.bullets[0]}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );

            case "cta":
                return (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(var(--brand-primary-rgb),0.1)] rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[var(--brand-primary)] mb-10 border border-[var(--brand-primary)]/20">
                            The Next Step
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 italic italic">
                            {content.title}
                        </h2>
                        <p className="text-xl lg:text-2xl text-muted-foreground font-medium mb-12 max-w-2xl balance">
                            {content.subtitle || "Let's build something legendary together."}
                        </p>

                        <div className="flex flex-col items-center gap-6">
                            {(content.bullets || []).map((bullet: string, i: number) => (
                                <div key={i} className="flex items-center gap-4 text-xl font-bold text-foreground slide-fade-in" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                                    <LucideIcons.ArrowRight className="w-5 h-5 text-[var(--brand-primary)]" />
                                    {bullet}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "split-hero":
                return (
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(var(--brand-primary-rgb), 0.8)' }}>
                                    {slide.slide_type.replace("-", " ")}
                                </span>
                                <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-[0.9] italic italic">
                                    {content.title}
                                </h2>
                                <p className="text-xl lg:text-2xl text-muted-foreground font-medium leading-relaxed">
                                    {content.subtitle}
                                </p>
                            </div>
                            <ul className="space-y-6">
                                {(content.bullets || []).map((bullet: string, i: number) => (
                                    <li key={i} className="flex items-start text-lg lg:text-xl text-foreground/70 leading-relaxed slide-fade-in" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                                        <div className="w-3 h-1 rounded-full bg-[var(--brand-primary)] mt-3.5 mr-5 shrink-0" />
                                        <span className="font-medium">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="h-full relative rounded-[3rem] border border-border bg-muted/20 overflow-hidden group/image slide-zoom-in shadow-2xl">
                            {content.imageUrl ? (
                                <>
                                    <img
                                        src={content.imageUrl}
                                        alt={content.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/image:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-black/40" />
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                    <LucideIcons.Image className="w-12 h-12 text-muted-foreground/20" />
                                </div>
                            )}
                        </div>
                    </div>
                );

            default: // standard
                return (
                    <>
                        <div className="mb-10 lg:mb-14">
                            <div className="flex items-center gap-4 mb-4">
                                {IconComponent && (
                                    <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-[var(--brand-primary)] shadow-inner">
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--brand-primary)]/80 mb-1">
                                        {slide.slide_type.replace("-", " ")}
                                    </span>
                                    <div className="h-0.5 w-12 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary)]/50 rounded-full" />
                                </div>
                            </div>

                            <h2 className="text-4xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1] max-w-4xl">
                                {content.title || "Slide Title"}
                            </h2>

                            {content.subtitle && (
                                <p className="text-xl lg:text-2xl text-muted-foreground mt-4 font-medium leading-relaxed max-w-3xl">
                                    {content.subtitle}
                                </p>
                            )}
                        </div>

                        <div className="flex-1 min-h-0 mb-8 overflow-hidden">
                            <div className={cn(
                                "h-full gap-16 items-center",
                                content.imageUrl ? "grid grid-cols-[1.2fr_1fr]" : "flex flex-col items-start"
                            )}>
                                <div className={cn(
                                    "space-y-8 w-full",
                                    content.imageUrl ? "" : "max-w-4xl"
                                )}>
                                    <ul className="space-y-6">
                                        {(content.bullets || []).map((bullet: string, i: number) => (
                                            <li key={i} className="flex items-start text-xl lg:text-2xl text-foreground/80 leading-relaxed slide-fade-in" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                                                <div className="w-3 h-1 rounded-full bg-[var(--brand-primary)] mt-4 mr-6 shrink-0 shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.3)]" />
                                                <span className="font-medium">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {content.imageUrl && (
                                    <div className="h-full relative rounded-3xl border border-border bg-muted/20 overflow-hidden group/image slide-zoom-in shadow-2xl">
                                        <img
                                            src={content.imageUrl}
                                            alt={content.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover/image:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                );
        }
    };

    const { brandKit } = useEditorStore();

    // Dynamic Brand Styling
    const brandStyles = {
        '--brand-primary': brandKit?.primary_color || '#6366f1',
        '--brand-primary-rgb': hexToRgb(brandKit?.primary_color || '#6366f1'),
        '--brand-secondary': brandKit?.secondary_color || '#0f172a',
        '--brand-secondary-rgb': hexToRgb(brandKit?.secondary_color || '#0f172a'),
    } as React.CSSProperties;

    return (
        <div
            className="aspect-[16/9] w-full bg-card border border-border rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] p-12 lg:p-16 flex flex-col relative overflow-hidden group cursor-default"
            style={brandStyles}
        >
            {/* Dynamic premium background elements using RGB for opacity */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[rgba(var(--brand-primary-rgb),0.1)] blur-[120px] rounded-full -mr-[10%] -mt-[10%] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-[rgba(var(--brand-primary-rgb),0.05)] blur-[100px] rounded-full -ml-[5%] -mb-[5%]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-foreground/[0.02] via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
                {renderLayout()}

                {/* Footer / CTA Section */}
                {(content.footer || content.cta || brandKit?.logo_url) && (
                    <div className="pt-8 mt-auto border-t border-border flex justify-between items-center bg-card/50 backdrop-blur-sm -mx-16 px-16 -mb-16 pb-12">
                        <div className="flex items-center gap-4 flex-1">
                            {brandKit?.logo_url && (
                                <img src={brandKit.logo_url} alt="Brand Logo" className="h-6 w-auto object-contain transition-opacity" style={{ opacity: 0.7 }} />
                            )}
                            {content.footer && (
                                <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40" style={{ color: 'var(--brand-secondary)' }}>
                                    {content.footer}
                                </p>
                            )}
                        </div>

                        {content.cta && (
                            content.ctaLink ? (
                                <a
                                    href={content.ctaLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[var(--brand-primary)] text-white px-10 py-3.5 rounded-2xl text-base font-black shadow-lg shadow-[var(--brand-primary)]/20 hover:opacity-90 hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer active:scale-95 flex items-center gap-3 group/btn"
                                >
                                    {content.cta}
                                    <LucideIcons.ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                                </a>
                            ) : (
                                <div className="bg-[var(--brand-primary)] text-white px-10 py-3.5 rounded-2xl text-sm font-black italic uppercase tracking-widest shadow-lg shadow-[var(--brand-primary)]/20 hover:opacity-90 transition-all cursor-pointer active:scale-95 text-center">
                                    {content.cta}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
