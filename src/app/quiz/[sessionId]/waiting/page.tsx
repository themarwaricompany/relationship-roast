"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Background from "@/components/shared/Background";
import Header from "@/components/shared/Header";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { WAITING_MESSAGES } from "@/lib/constants";
import type { QuizSession } from "@/types";

export default function WaitingPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

    const [session, setSession] = useState<QuizSession | null>(null);
    const [messageIndex, setMessageIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/quiz/${sessionId}?partner=b`
        : `https://jorukagulaam.com/quiz/${sessionId}?partner=b`;

    // Rotate waiting messages
    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % WAITING_MESSAGES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Poll for partner B completion
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/quiz/status/${sessionId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSession(data.session);

                    if (
                        data.session.status === "generating" ||
                        data.session.status === "complete"
                    ) {
                        if (data.session.status === "complete") {
                            router.push(`/result/${sessionId}`);
                        } else {
                            router.push(`/quiz/${sessionId}/generating`);
                        }
                    }
                }
            } catch (err) {
                console.error("Status check error:", err);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, [sessionId, router]);

    const handleWhatsAppShare = () => {
        const text = session
            ? `${session.partner_b_name}, maine Joru Ka Gulaam quiz liya hai 😏 Ab teri baari: ${shareUrl}`
            : `Maine Joru Ka Gulaam quiz liya hai 😏 Ab teri baari: ${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Noop
        }
    };

    return (
        <Background>
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 flex flex-col items-center justify-center px-5 pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md text-center"
                    >
                        {/* Animated emoji */}
                        <motion.span
                            className="text-6xl block mb-6"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            ⏳
                        </motion.span>

                        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white mb-2">
                            Partner ka wait hai...
                        </h1>

                        {/* Rotating message */}
                        <motion.p
                            key={messageIndex}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-text-secondary text-sm mb-8"
                        >
                            {WAITING_MESSAGES[messageIndex]}
                        </motion.p>

                        {/* Share buttons */}
                        <GlassCard padding="md">
                            <div className="space-y-3">
                                <p className="text-xs text-text-muted mb-2">
                                    Partner ko ye link bhejo 👇
                                </p>

                                {/* Link display */}
                                <div className="bg-white/[0.05] rounded-lg px-3 py-2 text-xs text-text-muted font-mono break-all text-left">
                                    {shareUrl}
                                </div>

                                <Button variant="whatsapp" fullWidth onClick={handleWhatsAppShare}>
                                    WhatsApp pe bhejo 📲
                                </Button>

                                <Button variant="secondary" fullWidth onClick={handleCopyLink}>
                                    {copied ? "Copied! ✅" : "Link Copy Karo 🔗"}
                                </Button>
                            </div>
                        </GlassCard>

                        {/* Pulse indicator */}
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                            <span className="text-xs text-text-muted">
                                Auto-detect ho jayega jab partner quiz lega
                            </span>
                        </div>
                    </motion.div>
                </main>
            </div>
        </Background>
    );
}
