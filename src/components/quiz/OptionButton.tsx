"use client";

import { motion } from "framer-motion";

interface OptionButtonProps {
    label: string;
    text: string;
    selected: boolean;
    onClick: () => void;
}

export default function OptionButton({ label, text, selected, onClick }: OptionButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 ${selected
                    ? "bg-red/20 border-red/50 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                    : "bg-white/[0.05] border-white/[0.1] text-text-secondary hover:bg-white/[0.08] hover:border-white/[0.18]"
                }`}
        >
            <div className="flex gap-3 items-start">
                <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold flex-shrink-0 mt-0.5 ${selected
                            ? "bg-red text-white"
                            : "bg-white/[0.08] text-text-muted"
                        }`}
                >
                    {label.toUpperCase()}
                </span>
                <span className="text-sm leading-relaxed font-medium">{text}</span>
            </div>
        </motion.button>
    );
}
