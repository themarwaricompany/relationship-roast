"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";

interface LeaderboardOptInProps {
    sessionId: string;
    college: string | null;
    city: string | null;
}

export default function LeaderboardOptIn({ sessionId, college, city }: LeaderboardOptInProps) {
    const [optedIn, setOptedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOptIn = async () => {
        setLoading(true);
        try {
            await fetch("/api/leaderboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, optIn: true }),
            });
            setOptedIn(true);
        } catch (err) {
            console.error("Leaderboard opt-in failed:", err);
        }
        setLoading(false);
    };

    if (optedIn) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <GlassCard padding="md">
                    <div className="text-center">
                        <p className="text-gold font-bold">🏆 Leaderboard mein add ho gaye!</p>
                        <a
                            href="/leaderboard"
                            className="text-sm text-red hover:underline mt-2 inline-block"
                        >
                            Dekho ranking →
                        </a>
                    </div>
                </GlassCard>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <GlassCard padding="md">
                <div className="text-center space-y-3">
                    <p className="text-lg">🏆</p>
                    <p className="text-sm text-text-secondary font-medium">
                        {college && college !== "Other"
                            ? `Apne college (${college}) mein rank dekhna hai?`
                            : city
                                ? `Apne city (${city}) mein rank dekhna hai?`
                                : "Leaderboard pe apna rank dekhna hai?"}
                    </p>
                    <Button variant="secondary" size="sm" onClick={handleOptIn} loading={loading}>
                        Join Leaderboard 🫡
                    </Button>
                </div>
            </GlassCard>
        </motion.div>
    );
}
