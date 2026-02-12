"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ReactionOverlayProps {
    emoji: string;
    show: boolean;
}

/**
 * Reaction overlay — shows emoji animation when an answer is selected.
 * Falls back to emoji display (Lottie files can be added later).
 */
export default function ReactionOverlay({ emoji, show }: ReactionOverlayProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.3 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                >
                    <motion.span
                        initial={{ scale: 0.5 }}
                        animate={{ scale: [0.5, 1.3, 1] }}
                        transition={{ duration: 0.5, times: [0, 0.6, 1] }}
                        className="text-8xl filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    >
                        {emoji}
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Map reaction types to emojis (Lottie JSONs can be added later)
export const REACTION_EMOJIS: Record<string, string> = {
    salute: "🫡",
    crown: "👑",
    lol: "😂",
    fire: "🔥",
    skull: "💀",
    smirk: "😏",
    boxing: "🥊",
    money: "💸",
    handshake: "🤝",
    heart: "❤️",
    shocked: "😱",
    popcorn: "🍿",
};
