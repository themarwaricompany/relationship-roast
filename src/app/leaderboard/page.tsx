"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Background from "@/components/shared/Background";
import Header from "@/components/shared/Header";
import GlassCard from "@/components/ui/GlassCard";
import type { LeaderboardEntry } from "@/types";

type TabType = "college" | "city";

export default function LeaderboardPage() {
    const [tab, setTab] = useState<TabType>("college");
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/leaderboard?type=${tab}`);
                if (res.ok) {
                    const data = await res.json();
                    setEntries(data.entries || []);
                }
            } catch (err) {
                console.error("Leaderboard fetch error:", err);
            }
            setLoading(false);
        };
        fetchLeaderboard();
    }, [tab]);

    const getBadge = (rank: number) => {
        if (rank === 0) return "🥇";
        if (rank === 1) return "🥈";
        if (rank === 2) return "🥉";
        return `#${rank + 1}`;
    };

    return (
        <Background>
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 px-5 pb-12 pt-4">
                    <div className="max-w-md mx-auto">
                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-6"
                        >
                            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white mb-2">
                                🏆 Leaderboard
                            </h1>
                            <p className="text-sm text-text-muted">
                                Sabse bada Gulaam couple kaun hai?
                            </p>
                        </motion.div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => setTab("college")}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "college"
                                        ? "bg-red text-white"
                                        : "bg-white/[0.05] text-text-muted hover:bg-white/[0.08]"
                                    }`}
                            >
                                🎓 College
                            </button>
                            <button
                                onClick={() => setTab("city")}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "city"
                                        ? "bg-red text-white"
                                        : "bg-white/[0.05] text-text-muted hover:bg-white/[0.08]"
                                    }`}
                            >
                                🏙️ City
                            </button>
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="text-center py-12">
                                <span className="text-3xl animate-pulse">🏆</span>
                                <p className="text-text-muted mt-3 text-sm">Loading...</p>
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && entries.length === 0 && (
                            <GlassCard padding="lg">
                                <div className="text-center py-6">
                                    <span className="text-4xl block mb-3">🤷</span>
                                    <p className="text-text-secondary text-sm">
                                        Abhi tak koi entry nahi hai. Pehle ban jao!
                                    </p>
                                </div>
                            </GlassCard>
                        )}

                        {/* Entries */}
                        {!loading && entries.length > 0 && (
                            <div className="space-y-2">
                                {entries.map((entry, index) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <GlassCard padding="sm" hover>
                                            <div className="flex items-center gap-3">
                                                {/* Rank */}
                                                <div className="w-10 text-center flex-shrink-0">
                                                    <span className={`text-lg font-bold ${index < 3 ? "" : "text-text-muted text-sm"}`}>
                                                        {getBadge(index)}
                                                    </span>
                                                </div>

                                                {/* Names */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-white truncate">
                                                        {entry.partner_a_name} & {entry.partner_b_name}
                                                    </p>
                                                    <p className="text-xs text-text-muted">
                                                        {tab === "college" ? entry.college : entry.city}
                                                    </p>
                                                </div>

                                                {/* Score */}
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-red">
                                                        {entry.combined_score}
                                                    </p>
                                                    <p className="text-[10px] text-text-muted">/ 200</p>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* #1 couple special label */}
                        {!loading && entries.length > 0 && (
                            <div className="text-center mt-6">
                                <span className="text-xs text-gold">
                                    👑 #1 = Sabse Bada Gulaam Couple
                                </span>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </Background>
    );
}
