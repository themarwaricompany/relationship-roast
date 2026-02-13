import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question, QuizOption } from "../../data/questions";
import GlassCard from "../ui/GlassCard";
import ProgressBar from "../ui/ProgressBar";

interface QuizViewProps {
    questions: Question[];
    onComplete: (answers: QuizOption[]) => void;
    onBack: () => void;
}

export default function QuizView({ questions, onComplete, onBack }: QuizViewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<QuizOption[]>([]);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const question = questions[currentIndex];
    const total = questions.length;

    const handleAnswer = useCallback((option: QuizOption, idx: number) => {
        if (selectedIdx !== null) return; // Prevent double-tap
        setSelectedIdx(idx);

        setTimeout(() => {
            const newAnswers = [...answers, option];

            if (currentIndex === total - 1) {
                onComplete(newAnswers);
            } else {
                setAnswers(newAnswers);
                setCurrentIndex((prev) => prev + 1);
                setSelectedIdx(null);
            }
        }, 500);
    }, [selectedIdx, answers, currentIndex, total, onComplete]);

    return (
        <main className="flex-1 flex flex-col px-5 pt-4 pb-8">
            {/* Progress */}
            <div className="w-full max-w-sm mx-auto mb-6">
                <ProgressBar current={currentIndex + 1} total={total} />
            </div>

            {/* Question card */}
            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-sm">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                        >
                            <GlassCard padding="lg">
                                {/* Question number & emoji */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs text-white/40 font-medium">
                                        Q{currentIndex + 1} of {total}
                                    </span>
                                    <span className="text-2xl">{question.emoji}</span>
                                </div>

                                {/* Question text */}
                                <h2 className="font-heading text-xl font-bold text-white leading-snug mb-6">
                                    {question.question}
                                </h2>

                                {/* Options */}
                                <div className="space-y-2.5">
                                    {question.options.map((option, idx) => {
                                        const isSelected = selectedIdx === idx;
                                        return (
                                            <motion.button
                                                key={idx}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => handleAnswer(option, idx)}
                                                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 ${isSelected
                                                        ? "bg-red/20 border-red/50 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                                                        : "bg-white/[0.05] border-white/[0.1] text-white/70 hover:bg-white/[0.08] hover:border-white/[0.18]"
                                                    }`}
                                            >
                                                <div className="flex gap-3 items-start">
                                                    <span
                                                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold flex-shrink-0 mt-0.5 ${isSelected
                                                                ? "bg-red text-white"
                                                                : "bg-white/[0.08] text-white/40"
                                                            }`}
                                                    >
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                    <span className="text-sm leading-relaxed font-medium">
                                                        {option.text}
                                                    </span>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </GlassCard>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Back button (only on first question) */}
            {currentIndex === 0 && (
                <div className="text-center mt-4">
                    <button
                        onClick={onBack}
                        className="text-sm text-white/40 hover:text-white/60 transition-colors"
                    >
                        ← Wapas Jao
                    </button>
                </div>
            )}
        </main>
    );
}
