"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Layers,
    Library,
    Settings,
    User as UserIcon,
    Sparkles,
    Sun,
    Moon
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Templates", href: "/dashboard/templates", icon: Layers },
    { name: "Library", href: "/dashboard/library", icon: Library },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
];

interface DashboardSidebarProps {
    user: any;
    profile: any;
}

export function DashboardSidebar({ user, profile }: DashboardSidebarProps) {
    const pathname = usePathname();

    // Use profile name if available, otherwise email
    const displayName = profile?.full_name || user?.email || "Guest User";
    const displayRole = profile?.role || "Founder";
    const userInitial = displayName.charAt(0).toUpperCase();

    return (
        <aside className="w-64 border-r border-border bg-background/30 backdrop-blur-xl flex flex-col h-screen sticky top-0 slide-fade-in z-50">
            {/* Header / Logo */}
            <div className="p-8 pb-12">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center font-black italic shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:scale-110 transition-all text-white">
                        S
                    </div>
                    <span className="font-black tracking-tighter text-2xl italic bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        StoryDeck
                    </span>
                </Link>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="px-4 mb-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Menu</p>
                </div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-[0_10px_20px_-5px_rgba(99,102,241,0.3)]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5 transition-transform duration-500",
                                isActive ? "scale-110" : "group-hover:scale-110"
                            )} />
                            <span className="font-bold text-sm tracking-tight">{item.name}</span>

                            {isActive && (
                                <div className="absolute left-0 w-1 h-6 bg-white rounded-full -translate-x-1" />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* AI Upgrade / Pro Section */}
            <div className="p-6 mt-auto">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 border border-primary/20 relative overflow-hidden group/card transition-all hover:border-primary/40">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[40px] rounded-full -mr-10 -mt-10 animate-pulse" />
                    <Sparkles className="w-8 h-8 text-primary mb-4" />
                    <h4 className="text-sm font-black text-foreground mb-1">Upgrade to Pro</h4>
                    <p className="text-[11px] text-muted-foreground font-medium mb-4 leading-relaxed">Unlock unlimited strategic AI generation.</p>
                    <button className="w-full py-2.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95">
                        Upgrade
                    </button>
                </div>
            </div>

            {/* Footer / User Info Section */}
            <div className="mt-auto border-t border-border">
                {/* Theme Toggle Section */}
                <div className="p-4 px-6 flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                            <Sun className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Appearance</span>
                    </div>
                    <ModeToggle className="w-8 h-8 rounded-lg" />
                </div>

                <Link
                    href="/dashboard/profile"
                    className="p-8 border-t border-border flex items-center gap-4 hover:bg-muted/30 transition-colors group/user"
                >
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 group-hover/user:border-primary/50 transition-colors">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[10px] font-black">{userInitial}</span>
                        )}
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="text-xs font-black text-foreground truncate group-hover/user:text-primary transition-colors">{displayName}</span>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{displayRole}</span>
                    </div>
                </Link>
            </div>
        </aside>
    );
}
