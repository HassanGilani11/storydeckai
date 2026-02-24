"use client";

import { useState } from "react";
import { resetPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const result = await resetPassword(email);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result?.message) {
            setMessage(result.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8 bg-slate-900/50 p-10 rounded-3xl border border-gray-800 backdrop-blur-xl">
                <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                </Link>

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter italic">Reset Password</h1>
                    <p className="text-gray-400">Enter your email and we'll send you a link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            className="bg-slate-950 border-gray-800 text-white"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="text-sm text-green-500 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                            {message}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg font-bold rounded-2xl"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
