import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import type { QuizResult } from "../../lib/scoring";
import type { ResultTier } from "../../lib/scoring";
import { generateShareImage } from "../../lib/generateImage";
import GlassCard from "../ui/GlassCard";

interface ResultScreenProps {
    result: QuizResult;
    userName: string;
    partnerName: string;
    onRestart: () => void;
}

const TIER_COLORS: Record<ResultTier, { accent: string; glow: string }> = {
    user_gulaam: { accent: '#FF3B30', glow: 'rgba(220,38,38,0.3)' },
    partner_gulaam: { accent: '#8B5CF6', glow: 'rgba(139,92,246,0.3)' },
    equal: { accent: '#F59E0B', glow: 'rgba(245,158,11,0.3)' },
    sigma: { accent: '#06B6D4', glow: 'rgba(6,182,212,0.3)' },
    toxic: { accent: '#F97316', glow: 'rgba(249,115,22,0.3)' },
};

export default function ResultScreen({ result, userName, partnerName, onRestart }: ResultScreenProps) {
    const [showContent, setShowContent] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [storyImageUrl, setStoryImageUrl] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const confettiDone = useRef(false);

    const colors = TIER_COLORS[result.tier];

    // Confetti on mount
    useEffect(() => {
        if (!confettiDone.current) {
            confettiDone.current = true;
            const end = Date.now() + 2000;
            const confettiColors = ["#DC2626", "#F59E0B", "#FF69B4", "#FCD34D"];

            (function frame() {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: confettiColors,
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: confettiColors,
                });
                if (Date.now() < end) requestAnimationFrame(frame);
            })();
        }

        setTimeout(() => setShowContent(true), 500);
    }, []);

    // Generate images
    useEffect(() => {
        async function gen() {
            setGenerating(true);
            try {
                const [sq, st] = await Promise.all([
                    generateShareImage(result.tier, result.title, result.description, userName, partnerName, 'square'),
                    generateShareImage(result.tier, result.title, result.description, userName, partnerName, 'story'),
                ]);
                setImageUrl(sq);
                setStoryImageUrl(st);
            } catch (err) {
                console.error('Image generation failed:', err);
            }
            setGenerating(false);
        }
        gen();
    }, [result, userName, partnerName]);

    const handleWhatsApp = () => {
        const text = `😂 Humara result aaya — ${result.title}! Dekho apna: jorukagulaam.com`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    };

    const handleInstagram = () => {
        if (storyImageUrl) {
            handleDownload(storyImageUrl, `joru-ka-gulaam-${userName}-${partnerName}-story.png`);
        }
        // Small delay, then open Instagram
        setTimeout(() => {
            window.open('https://www.instagram.com/create/story', '_blank');
        }, 500);
    };

    const handleNativeShare = async () => {
        if (!imageUrl) return;
        try {
            const blob = await (await fetch(imageUrl)).blob();
            const file = new File([blob], 'gulaam-result.png', { type: 'image/png' });
            if (navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Joru Ka Gulaam Score 🫡',
                    text: `😂 Humara result aaya — ${result.title}! Dekho apna: jorukagulaam.com`,
                });
                return;
            }
        } catch {
            // Fallback
        }
        if (navigator.share) {
            await navigator.share({
                title: 'Joru Ka Gulaam Score 🫡',
                text: `😂 Humara result aaya — ${result.title}! Dekho apna: jorukagulaam.com`,
                url: 'https://jorukagulaam.com',
            });
        }
    };

    return (
        <main className="flex-1 flex flex-col items-center px-5 py-8 overflow-y-auto">
            <div className="w-full max-w-sm space-y-5">
                {/* Result emoji + title */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center"
                >
                    <span className="text-7xl block mb-4">{result.emoji}</span>
                    <h1
                        className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight"
                        style={{ textShadow: `0 0 40px ${colors.glow}` }}
                    >
                        {result.title}
                    </h1>
                </motion.div>

                {/* Description */}
                {showContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <GlassCard padding="md">
                            <p className="text-center text-white/70 text-base leading-relaxed font-medium">
                                {result.description}
                            </p>
                        </GlassCard>
                    </motion.div>
                )}

                {/* Names */}
                {showContent && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center font-bold text-lg"
                        style={{ color: colors.accent }}
                    >
                        {userName} & {partnerName}
                    </motion.p>
                )}

                {/* Generated image preview */}
                {showContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {generating ? (
                            <div className="flex justify-center py-8">
                                <div className="w-10 h-10 border-4 border-red/30 border-t-red rounded-full animate-spin" />
                            </div>
                        ) : imageUrl ? (
                            <div className="rounded-xl overflow-hidden border border-white/[0.12]">
                                <img src={imageUrl} alt="Your result card" className="w-full" />
                            </div>
                        ) : null}
                    </motion.div>
                )}

                {/* Share buttons */}
                {showContent && !generating && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-3"
                    >
                        {/* Instagram */}
                        <button
                            onClick={handleInstagram}
                            className="w-full inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-xl active:scale-[0.97] bg-red text-white hover:bg-red-dark shadow-[0_4px_20px_rgba(220,38,38,0.3)] px-6 py-3.5 text-base"
                        >
                            📸 Share on Instagram
                        </button>

                        {/* WhatsApp */}
                        <button
                            onClick={handleWhatsApp}
                            className="w-full inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-xl active:scale-[0.97] bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-[0_4px_20px_rgba(37,211,102,0.3)] px-6 py-3.5 text-base"
                        >
                            📲 Share on WhatsApp
                        </button>

                        {/* Download */}
                        {imageUrl && (
                            <button
                                onClick={() => handleDownload(imageUrl, `joru-ka-gulaam-${userName}-${partnerName}.png`)}
                                className="w-full inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-xl active:scale-[0.97] bg-white/[0.06] border border-white/[0.1] text-white/90 hover:text-white hover:bg-white/[0.1] px-6 py-3.5 text-base"
                            >
                                Download Image 📥
                            </button>
                        )}

                        {/* Native share */}
                        {typeof navigator !== 'undefined' && 'share' in navigator && (
                            <button
                                onClick={handleNativeShare}
                                className="w-full inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-xl active:scale-[0.97] bg-white/[0.06] border border-white/[0.1] text-white/90 hover:text-white hover:bg-white/[0.1] px-6 py-3.5 text-base"
                            >
                                Share More 📤
                            </button>
                        )}

                        {/* Divider + CTA */}
                        <div className="pt-3 border-t border-white/[0.12]">
                            <button
                                onClick={onRestart}
                                className="w-full inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 rounded-xl active:scale-[0.97] bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 text-lg shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
                            >
                                🎯 Dobara Try Karo!
                            </button>
                            <p className="text-xs text-center text-white/30 mt-2">
                                Apne friends ko bhi test karo! 😏
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
