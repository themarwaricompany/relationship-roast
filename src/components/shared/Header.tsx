"use client";

import MuteToggle from "@/components/ui/MuteToggle";
import Link from "next/link";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-5 py-4">
            <Link href="/" className="flex items-center gap-2 group">
                <span className="text-2xl">🫡</span>
                <span className="text-xs text-text-muted font-mono tracking-tight group-hover:text-text-secondary transition-colors">
                    jorukagulaam.com
                </span>
            </Link>
            <MuteToggle />
        </header>
    );
}
