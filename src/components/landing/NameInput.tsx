import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";

interface NameInputProps {
    onSubmit: (userName: string, partnerName: string) => void;
    onBack: () => void;
}

export default function NameInput({ onSubmit, onBack }: NameInputProps) {
    const [userName, setUserName] = useState("");
    const [partnerName, setPartnerName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimUser = userName.trim();
        const trimPartner = partnerName.trim();

        if (trimUser.length < 2 || trimPartner.length < 2) {
            setError("Dono naam daal do yaar — kam se kam 2 characters 😅");
            return;
        }

        setError("");
        onSubmit(trimUser, trimPartner);
    };

    return (
        <main className="flex-1 flex flex-col items-center justify-center px-5 pb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm"
            >
                <GlassCard padding="lg">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="text-center mb-2">
                            <span className="text-4xl block mb-2">💑</span>
                            <h2 className="font-heading text-2xl font-bold text-white">
                                Naam Batao
                            </h2>
                            <p className="text-sm text-white/50 mt-1">
                                Dono ke naam daal do — result mein use honge
                            </p>
                        </div>

                        {/* User name */}
                        <div>
                            <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">
                                Tera Naam
                            </label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Apna naam likho..."
                                className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red/50 focus:bg-white/[0.08] transition-all text-base"
                                maxLength={30}
                                autoFocus
                            />
                        </div>

                        {/* Partner name */}
                        <div>
                            <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">
                                Partner Ka Naam
                            </label>
                            <input
                                type="text"
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                placeholder="Partner ka naam likho..."
                                className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red/50 focus:bg-white/[0.08] transition-all text-base"
                                maxLength={30}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-xl active:scale-[0.97] bg-red text-white hover:bg-red-dark shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_4px_28px_rgba(220,38,38,0.5)] px-8 py-4 text-lg"
                        >
                            Aage Badho →
                        </button>

                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full text-center text-sm text-white/40 hover:text-white/60 transition-colors"
                        >
                            ← Wapas Jao
                        </button>
                    </form>
                </GlassCard>
            </motion.div>
        </main>
    );
}
