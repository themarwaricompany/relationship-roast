"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question, OptionKey, RelationshipStatus } from "@/types";
import OptionButton from "./OptionButton";
import GlassCard from "@/components/ui/GlassCard";

interface QuestionCardProps {
    question: Question;
    relationshipStatus: RelationshipStatus;
    onAnswer: (optionKey: OptionKey) => void;
    questionNumber: number;
    totalQuestions: number;
}

export default function QuestionCard({
    question,
    relationshipStatus,
    onAnswer,
    questionNumber,
    totalQuestions,
}: QuestionCardProps) {
    const [selected, setSelected] = useState<OptionKey | null>(null);

    const questionText = question.text[relationshipStatus];
    const options = Object.entries(question.options) as [OptionKey, typeof question.options.a][];

    const handleSelect = (key: OptionKey) => {
        if (selected) return; // Prevent double-tap
        setSelected(key);
        // Small delay to show selection, then advance
        setTimeout(() => onAnswer(key), 600);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            >
                <GlassCard padding="lg">
                    {/* Category badge */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">{question.categoryEmoji}</span>
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                            {question.categoryLabel}
                        </span>
                    </div>

                    {/* Question number */}
                    <div className="text-xs text-text-muted mb-3 font-medium">
                        Q{questionNumber} of {totalQuestions}
                    </div>

                    {/* Question text */}
                    <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white leading-snug mb-6">
                        {questionText}
                    </h2>

                    {/* Options */}
                    <div className="space-y-2.5">
                        {options.map(([key, option]) => (
                            <OptionButton
                                key={key}
                                label={key}
                                text={option.text}
                                selected={selected === key}
                                onClick={() => handleSelect(key)}
                            />
                        ))}
                    </div>
                </GlassCard>
            </motion.div>
        </AnimatePresence>
    );
}
