"use client";

import { useState } from "react";
import { signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await signIn(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

            <div className="w-full max-w-md space-y-10 glass-panel p-12 lg:p-14 rounded-[2.5rem] border-white/5 backdrop-blur-3xl slide-fade-in relative z-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center font-black italic shadow-[0_0_20px_rgba(99,102,241,0.3)] mx-auto mb-6">S</div>
                    <h1 className="text-4xl font-black tracking-tight text-white leading-tight">Welcome <span className="italic text-gradient">Back</span></h1>
                    <p className="text-slate-400 font-medium text-lg">Sign in to your StoryDeck account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            className="glass-panel h-14 bg-white/5 border-white/10 text-white rounded-2xl px-6 font-medium placeholder:text-slate-600 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <Label htmlFor="password" className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Password</Label>
                            <Link href="/reset-password" title="reset password" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="glass-panel h-14 bg-white/5 border-white/10 text-white rounded-2xl px-6 font-medium placeholder:text-slate-600 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20 font-medium">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black hover:bg-slate-100 h-16 text-lg font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-500 font-medium">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-white font-black hover:underline ml-1">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
