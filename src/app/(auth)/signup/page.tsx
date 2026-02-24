"use client";

import { useState } from "react";
import { signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await signUp(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result?.message) {
            setIsSuccess(true);
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 blur-[120px] rounded-full -z-10" />

                <div className="w-full max-w-md space-y-8 glass-panel p-12 lg:p-14 rounded-[2.5rem] border-white/5 text-center backdrop-blur-3xl slide-fade-in relative z-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                    <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-inner">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-white leading-tight">Check your <span className="italic text-gradient">email</span></h1>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed">
                        We've sent a confirmation link to your email address. Please confirm your account to continue.
                    </p>
                    <Link href="/login" className="block pt-6">
                        <Button variant="ghost" className="text-indigo-400 font-black tracking-widest uppercase text-[10px] hover:bg-white/5 h-12 rounded-xl px-8">Back to Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

            <div className="w-full max-w-md space-y-10 glass-panel p-12 lg:p-14 rounded-[2.5rem] border-white/5 backdrop-blur-3xl slide-fade-in relative z-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center font-black italic shadow-[0_0_20px_rgba(99,102,241,0.3)] mx-auto mb-6">S</div>
                    <h1 className="text-4xl font-black tracking-tight text-white leading-tight">Get <span className="italic text-gradient">Started</span></h1>
                    <p className="text-slate-400 font-medium text-lg">Create your StoryDeck account today</p>
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
                        <Label htmlFor="password" title="password" className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1">Password</Label>
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
                            "Create Account"
                        )}
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-500 font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white font-black hover:underline ml-1">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
