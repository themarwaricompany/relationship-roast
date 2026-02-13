import { motion } from "framer-motion";

interface HeroProps {
    onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
    return (
        <main className="flex-1 flex flex-col items-center justify-center px-5 pb-8">
            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="font-heading text-5xl md:text-7xl font-bold text-white text-center tracking-tight leading-none mb-2"
            >
                JORU KA
                <br />
                <span
                    className="bg-clip-text"
                    style={{
                        WebkitTextFillColor: 'transparent',
                        backgroundImage: 'linear-gradient(135deg, #DC2626, #F87171)',
                    }}
                >
                    GULAAM
                </span>
            </motion.h1>

            {/* Hero Image */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="animate-float my-6"
            >
                <div className="relative rounded-2xl overflow-hidden w-[260px] h-[360px] md:w-[300px] md:h-[420px] shadow-[0_8px_40px_rgba(220,38,38,0.2)] border border-white/[0.1]">
                    <img
                        src="/images/hero.png"
                        alt="Joru Ka Gulaam — Couple's Quiz"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,5,5,0.4)] to-transparent" />
                </div>
            </motion.div>

            {/* Sub-headline */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-white/60 text-center text-base md:text-lg mb-3 font-medium"
            >
                Pata karo kaun hai asli{" "}
                <span className="text-red font-bold">Gulaam</span> 👀
            </motion.p>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-white/40 text-center text-sm mb-8 max-w-xs"
            >
                Answer 5 quick questions. Get your relationship title. Share the roast.
            </motion.p>

            {/* CTA Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="w-full max-w-sm"
            >
                <button
                    onClick={onStart}
                    className="w-full inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-xl active:scale-[0.97] bg-red text-white hover:bg-red-dark shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_4px_28px_rgba(220,38,38,0.5)] px-8 py-4 text-lg"
                >
                    Shuru Karo 🔥
                </button>
            </motion.div>

            {/* How it works — simplified */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="mt-10 flex gap-6 text-center"
            >
                {[
                    { emoji: "📝", label: "Quiz Bharo" },
                    { emoji: "😂", label: "Result Dekho" },
                    { emoji: "📲", label: "Share Karo" },
                ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{step.emoji}</span>
                        <span className="text-xs text-white/40 font-medium">{step.label}</span>
                    </div>
                ))}
            </motion.div>
        </main>
    );
}
