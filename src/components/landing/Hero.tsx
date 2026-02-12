"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
    return (
        <main className="flex-1 flex flex-col items-center justify-center px-5 pb-8">
            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-bold text-white text-center tracking-tight leading-none mb-2"
            >
                JORU KA
                <br />
                <span className="text-gradient-red bg-clip-text" style={{ WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(135deg, #DC2626, #F87171)' }}>GULAAM</span>
            </motion.h1>

            {/* Hero Image */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="animate-float my-6"
            >
                <div className="relative rounded-2xl overflow-hidden w-[260px] h-[360px] md:w-[300px] md:h-[420px] shadow-[0_8px_40px_rgba(220,38,38,0.2)] border border-white/[0.1]">
                    <Image
                        src="/images/hero.png"
                        alt="Joru Ka Gulaam — Couple's Quiz"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Warm overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,5,5,0.4)] to-transparent" />
                </div>
            </motion.div>

            {/* Sub-headline */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-text-secondary text-center text-base md:text-lg mb-8 font-medium"
            >
                Pata lagao kaun hai asli{" "}
                <span className="text-red font-bold">Gulaam</span> 🫡
            </motion.p>

            {/* CTA Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="w-full max-w-sm"
            >
                <Link href="/quiz/new">
                    <Button variant="primary" size="lg" fullWidth>
                        Quiz Shuru Karo →
                    </Button>
                </Link>
            </motion.div>
        </main>
    );
}
