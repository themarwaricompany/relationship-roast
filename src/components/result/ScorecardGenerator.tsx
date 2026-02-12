"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";

interface ScorecardGeneratorProps {
    sessionId: string;
    onScorecardGenerated: (url: string) => void;
    existingScorecardUrl: string | null;
}

export default function ScorecardGenerator({
    sessionId,
    onScorecardGenerated,
    existingScorecardUrl,
}: ScorecardGeneratorProps) {
    const [generating, setGenerating] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [scorecardUrl, setScorecardUrl] = useState<string | null>(existingScorecardUrl);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError("Photo 5MB se choti honi chahiye");
            return;
        }

        setPhoto(file);
        setError("");

        // Create preview
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleGenerate = async (withPhoto: boolean) => {
        setGenerating(true);
        setError("");

        try {
            let photoBase64: string | undefined;
            let photoMimeType: string | undefined;

            if (withPhoto && photo) {
                // Convert photo to base64 (browser-compatible)
                const buffer = await photo.arrayBuffer();
                const bytes = new Uint8Array(buffer);
                let binary = "";
                for (let i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                photoBase64 = btoa(binary);
                photoMimeType = photo.type;
            }

            const res = await fetch("/api/generate-scorecard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    photoBase64,
                    photoMimeType,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Generation failed");
            }

            const data = await res.json();
            setScorecardUrl(data.scorecardUrl);
            onScorecardGenerated(data.scorecardUrl);
        } catch (err) {
            console.error("Scorecard generation error:", err);
            setError("Scorecard generate nahi hua 😔 Dobara try karo!");
        }

        setGenerating(false);
    };

    const handleDownload = async () => {
        if (!scorecardUrl) return;
        try {
            const response = await fetch(scorecardUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `joru-ka-gulaam-scorecard.png`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <GlassCard padding="lg">
                <div className="text-center space-y-4">
                    <span className="text-3xl block">🎬</span>
                    <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-gold uppercase tracking-wider">
                        Scorecard Banao
                    </h3>
                    <p className="text-xs text-text-muted">
                        K-Drama style mein apna scorecard generate karo — share karo socials pe! ✨
                    </p>

                    <AnimatePresence mode="wait">
                        {/* Generated scorecard preview */}
                        {scorecardUrl && !generating && (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-3"
                            >
                                <div className="rounded-xl overflow-hidden border border-white/[0.12]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={scorecardUrl}
                                        alt="Generated scorecard"
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        fullWidth
                                        onClick={handleDownload}
                                    >
                                        Download 📥
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        fullWidth
                                        onClick={() => {
                                            setScorecardUrl(null);
                                            setPhoto(null);
                                            setPhotoPreview(null);
                                        }}
                                    >
                                        Regenerate 🔄
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Generating state */}
                        {generating && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-8 space-y-4"
                            >
                                <div className="flex justify-center">
                                    <div className="w-12 h-12 border-4 border-red/30 border-t-red rounded-full animate-spin" />
                                </div>
                                <p className="text-sm text-text-secondary animate-pulse">
                                    K-Drama magic chal rahi hai... ✨
                                </p>
                                <p className="text-xs text-text-muted">
                                    ~15-20 seconds lagenge
                                </p>
                            </motion.div>
                        )}

                        {/* Generate options */}
                        {!scorecardUrl && !generating && (
                            <motion.div
                                key="options"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-3"
                            >
                                {/* Photo upload area */}
                                <div className="space-y-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handlePhotoSelect}
                                        className="hidden"
                                    />

                                    {photoPreview ? (
                                        <div className="relative">
                                            <div className="rounded-xl overflow-hidden border border-gold/30">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={photoPreview}
                                                    alt="Selected photo"
                                                    className="w-full max-h-48 object-cover"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setPhoto(null);
                                                    setPhotoPreview(null);
                                                    if (fileInputRef.current)
                                                        fileInputRef.current.value = "";
                                                }}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full py-4 rounded-xl border-2 border-dashed border-white/[0.15] text-text-muted hover:border-gold/40 hover:text-gold transition-all text-sm"
                                        >
                                            📸 Couple photo upload karo (optional)
                                        </button>
                                    )}
                                </div>

                                {/* Generate buttons */}
                                {photo ? (
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={() => handleGenerate(true)}
                                    >
                                        Photo ke saath Generate ✨
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={() => handleGenerate(false)}
                                    >
                                        Scorecard Generate Karo 🎬
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red text-center">{error}</p>
                    )}
                </div>
            </GlassCard>
        </motion.div>
    );
}
