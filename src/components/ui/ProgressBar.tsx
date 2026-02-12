"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    current: number;
    total: number;
    label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
    const percentage = (current / total) * 100;

    return (
        <div className="w-full">
            {label && (
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary font-medium">{label}</span>
                    <span className="text-sm text-text-muted font-medium">
                        {current} / {total}
                    </span>
                </div>
            )}
            <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-red rounded-full"
                    initial={false}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
