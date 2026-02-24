import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Layout, ArrowRight, Play, Zap } from "lucide-react";
import { createClient } from "@/lib/db/server";
import { ModeToggle } from "@/components/mode-toggle";

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Background elements */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10 pointer-events-none shadow-[0_0_100px_rgba(99,102,241,0.05)]" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/40 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center font-black italic shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:scale-110 transition-all text-white">S</div>
                        <span className="font-black tracking-tighter text-2xl italic bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">StoryDeck AI</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <div className="h-6 w-px bg-border mx-2" />
                        {user ? (
                            <Link href="/dashboard">
                                <Button className="bg-primary text-primary-foreground hover:opacity-90 rounded-2xl px-8 py-6 font-bold text-base shadow-lg transition-all hover:-translate-y-0.5">Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-bold tracking-wide uppercase text-[11px]">Sign In</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-primary text-primary-foreground hover:opacity-90 rounded-2xl px-8 py-6 font-bold text-base shadow-lg transition-all hover:-translate-y-0.5">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32">
                <div className="max-w-5xl mx-auto px-6 text-center slide-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-panel rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-10 shadow-[0_0_30px_rgba(79,70,229,0.05)]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI-Powered Strategy Engine</span>
                    </div>

                    <h1 className="text-7xl md:text-[100px] font-black tracking-tight mb-10 leading-[0.9] text-foreground">
                        Tell the story that <br />
                        <span className="text-gradient italic">closes the deal.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
                        StoryDeck AI guides you through elite strategic frameworks to build pitch decks that <span className="text-foreground">investors actually want to read.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href={user ? "/dashboard" : "/signup"}>
                            <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 text-lg px-10 py-8 rounded-2xl font-black shadow-[0_32px_64px_-16px_rgba(99,102,241,0.2)] transition-all hover:scale-105 hover:-translate-y-2">
                                {user ? "Go to Dashboard" : "Start Building Free"}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="glass-panel text-foreground hover:bg-muted gap-3 h-16 rounded-2xl px-10 border-border font-bold transition-all">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <Play className="w-4 h-4 fill-foreground" />
                            </div>
                            Watch Demo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 slide-fade-in">
                        <h2 className="text-5xl font-black tracking-tight mb-6">Build anything, <span className="text-gradient italic">beautifully.</span></h2>
                        <p className="text-xl text-muted-foreground font-medium">Choose from our curated library of strategic templates.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 slide-fade-in" style={{ animationDelay: '0.2s' }}>
                        {[
                            { name: "SaaS Pitch Deck", type: "Sequoia Capital Format", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" },
                            { name: "Mobile App GTM", type: "YC High-Growth Format", img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1000&auto=format&fit=crop" },
                            { name: "B2B Sales Deck", type: "Enterprise Strategy", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop" }
                        ].map((item, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden glass-panel border-border bg-muted mb-6 relative transition-all group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.1)]">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
                                    <div className="w-full h-full bg-muted flex items-center justify-center overflow-hidden">
                                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                                    </div>
                                    <div className="absolute bottom-8 left-8 z-20">
                                        <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">{item.type}</p>
                                        <h3 className="text-2xl font-black text-foreground">{item.name}</h3>
                                    </div>
                                    <div className="absolute top-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-all">
                                        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alternating Features Section */}
            <section className="py-32 space-y-48">
                {/* Feature 1 */}
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="slide-fade-in">
                        <div className="w-16 h-16 rounded-[1.25rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-8 shadow-inner">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h2 className="text-5xl font-black tracking-tight mb-8">Lightning-fast <br /><span className="text-gradient italic">creation.</span></h2>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-10">
                            Transform any seed idea into a comprehensive presentation in minutes. Our AI understands business context and structures your story automatically.
                        </p>
                        <ul className="space-y-4">
                            {["Auto-suggests relevant slides", "Generates high-impact copy", "Aligns with elite frameworks"].map((li, i) => (
                                <li key={i} className="flex items-center gap-3 text-foreground/70 font-bold uppercase tracking-wider text-[10px]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {li}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="glass-panel aspect-square rounded-[3rem] bg-gradient-to-br from-primary/5 to-fuchsia-500/5 border-border overflow-hidden relative slide-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="absolute inset-20 glass-panel bg-background/50 rounded-3xl border-border shadow-2xl rotate-3 animate-pulse" />
                        <div className="absolute inset-32 glass-panel bg-background/80 rounded-3xl border-border shadow-2xl -rotate-6" />
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="glass-panel aspect-square rounded-[3rem] bg-gradient-to-bl from-primary/5 to-cyan-500/5 border-border overflow-hidden relative order-last md:order-first slide-fade-in">
                        <div className="absolute inset-24 glass-panel bg-primary/10 rounded-full border-border shadow-2xl animate-bounce duration-[10s]" />
                        <div className="absolute inset-40 glass-panel bg-fuchsia-500/10 rounded-full border-border shadow-2xl" />
                    </div>
                    <div className="slide-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="w-16 h-16 rounded-[1.25rem] bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mb-8 shadow-inner">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h2 className="text-5xl font-black tracking-tight mb-8">Effortlessly <br /><span className="text-gradient italic">stunning.</span></h2>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-10">
                            Don't waste hours on layout. StoryDeck AI applies premium design tokens to every slide, ensuring your deck looks like it was made by a professional agency.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-6 py-4 glass-panel rounded-2xl border-border text-center flex-1">
                                <p className="text-2xl font-black mb-1">90%</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Time Saved</p>
                            </div>
                            <div className="px-6 py-4 glass-panel rounded-2xl border-border text-center flex-1">
                                <p className="text-2xl font-black mb-1">Agency</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Quality UI</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="slide-fade-in">
                        <div className="w-16 h-16 rounded-[1.25rem] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-8 shadow-inner">
                            <Play className="w-8 h-8" />
                        </div>
                        <h2 className="text-5xl font-black tracking-tight mb-8">AI as an <br /><span className="text-gradient italic">amplifier.</span></h2>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-10">
                            Go beyond basic generation. Use our AI to refine your tone, suggest data visualizations, and ensure every slide hits a specific strategic goal.
                        </p>
                        <div className="flex flex-col gap-4">
                            {["Integrated SWOT analysis", "Smart data visualization", "Stakeholder-specific tuning"].map((li, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 glass-panel rounded-xl border-border bg-muted/30">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold text-foreground/80">{li}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="glass-panel aspect-square rounded-[3rem] bg-gradient-to-tr from-cyan-500/5 to-primary/5 border-border overflow-hidden relative slide-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="absolute inset-x-20 top-20 bottom-0 bg-muted/50 rounded-t-3xl border-x border-t border-border shadow-2xl translate-y-20 group-hover:translate-y-10 transition-transform duration-1000">
                            <div className="p-10 space-y-6">
                                <div className="h-4 w-1/3 bg-muted rounded-full" />
                                <div className="h-32 w-full bg-muted/50 rounded-2xl border border-border" />
                                <div className="space-y-3">
                                    <div className="h-3 w-full bg-muted/50 rounded-full" />
                                    <div className="h-3 w-2/3 bg-muted/50 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-48 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[160px] rounded-full -z-10" />
                <div className="max-w-4xl mx-auto px-6 text-center slide-fade-in">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" alt="Founder" className="w-24 h-24 rounded-[2rem] mx-auto mb-10 border-2 border-border shadow-2xl object-cover" />
                    <p className="text-3xl md:text-5xl font-black tracking-tight mb-12 leading-tight text-foreground">
                        "StoryDeck has become an <span className="text-gradient italic">essential tool</span> for our fundraise. It gave us hours of our life back and the deck look amazing. I can't imagine reaching out to VCs without it."
                    </p>
                    <div>
                        <p className="text-lg font-black text-foreground tracking-widest uppercase mb-1">Alex Rivers</p>
                        <p className="text-sm font-bold text-muted-foreground">Founder @ Stealth SaaS</p>
                    </div>
                </div>
            </section>

            {/* Features (Capabilities) Grid */}
            <section className="py-32 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl font-black tracking-tight mb-4 text-foreground">Everything you need to <span className="text-gradient italic">scale your story.</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { title: "Strategic Frameworks", desc: "Sequoia Capital, Y-Combinator, and Andreessen formats pre-baked into the engine.", icon: Layout, delay: '0.1s' },
                            { title: "AI Narrative Design", desc: "Our engine transforms bullet points into a compelling executive narrative.", icon: Sparkles, delay: '0.2s' },
                            { title: "SaaS Focus", desc: "Industry-specific templates optimized for software-as-a-service fundraising.", icon: Zap, delay: '0.3s' },
                            { title: "Export to PDF/Web", desc: "Share your deck via a premium web link or download as a high-fidelity PDF.", icon: Play, delay: '0.4s' },
                            { title: "Founder Console", desc: "Manage multiple projects and strategic variations in one centralized hub.", icon: ArrowRight, delay: '0.5s' },
                            { title: "Team Collaboration", desc: "Coming soon: Collaborative features for founders and co-founders.", icon: Sparkles, delay: '0.6s' }
                        ].map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className="p-10 rounded-[2.5rem] glass-panel hover:bg-muted/50 transition-all group slide-fade-in relative overflow-hidden" style={{ animationDelay: f.delay }}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-all" />
                                    <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:border-primary/30 transition-all shadow-inner">
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight">{f.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed font-medium text-lg">{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-32 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* Big Background Text */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[20vw] font-black text-foreground/[0.02] select-none pointer-events-none tracking-tighter uppercase whitespace-nowrap">
                    StoryDeck
                </div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-16 md:gap-8 relative z-10">
                    <div className="col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center font-black italic shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all text-white">S</div>
                            <span className="font-black tracking-tighter text-2xl italic bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">StoryDeck AI</span>
                        </div>
                        <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-xs">
                            © 2026 StoryDeck AI. <br />
                            The future of founder storytelling.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary">Product</h4>
                        <ul className="space-y-4">
                            {['Template Gallery', 'AI Playground', 'Frameworks', 'Pricing'].map(l => (
                                <li key={l}><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary">Resources</h4>
                        <ul className="space-y-4">
                            {['Pitching 101', 'Founder Blog', 'Documentation', 'Support'].map(l => (
                                <li key={l}><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary">Social</h4>
                        <ul className="space-y-4">
                            {['Twitter', 'LinkedIn', 'YouTube', 'Stories'].map(l => (
                                <li key={l}><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">{l}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}
