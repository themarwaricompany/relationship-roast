"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import type { QuizCategory } from "@/types";
import { CATEGORIES } from "@/lib/constants";

interface CategoryVerdictProps {
    category: QuizCategory;
    verdict: string;
    index: number;
}

export default function CategoryVerdict({ category, verdict, index }: CategoryVerdictProps) {
    const categoryMeta = CATEGORIES.find((c) => c.key === category);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3, duration: 0.4 }}
        >
            <GlassCard padding="md">
                <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 mt-0.5">
                        {categoryMeta?.emoji || "📋"}
                    </span>
                    <div>
                        <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">
                            {categoryMeta?.label || category}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{verdict}</p>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
