"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

interface ShareSectionProps {
    sessionId: string;
    partnerAName: string;
    partnerBName: string;
    scoreA: number;
    scoreB: number;
    titleA: string;
    titleB: string;
    scorecardImageUrl: string | null;
}

export default function ShareSection({
    sessionId,
    partnerAName,
    partnerBName,
    scoreA,
    scoreB,
    titleA,
    titleB,
    scorecardImageUrl,
}: ShareSectionProps) {
    const [copied, setCopied] = useState(false);
    const [sharing, setSharing] = useState(false);

    const resultUrl = `https://jorukagulaam.com/result/${sessionId}`;
    const shareText = `Hamara Joru Ka Gulaam score 😂🫡\n${partnerAName}: ${scoreA}/100 — ${titleA}\n${partnerBName}: ${scoreB}/100 — ${titleB}\n\nApna score nikalo → jorukagulaam.com`;

    const handleNativeShare = async () => {
        setSharing(true);
        try {
            // Try sharing with image first
            if (scorecardImageUrl && navigator.share && navigator.canShare) {
                const imageBlob = await fetch(scorecardImageUrl).then((r) => r.blob());
                const file = new File([imageBlob], "gulaam-score.png", { type: "image/png" });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: "Joru Ka Gulaam Score 🫡",
                        text: shareText,
                    });
                    setSharing(false);
                    return;
                }
            }

            // Fallback: text-only share
            if (navigator.share) {
                await navigator.share({
                    title: "Joru Ka Gulaam Score 🫡",
                    text: shareText,
                    url: resultUrl,
                });
            }
        } catch (err) {
            // User cancelled or share failed — that's fine
            console.log("Share cancelled:", err);
        }
        setSharing(false);
    };

    const handleDownload = async () => {
        if (!scorecardImageUrl) return;
        try {
            const response = await fetch(scorecardImageUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `joru-ka-gulaam-${partnerAName}-${partnerBName}.png`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
        }
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(resultUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const input = document.createElement("input");
            input.value = resultUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const supportsNativeShare = typeof navigator !== "undefined" && !!navigator.share;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
        >
            {/* Primary: Native Share (mobile) */}
            {supportsNativeShare && (
                <Button variant="primary" fullWidth onClick={handleNativeShare} loading={sharing}>
                    Share 📤
                </Button>
            )}

            {/* Download card */}
            {scorecardImageUrl && (
                <Button variant="secondary" fullWidth onClick={handleDownload}>
                    Download Card 📥
                </Button>
            )}

            {/* WhatsApp */}
            <Button variant="whatsapp" fullWidth onClick={handleWhatsApp}>
                Share on WhatsApp 📲
            </Button>

            {/* Copy Link */}
            <Button variant="secondary" fullWidth onClick={handleCopyLink}>
                {copied ? "Copied! ✅" : "Copy Link 🔗"}
            </Button>

            {/* Challenge another couple */}
            <Button
                variant="ghost"
                fullWidth
                onClick={() => (window.location.href = "/quiz/new")}
            >
                Challenge Another Couple 🫡
            </Button>
        </motion.div>
    );
}
