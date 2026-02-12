"use client";

import { motion } from "framer-motion";

interface CategoryHeaderProps {
    emoji: string;
    label: string;
    categoryNumber: number;
    totalCategories: number;
    onComplete: () => void;
}

export default function CategoryHeader({
    emoji,
    label,
    categoryNumber,
    totalCategories,
    onComplete,
}: CategoryHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => {
                setTimeout(onComplete, 1500);
            }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
        >
            {/* Background blur */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Content */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
                className="relative z-10 text-center"
            >
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="text-6xl block mb-4"
                >
                    {emoji}
                </motion.span>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-text-muted uppercase tracking-widest mb-2"
                >
                    Category {categoryNumber} of {totalCategories}
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white"
                >
                    {label}
                </motion.h2>
            </motion.div>
        </motion.div>
    );
}
