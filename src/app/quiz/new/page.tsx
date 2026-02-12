"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Background from "@/components/shared/Background";
import Header from "@/components/shared/Header";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { COLLEGES } from "@/lib/colleges";
import { activateSounds } from "@/lib/sounds";
import type { Gender, RelationshipStatus } from "@/types";

export default function QuizSetup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [yourName, setYourName] = useState("");
    const [partnerName, setPartnerName] = useState("");
    const [yourGender, setYourGender] = useState<Gender | "">("");
    const [partnerGender, setPartnerGender] = useState<Gender | "">("");
    const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus | "">("");
    const [college, setCollege] = useState("");
    const [otherCollege, setOtherCollege] = useState("");


    const canSubmit =
        yourName.trim() &&
        partnerName.trim() &&
        yourGender &&
        partnerGender &&
        relationshipStatus &&
        (college || otherCollege);

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setLoading(true);
        setError("");

        // Activate sounds on first interaction
        await activateSounds();

        try {

            // Create session
            const res = await fetch("/api/quiz/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    partnerAName: yourName.trim(),
                    partnerBName: partnerName.trim(),
                    partnerAGender: yourGender,
                    partnerBGender: partnerGender,
                    relationshipStatus,
                    college: college === "Other" ? otherCollege.trim() : college,

                }),
            });

            if (!res.ok) throw new Error("Failed to create quiz session");

            const data = await res.json();
            router.push(`/quiz/${data.sessionId}?partner=a`);
        } catch (err) {
            setError("Kuch gadbad ho gayi! Dobara try karo.");
            console.error("Create session error:", err);
        }

        setLoading(false);
    };

    const inputClass =
        "w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-white font-medium placeholder:text-text-muted focus:outline-none focus:border-red/50 focus:ring-2 focus:ring-red/20 transition-all text-base";

    const selectClass =
        "w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-white font-medium focus:outline-none focus:border-red/50 focus:ring-2 focus:ring-red/20 transition-all text-base appearance-none";

    return (
        <Background>
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 flex flex-col items-center justify-center px-5 pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        {/* Title */}
                        <div className="text-center mb-6">
                            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white mb-2">
                                Quiz Setup 🫡
                            </h1>
                            <p className="text-sm text-text-muted">
                                Apni aur partner ki details bharo
                            </p>
                        </div>

                        <GlassCard padding="lg">
                            <div className="space-y-4">
                                {/* Names */}
                                <div>
                                    <label className="text-xs text-text-muted mb-1.5 block font-medium">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Tumhara naam"
                                        value={yourName}
                                        onChange={(e) => setYourName(e.target.value)}
                                        maxLength={25}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-text-muted mb-1.5 block font-medium">
                                        Partner&apos;s Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Partner ka naam"
                                        value={partnerName}
                                        onChange={(e) => setPartnerName(e.target.value)}
                                        maxLength={25}
                                        className={inputClass}
                                    />
                                </div>

                                {/* Genders */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-text-muted mb-1.5 block font-medium">
                                            Your Gender
                                        </label>
                                        <select
                                            value={yourGender}
                                            onChange={(e) => setYourGender(e.target.value as Gender)}
                                            className={selectClass}
                                        >
                                            <option value="" disabled>
                                                Select
                                            </option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="nonbinary">Non-binary</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-text-muted mb-1.5 block font-medium">
                                            Partner Gender
                                        </label>
                                        <select
                                            value={partnerGender}
                                            onChange={(e) => setPartnerGender(e.target.value as Gender)}
                                            className={selectClass}
                                        >
                                            <option value="" disabled>
                                                Select
                                            </option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="nonbinary">Non-binary</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Relationship Status */}
                                <div>
                                    <label className="text-xs text-text-muted mb-1.5 block font-medium">
                                        Relationship Status
                                    </label>
                                    <select
                                        value={relationshipStatus}
                                        onChange={(e) =>
                                            setRelationshipStatus(e.target.value as RelationshipStatus)
                                        }
                                        className={selectClass}
                                    >
                                        <option value="" disabled>
                                            Select status
                                        </option>
                                        <option value="dating">💑 Dating</option>
                                        <option value="married">💍 Married</option>
                                        <option value="livein">🏠 Live-in</option>
                                    </select>
                                </div>

                                {/* College */}
                                <div>
                                    <label className="text-xs text-text-muted mb-1.5 block font-medium">
                                        College / City
                                    </label>
                                    <select
                                        value={college}
                                        onChange={(e) => setCollege(e.target.value)}
                                        className={selectClass}
                                    >
                                        <option value="" disabled>
                                            Select college
                                        </option>
                                        {COLLEGES.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                    {college === "Other" && (
                                        <input
                                            type="text"
                                            placeholder="Apna college / city type karo"
                                            value={otherCollege}
                                            onChange={(e) => setOtherCollege(e.target.value)}
                                            maxLength={50}
                                            className={`${inputClass} mt-2`}
                                        />
                                    )}
                                </div>



                                {/* Error */}
                                {error && (
                                    <p className="text-sm text-red text-center">{error}</p>
                                )}

                                {/* Submit */}
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    onClick={handleSubmit}
                                    loading={loading}
                                    disabled={!canSubmit}
                                >
                                    Quiz Shuru Karo →
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                </main>
            </div>
        </Background>
    );
}
