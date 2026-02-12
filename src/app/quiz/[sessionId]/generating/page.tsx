"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Background from "@/components/shared/Background";
import Header from "@/components/shared/Header";
import { GENERATING_MESSAGES } from "@/lib/constants";

export default function GeneratingPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

    const [messageIndex, setMessageIndex] = useState(0);

    // Rotate loading messages
    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % GENERATING_MESSAGES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Trigger AI generation and poll for completion
    useEffect(() => {
        let cancelled = false;

        const triggerGeneration = async () => {
            try {
                // Trigger result generation
                await fetch("/api/generate-result", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId }),
                });
            } catch (err) {
                console.error("Generation trigger error:", err);
            }
        };

        const pollStatus = async () => {
            try {
                const res = await fetch(`/api/quiz/status/${sessionId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.session.status === "complete" && !cancelled) {
                        router.push(`/result/${sessionId}`);
                    }
                }
            } catch (err) {
                console.error("Status check error:", err);
            }
        };

        triggerGeneration();

        // Poll every 3 seconds
        const interval = setInterval(pollStatus, 3000);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [sessionId, router]);

    return (
        <Background>
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 flex flex-col items-center justify-center px-5 pb-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center max-w-sm"
                    >
                        {/* Animated brain emoji */}
                        <motion.span
                            className="text-7xl block mb-8"
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            🤖
                        </motion.span>

                        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white mb-4">
                            AI judge kaam pe hai...
                        </h1>

                        {/* Rotating message */}
                        <motion.p
                            key={messageIndex}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-text-secondary text-sm mb-8"
                        >
                            {GENERATING_MESSAGES[messageIndex]}
                        </motion.p>

                        {/* Loading indicator */}
                        <div className="flex justify-center gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    className="w-2 h-2 bg-red rounded-full"
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [0.8, 1.2, 0.8],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.2,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </main>
            </div>
        </Background>
    );
}
