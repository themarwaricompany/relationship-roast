"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface ScoreRevealProps {
    partnerAName: string;
    partnerBName: string;
    partnerAScore: number;
    partnerBScore: number;
    partnerATitle: string;
    partnerBTitle: string;
    tagline: string;
    onRevealComplete: () => void;
}

export default function ScoreReveal({
    partnerAName,
    partnerBName,
    partnerAScore,
    partnerBScore,
    partnerATitle,
    partnerBTitle,
    tagline,
    onRevealComplete,
}: ScoreRevealProps) {
    const [displayScoreA, setDisplayScoreA] = useState(0);
    const [displayScoreB, setDisplayScoreB] = useState(0);
    const [showTitles, setShowTitles] = useState(false);
    const [showTagline, setShowTagline] = useState(false);
    const confettiDone = useRef(false);

    // Count-up animation
    useEffect(() => {
        const duration = 2500;
        const fps = 60;
        const totalFrames = (duration / 1000) * fps;
        let frame = 0;

        const interval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out

            setDisplayScoreA(Math.round(eased * partnerAScore));
            setDisplayScoreB(Math.round(eased * partnerBScore));

            if (frame >= totalFrames) {
                clearInterval(interval);
                setDisplayScoreA(partnerAScore);
                setDisplayScoreB(partnerBScore);

                // Show titles after count-up
                setTimeout(() => setShowTitles(true), 400);
                // Show tagline after titles
                setTimeout(() => setShowTagline(true), 1000);
                // Fire confetti
                if (!confettiDone.current) {
                    confettiDone.current = true;
                    fireConfetti();
                }
                // Signal reveal complete
                setTimeout(() => onRevealComplete(), 1800);
            }
        }, 1000 / fps);

        return () => clearInterval(interval);
    }, [partnerAScore, partnerBScore, onRevealComplete]);

    const fireConfetti = () => {
        const end = Date.now() + 2000;
        const colors = ["#DC2626", "#F59E0B", "#FF69B4", "#FCD34D"];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors,
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors,
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    };

    return (
        <div className="text-center space-y-6">
            {/* Scores side by side */}
            <div className="flex items-center justify-center gap-8">
                {/* Partner A */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <p className="text-sm text-text-secondary font-medium mb-1">{partnerAName}</p>
                    <p className="font-[family-name:var(--font-heading)] text-5xl font-bold text-gradient-red">
                        {displayScoreA}
                    </p>
                    <p className="text-xs text-text-muted mt-1">/ 100</p>
                </motion.div>

                {/* VS */}
                <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="text-2xl text-text-muted font-bold"
                >
                    vs
                </motion.span>

                {/* Partner B */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                >
                    <p className="text-sm text-text-secondary font-medium mb-1">{partnerBName}</p>
                    <p className="font-[family-name:var(--font-heading)] text-5xl font-bold text-gradient-red">
                        {displayScoreB}
                    </p>
                    <p className="text-xs text-text-muted mt-1">/ 100</p>
                </motion.div>
            </div>

            {/* Titles */}
            {showTitles && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-6"
                >
                    <div className="text-center">
                        <p className="text-sm font-bold text-gold">{partnerATitle}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                        <p className="text-sm font-bold text-gold">{partnerBTitle}</p>
                    </div>
                </motion.div>
            )}

            {/* Tagline */}
            {showTagline && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg text-text-secondary italic font-medium leading-relaxed max-w-md mx-auto"
                >
                    &ldquo;{tagline}&rdquo;
                </motion.p>
            )}
        </div>
    );
}
