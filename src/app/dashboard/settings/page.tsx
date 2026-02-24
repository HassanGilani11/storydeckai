import { getBrandKit, getUserSettings } from "@/actions/settings";
import { BrandKitForm } from "@/components/settings/brand-kit-form";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { IntegrationSettings } from "@/components/settings/integration-settings";
import { ChevronRight, Settings } from "lucide-react";

export default async function SettingsPage() {
    const brandKitData = await getBrandKit();
    const userSettings = await getUserSettings();

    return (
        <div className="p-12 lg:p-20 relative max-w-[1600px] mx-auto min-h-screen">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

            <div className="mb-20 slide-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                    <Settings className="w-3 h-3" />
                    Global Preferences
                </div>
                <h1 className="text-5xl lg:text-8xl font-black tracking-tighter mb-6 text-foreground">
                    Account <span className="italic text-gradient">Settings</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">Customize your design system, notification engine, and third-party workflow integrations.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 slide-fade-in" style={{ animationDelay: '0.2s' }}>
                {/* Main Content Area */}
                <div className="xl:col-span-8 space-y-12">

                    {/* Brand Kit Section */}
                    <div id="brand-kit" className="glass-panel rounded-[2.5rem] p-10 border border-border/50 shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-lg">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black italic tracking-tight underline-offset-8">Brand <span className="text-primary">Kit</span></h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Visual Identity & Design System</p>
                            </div>
                        </div>
                        <BrandKitForm initialData={brandKitData} />
                    </div>

                    {/* Notifications Section */}
                    <div id="notifications" className="glass-panel rounded-[2.5rem] p-10 border border-border/50 shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-sm">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black italic tracking-tight">Notification <span className="text-indigo-400">Settings</span></h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Communication & Alert Preferences</p>
                            </div>
                        </div>
                        <NotificationSettings initialSettings={userSettings} />
                    </div>

                    {/* Integrations Section */}
                    <div id="integrations" className="glass-panel rounded-[2.5rem] p-10 border border-border/50 shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black italic tracking-tight">External <span className="text-purple-400">Integrations</span></h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Connect your professional tools</p>
                            </div>
                        </div>
                        <IntegrationSettings />
                    </div>

                </div>

                {/* Sidebar Navigation / Quick Info */}
                <div className="xl:col-span-4 space-y-8 lg:sticky lg:top-12 h-fit">
                    <div className="glass-panel rounded-3xl p-8 border border-border/40">
                        <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-6">Quick Navigation</h4>
                        <div className="space-y-4">
                            {[
                                { label: "Brand Kit", href: "#brand-kit" },
                                { label: "Notifications", href: "#notifications" },
                                { label: "Integrations", href: "#integrations" }
                            ].map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all group border border-transparent hover:border-border/50"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{link.label}</span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="premium-gradient rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/20">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-80">Pro Tip</h4>
                        <p className="text-sm font-medium italic leading-relaxed opacity-90">
                            "Consistent branding across your slides increases investor confidence by up to 40%."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
