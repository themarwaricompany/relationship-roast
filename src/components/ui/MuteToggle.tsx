"use client";

import { useState, useEffect } from "react";
import { isMuted, toggleMute, activateSounds } from "@/lib/sounds";

export default function MuteToggle() {
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        setMuted(isMuted());
    }, []);

    const handleToggle = async () => {
        await activateSounds();
        const newMuted = await toggleMute();
        setMuted(newMuted);
    };

    return (
        <button
            onClick={handleToggle}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.07] border border-white/[0.12] text-lg transition-all hover:bg-white/[0.12] active:scale-90"
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            title={muted ? "Unmute" : "Mute"}
        >
            {muted ? "🔇" : "🔊"}
        </button>
    );
}
