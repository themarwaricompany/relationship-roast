"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Background from "@/components/shared/Background";
import Header from "@/components/shared/Header";
import GlassCard from "@/components/ui/GlassCard";
import ScoreReveal from "@/components/result/ScoreReveal";
import CategoryVerdict from "@/components/result/CategoryVerdict";
import ShareSection from "@/components/result/ShareSection";
import ScorecardGenerator from "@/components/result/ScorecardGenerator";
import LeaderboardOptIn from "@/components/result/LeaderboardOptIn";
import { CATEGORY_ORDER } from "@/lib/constants";
import { playSound } from "@/lib/sounds";
import type { QuizSession, QuizCategory } from "@/types";

export default function ResultPage() {
    const params = useParams();
    const sessionId = params.sessionId as string;

    const [session, setSession] = useState<QuizSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [showVerdicts, setShowVerdicts] = useState(false);
    const [showOverall, setShowOverall] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [scorecardUrl, setScorecardUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await fetch(`/api/quiz/status/${sessionId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSession(data.session);
                }
            } catch (err) {
                console.error("Failed to fetch result:", err);
            }
            setLoading(false);
        };
        fetchResult();
    }, [sessionId]);

    const handleScoreRevealComplete = useCallback(() => {
        playSound("scoreReveal");
        setShowVerdicts(true);

        // Show overall after all category verdicts
        setTimeout(() => {
            setShowOverall(true);
            playSound("verdictAppear");
        }, CATEGORY_ORDER.length * 300 + 500);

        // Show share section after overall
        setTimeout(() => {
            setShowShare(true);
            playSound("shareUnlock");
        }, CATEGORY_ORDER.length * 300 + 1500);
    }, []);

    if (loading) {
        return (
            <Background>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-4xl animate-pulse">🎬</span>
                        <p className="text-text-muted mt-3 text-sm">Loading results...</p>
                    </div>
                </div>
            </Background>
        );
    }

    if (!session?.ai_result) {
        return (
            <Background>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-4xl">😵</span>
                        <p className="text-text-secondary mt-3">Results not found</p>
                        <a href="/" className="text-sm text-red hover:underline mt-3 inline-block">
                            ← Back to Home
                        </a>
                    </div>
                </div>
            </Background>
        );
    }

    const result = session.ai_result;

    return (
        <Background>
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 flex flex-col items-center px-5 pb-12 pt-4">
                    <div className="w-full max-w-md space-y-6">
                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-4"
                        >
                            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
                                🫡 Results
                            </h1>
                        </motion.div>

                        {/* Score Reveal */}
                        <GlassCard padding="lg">
                            <ScoreReveal
                                partnerAName={session.partner_a_name}
                                partnerBName={session.partner_b_name}
                                partnerAScore={result.partner_a_score}
                                partnerBScore={result.partner_b_score}
                                partnerATitle={result.partner_a_title}
                                partnerBTitle={result.partner_b_title}
                                tagline={result.tagline}
                                onRevealComplete={handleScoreRevealComplete}
                            />
                        </GlassCard>

                        {/* Category Verdicts */}
                        {showVerdicts && (
                            <div className="space-y-3">
                                {CATEGORY_ORDER.map((category, index) => (
                                    <CategoryVerdict
                                        key={category}
                                        category={category as QuizCategory}
                                        verdict={result.category_verdicts[category] || ""}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Overall Verdict */}
                        {showOverall && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <GlassCard padding="lg">
                                    <div className="text-center">
                                        <span className="text-3xl block mb-3">🎭</span>
                                        <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-gold uppercase tracking-wider mb-3">
                                            Overall Verdict
                                        </h3>
                                        <p className="text-text-secondary text-sm leading-relaxed">
                                            {result.overall_verdict}
                                        </p>
                                    </div>

                                    {/* Cross-reference highlights */}
                                    {result.cross_reference_highlights?.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-2">
                                            {result.cross_reference_highlights.map((highlight, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-start gap-2 text-xs text-text-muted"
                                                >
                                                    <span>💡</span>
                                                    <span>{highlight}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        )}

                        {/* Scorecard Generator */}
                        {showShare && (
                            <ScorecardGenerator
                                sessionId={sessionId}
                                onScorecardGenerated={(url) => setScorecardUrl(url)}
                                existingScorecardUrl={session.scorecard_image_url}
                            />
                        )}

                        {/* Share Section */}
                        {showShare && (
                            <>
                                <ShareSection
                                    sessionId={sessionId}
                                    partnerAName={session.partner_a_name}
                                    partnerBName={session.partner_b_name}
                                    scoreA={result.partner_a_score}
                                    scoreB={result.partner_b_score}
                                    titleA={result.partner_a_title}
                                    titleB={result.partner_b_title}
                                    scorecardImageUrl={scorecardUrl || session.scorecard_image_url}
                                />

                                <LeaderboardOptIn
                                    sessionId={sessionId}
                                    college={session.college}
                                    city={session.city}
                                />
                            </>
                        )}
                    </div>
                </main>
            </div>
        </Background>
    );
}
