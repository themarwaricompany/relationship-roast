"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Background from "@/components/shared/Background";
import Header from "@/components/shared/Header";
import ProgressBar from "@/components/ui/ProgressBar";
import QuestionCard from "@/components/quiz/QuestionCard";
import CategoryHeader from "@/components/quiz/CategoryHeader";
import ReactionOverlay, { REACTION_EMOJIS } from "@/components/quiz/ReactionOverlay";
import { QUESTIONS } from "@/lib/questions";
import { CATEGORY_ORDER } from "@/lib/constants";
import { playSound, activateSounds } from "@/lib/sounds";
import type { OptionKey, QuizSession, RelationshipStatus } from "@/types";

export default function QuizPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;
    const partnerFlag = searchParams.get("partner") || "b"; // 'a' or 'b'

    const [session, setSession] = useState<QuizSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, OptionKey>>({});
    const [showCategory, setShowCategory] = useState(true);
    const [showReaction, setShowReaction] = useState(false);
    const [reactionEmoji, setReactionEmoji] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Fetch session on mount
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch(`/api/quiz/status/${sessionId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSession(data.session);
                }
            } catch (err) {
                console.error("Failed to fetch session:", err);
            }
            setLoading(false);
        };
        fetchSession();
    }, [sessionId]);

    const currentQuestion = QUESTIONS[currentIndex];
    const totalQuestions = QUESTIONS.length;

    // Determine current category and if it's a new category
    const currentCategory = currentQuestion?.category;
    const previousCategory = currentIndex > 0 ? QUESTIONS[currentIndex - 1]?.category : null;
    const isNewCategory = currentIndex === 0 || currentCategory !== previousCategory;

    // Get category number
    const categoryIndex = CATEGORY_ORDER.indexOf(currentCategory);
    const totalCategories = CATEGORY_ORDER.length;

    useEffect(() => {
        if (isNewCategory && currentIndex >= 0) {
            setShowCategory(true);
        }
    }, [currentIndex, isNewCategory]);

    const handleCategoryComplete = useCallback(() => {
        setShowCategory(false);
        playSound("categoryChange");
    }, []);

    const handleAnswer = useCallback(
        async (optionKey: OptionKey) => {
            await activateSounds();
            playSound("tick");

            const option = currentQuestion.options[optionKey];
            const newAnswers = { ...answers, [currentQuestion.id]: optionKey };
            setAnswers(newAnswers);

            // Show reaction
            const emoji = REACTION_EMOJIS[option.reaction] || "🫡";
            setReactionEmoji(emoji);
            setShowReaction(true);

            setTimeout(() => {
                setShowReaction(false);

                if (currentIndex < totalQuestions - 1) {
                    playSound("whoosh");
                    setCurrentIndex(currentIndex + 1);
                } else {
                    // Quiz complete — submit answers
                    handleSubmit(newAnswers);
                }
            }, 800);
        },
        [currentIndex, currentQuestion, answers, totalQuestions]
    );

    const handleSubmit = async (finalAnswers: Record<number, OptionKey>) => {
        setSubmitting(true);
        playSound("quizComplete");

        try {
            const res = await fetch("/api/quiz/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    partner: partnerFlag,
                    answers: finalAnswers,
                }),
            });

            if (res.ok) {
                const data = await res.json();

                if (data.bothComplete) {
                    // Both done — go to generating
                    router.push(`/quiz/${sessionId}/generating`);
                } else if (partnerFlag === "a") {
                    // Partner A done, waiting for B
                    router.push(`/quiz/${sessionId}/waiting`);
                } else {
                    // Partner B done, waiting for AI (Partner A already done)
                    router.push(`/quiz/${sessionId}/generating`);
                }
            }
        } catch (err) {
            console.error("Submit error:", err);
        }

        setSubmitting(false);
    };

    if (loading) {
        return (
            <Background>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-4xl animate-pulse">🫡</span>
                        <p className="text-text-muted mt-3 text-sm">Loading quiz...</p>
                    </div>
                </div>
            </Background>
        );
    }

    if (!session) {
        return (
            <Background>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-4xl">😵</span>
                        <p className="text-text-secondary mt-3">Quiz session not found</p>
                    </div>
                </div>
            </Background>
        );
    }

    if (submitting) {
        return (
            <Background>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-4xl animate-pulse">📊</span>
                        <p className="text-text-secondary mt-3">Submitting answers...</p>
                    </div>
                </div>
            </Background>
        );
    }

    const playerName = partnerFlag === "a" ? session.partner_a_name : session.partner_b_name;
    const relationshipStatus = (session.relationship_status || "dating") as RelationshipStatus;

    return (
        <Background>
            <div className="min-h-screen flex flex-col">
                <Header />

                {/* Partner B intro */}
                {partnerFlag === "b" && currentIndex === 0 && showCategory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-5">
                        <div className="text-center max-w-sm">
                            <span className="text-5xl block mb-4">😏</span>
                            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white mb-3">
                                {session.partner_a_name} ne quiz liya hai...
                            </h2>
                            <p className="text-text-secondary text-sm mb-6">
                                Ab tumhari baari, {session.partner_b_name}! Wahi 12 sawal — apne POV se answer karo.
                            </p>
                            <button
                                onClick={() => setShowCategory(false)}
                                className="px-8 py-3 bg-red text-white rounded-xl font-bold text-sm hover:bg-red-hover transition-colors"
                            >
                                Chalo Shuru Karte Hain →
                            </button>
                        </div>
                    </div>
                )}

                <main className="flex-1 flex flex-col items-center justify-center px-5 pb-8 pt-4">
                    {/* Progress */}
                    <div className="w-full max-w-md mb-6">
                        <ProgressBar
                            current={currentIndex + 1}
                            total={totalQuestions}
                            label={`${playerName}'s Turn`}
                        />
                    </div>

                    {/* Category transition */}
                    <AnimatePresence>
                        {showCategory && isNewCategory && !(partnerFlag === "b" && currentIndex === 0) && (
                            <CategoryHeader
                                emoji={currentQuestion.categoryEmoji}
                                label={currentQuestion.categoryLabel}
                                categoryNumber={categoryIndex + 1}
                                totalCategories={totalCategories}
                                onComplete={handleCategoryComplete}
                            />
                        )}
                    </AnimatePresence>

                    {/* Question card */}
                    {!showCategory && currentQuestion && (
                        <div className="w-full max-w-md">
                            <QuestionCard
                                question={currentQuestion}
                                relationshipStatus={relationshipStatus}
                                onAnswer={handleAnswer}
                                questionNumber={currentIndex + 1}
                                totalQuestions={totalQuestions}
                            />
                        </div>
                    )}

                    {/* Reaction overlay */}
                    <ReactionOverlay emoji={reactionEmoji} show={showReaction} />
                </main>
            </div>
        </Background>
    );
}
