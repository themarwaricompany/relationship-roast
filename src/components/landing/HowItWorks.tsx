"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

const steps = [
    {
        emoji: "📝",
        title: "Quiz Bharo",
        description: "12 mazedaar Hinglish sawal — apne rishte ke baare mein",
    },
    {
        emoji: "📲",
        title: "Partner Ko Bhejo",
        description: "Link share karo — partner bhi wahi sawal answer kare",
    },
    {
        emoji: "🤖",
        title: "AI Roast Pao",
        description: "Dono ke answers compare karke AI hilarious verdict dega",
    },
];

export default function HowItWorks() {
    return (
        <section className="px-5 pb-12">
            <div className="max-w-sm mx-auto space-y-3">
                <h2 className="text-center text-xs text-text-muted uppercase tracking-widest mb-4 font-medium">
                    Kaise kaam karta hai?
                </h2>
                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + i * 0.15, duration: 0.4 }}
                    >
                        <GlassCard padding="sm" hover>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl flex-shrink-0">{step.emoji}</span>
                                <div>
                                    <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-white">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-text-muted leading-relaxed mt-0.5">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
