"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import confetti from "canvas-confetti";

// ─── Quiz Data ────────────────────────────────────────────────────────────────
const QUIZ_DATA = [
  {
    id: 1,
    question: "Do you reply to their texts within 30 seconds?",
    emoji: "📝",
    points: 10,
  },
  {
    id: 2,
    question: "Do you have their fingerprint on your phone?",
    emoji: "📲",
    points: 20,
  },
  {
    id: 3,
    question: "Do you cancel plans with friends if they call?",
    emoji: "🫡",
    points: 15,
  },
  {
    id: 4,
    question: "Do you know their food order by heart?",
    emoji: "🍟",
    points: 5,
  },
  {
    id: 5,
    question: "Have you ever apologized when it was THEIR mistake?",
    emoji: "🤡",
    points: 25,
  },
];

const MAX_POINTS = QUIZ_DATA.reduce((sum, q) => sum + q.points, 0);

// ─── Types ────────────────────────────────────────────────────────────────────
type AppView = "LANDING" | "QUIZ" | "RESULT";

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function Home() {
  const [view, setView] = useState<AppView>("LANDING");
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [score, setScore] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const handleStartQuiz = () => {
    if (yourName.trim() && partnerName.trim()) {
      setScore(0);
      setCurrentCard(0);
      setAnswers({});
      setView("QUIZ");
    }
  };

  const handleAnswer = (yes: boolean) => {
    const question = QUIZ_DATA[currentCard];
    const newAnswers = { ...answers, [question.id]: yes };
    setAnswers(newAnswers);

    const newScore = yes ? score + question.points : score;
    setScore(newScore);

    if (currentCard < QUIZ_DATA.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      setView("RESULT");
    }
  };

  const handleRestart = () => {
    setView("LANDING");
    setYourName("");
    setPartnerName("");
    setScore(0);
    setCurrentCard(0);
    setAnswers({});
  };

  const scorePercent = Math.round((score / MAX_POINTS) * 100);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/images/bg.png')" }}
    >
      <AnimatePresence mode="wait">
        {view === "LANDING" && (
          <LandingView
            key="landing"
            yourName={yourName}
            partnerName={partnerName}
            setYourName={setYourName}
            setPartnerName={setPartnerName}
            onStart={handleStartQuiz}
          />
        )}
        {view === "QUIZ" && (
          <QuizView
            key="quiz"
            currentCard={currentCard}
            onAnswer={handleAnswer}
            yourName={yourName}
          />
        )}
        {view === "RESULT" && (
          <ResultView
            key="result"
            yourName={yourName}
            partnerName={partnerName}
            scorePercent={scorePercent}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── View 1: Landing ──────────────────────────────────────────────────────────
function LandingView({
  yourName,
  partnerName,
  setYourName,
  setPartnerName,
  onStart,
}: {
  yourName: string;
  partnerName: string;
  setYourName: (v: string) => void;
  setPartnerName: (v: string) => void;
  onStart: () => void;
}) {
  const canStart = yourName.trim().length > 0 && partnerName.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4">
        <span className="text-2xl">🫡</span>
        <span className="text-xs text-ink/40 font-mono tracking-tight">
          jorukagulaam.com
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 pb-8">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-[Clash_Display] text-5xl md:text-7xl font-bold text-ink text-center tracking-tight leading-none mb-2"
        >
          JORU KA
          <br />
          <span className="text-red">GULAAM</span>
        </motion.h1>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="animate-float my-6"
        >
          <div className="relative border-4 border-black rounded-xl shadow-neo overflow-hidden w-[260px] h-[360px] md:w-[300px] md:h-[420px]">
            <Image
              src="/images/hero.png"
              alt="Joru Ka Gulaam - Love birds"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-ink/60 text-center text-base md:text-lg mb-8 font-medium"
        >
          Pata lagao kaun hai asli{" "}
          <span className="text-red font-bold">Gulaam</span> 🫡
        </motion.p>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-full max-w-sm space-y-3"
        >
          <input
            type="text"
            placeholder="Your Name"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            maxLength={25}
            className="w-full px-4 py-3.5 rounded-xl border-2 border-ink/10 bg-white/70 backdrop-blur-sm text-ink font-medium placeholder:text-ink/30 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 transition-all text-base"
          />
          <input
            type="text"
            placeholder="Partner's Name"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            maxLength={25}
            className="w-full px-4 py-3.5 rounded-xl border-2 border-ink/10 bg-white/70 backdrop-blur-sm text-ink font-medium placeholder:text-ink/30 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 transition-all text-base"
          />
          <button
            onClick={onStart}
            disabled={!canStart}
            className={`w-full py-4 rounded-xl font-[Clash_Display] font-bold text-lg transition-all duration-300 ${canStart
                ? "bg-red text-white shadow-neo active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-dark"
                : "bg-ink/10 text-ink/30 cursor-not-allowed"
              }`}
          >
            Quiz Shuru Karo →
          </button>
        </motion.div>
      </main>
    </motion.div>
  );
}

// ─── View 2: Quiz (Swipeable Cards) ──────────────────────────────────────────
function QuizView({
  currentCard,
  onAnswer,
  yourName,
}: {
  currentCard: number;
  onAnswer: (yes: boolean) => void;
  yourName: string;
}) {
  const question = QUIZ_DATA[currentCard];
  const [dragging, setDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setExitDirection("right");
      setTimeout(() => onAnswer(true), 300);
    } else if (info.offset.x < -threshold) {
      setExitDirection("left");
      setTimeout(() => onAnswer(false), 300);
    }
    setDragging(false);
  };

  // Reset exit direction for new card
  useEffect(() => {
    setExitDirection(null);
  }, [currentCard]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-5"
    >
      {/* Progress */}
      <div className="w-full max-w-sm mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink/50 font-medium">
            {yourName}&apos;s Turn
          </span>
          <span className="text-sm text-ink/50 font-medium">
            {currentCard + 1} / {QUIZ_DATA.length}
          </span>
        </div>
        <div className="w-full h-2 bg-ink/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-red rounded-full"
            initial={false}
            animate={{
              width: `${((currentCard + 1) / QUIZ_DATA.length) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Swipe hints */}
      <div className="flex items-center justify-between w-full max-w-sm mb-4 px-2">
        <span className="text-xs text-ink/30 font-medium">← Nah</span>
        <span className="text-xs text-ink/30 font-medium">Haan Ji →</span>
      </div>

      {/* Card Stack */}
      <div className="relative w-full max-w-sm h-[380px]">
        {/* Background cards for stack effect */}
        {QUIZ_DATA.slice(currentCard + 1, currentCard + 3).map((q, i) => (
          <div
            key={q.id}
            className="absolute inset-0 bg-white border-2 border-ink/10 rounded-2xl"
            style={{
              transform: `scale(${1 - (i + 1) * 0.05}) translateY(${(i + 1) * 8}px)`,
              zIndex: 10 - i,
              opacity: 1 - (i + 1) * 0.2,
            }}
          />
        ))}

        {/* Active swipeable card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragStart={() => setDragging(true)}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: exitDirection ? 0 : 1,
              scale: 1,
              y: 0,
              x: exitDirection === "left" ? -300 : exitDirection === "right" ? 300 : 0,
              rotate: exitDirection === "left" ? -15 : exitDirection === "right" ? 15 : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 bg-white border-3 border-black rounded-2xl shadow-neo flex flex-col items-center justify-center p-8 cursor-grab active:cursor-grabbing z-20 select-none"
            style={{ touchAction: "pan-y" }}
          >
            {/* Emoji */}
            <motion.span
              className="text-7xl mb-6"
              animate={dragging ? { scale: 1.1 } : { scale: 1 }}
            >
              {question.emoji}
            </motion.span>

            {/* Question */}
            <h2 className="font-[Clash_Display] text-xl md:text-2xl font-bold text-ink text-center leading-snug mb-8">
              {question.question}
            </h2>

            {/* Tap buttons (fallback for non-swipe) */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  setExitDirection("left");
                  setTimeout(() => onAnswer(false), 300);
                }}
                className="flex-1 py-3 rounded-xl border-2 border-ink/15 text-ink/60 font-bold text-sm hover:bg-ink/5 transition-colors active:scale-95"
              >
                Nope 👎
              </button>
              <button
                onClick={() => {
                  setExitDirection("right");
                  setTimeout(() => onAnswer(true), 300);
                }}
                className="flex-1 py-3 rounded-xl bg-red text-white font-bold text-sm hover:bg-red-dark transition-colors active:scale-95 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
              >
                Haan Ji 🫡
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Swipe instruction */}
      <p className="text-xs text-ink/25 mt-6 font-medium">
        Swipe ya button tap karo ↔️
      </p>
    </motion.div>
  );
}

// ─── View 3: Result Certificate ──────────────────────────────────────────────
function ResultView({
  yourName,
  partnerName,
  scorePercent,
  onRestart,
}: {
  yourName: string;
  partnerName: string;
  scorePercent: number;
  onRestart: () => void;
}) {
  const confettiDone = useRef(false);

  useEffect(() => {
    if (!confettiDone.current) {
      confettiDone.current = true;
      // Burst confetti
      const end = Date.now() + 2000;
      const colors = ["#FF3B30", "#FFD700", "#FF69B4", "#FF6347"];

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
    }
  }, []);

  const getTitle = (pct: number) => {
    if (pct >= 80) return "ULTIMATE GULAAM 🫡";
    if (pct >= 60) return "Pakka Gulaam 😏";
    if (pct >= 40) return "Part-Time Gulaam 🤔";
    if (pct >= 20) return "Thoda Gulaam 😅";
    return "Free Bird 🕊️";
  };

  const shareText = `🫡 ${yourName} is ${scorePercent}% Gulaam of ${partnerName}!\n\nPata lagao apna score: jorukagulaam.com`;
  const waLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-5 py-8"
    >
      {/* Certificate Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
        className="bg-white border-3 border-black rounded-2xl shadow-neo overflow-hidden w-full max-w-sm"
      >
        {/* Hero Image in Certificate */}
        <div className="relative w-full h-[280px]">
          <Image
            src="/images/hero.png"
            alt="Joru Ka Gulaam"
            fill
            className="object-cover"
          />
          {/* CERTIFIED Badge */}
          <div className="absolute top-3 right-3 bg-red text-white text-[10px] font-[Clash_Display] font-bold px-3 py-1.5 rounded-full shadow-lg rotate-3 border-2 border-white">
            CERTIFIED ✅
          </div>
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Certificate content */}
        <div className="px-6 pb-6 pt-2 text-center">
          {/* Score circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto -mt-12 bg-white border-3 border-black rounded-full flex items-center justify-center shadow-neo relative z-10"
          >
            <span className="font-[Clash_Display] text-2xl font-bold text-red">
              {scorePercent}%
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="font-[Clash_Display] text-2xl font-bold text-ink mt-3 mb-1"
          >
            {getTitle(scorePercent)}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-ink/60 text-sm mb-6"
          >
            <span className="font-bold text-ink">{yourName}</span> is{" "}
            <span className="font-bold text-red">{scorePercent}%</span> Gulaam
            of <span className="font-bold text-ink">{partnerName}</span>
          </motion.p>

          {/* Score bar */}
          <div className="w-full h-3 bg-ink/5 rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scorePercent}%` }}
              transition={{ delay: 1, duration: 1, ease: "easeOut" }}
              className="h-full bg-red rounded-full"
            />
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Partner ko bhejo 📲
            </a>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Joru Ka Gulaam Result",
                    text: shareText,
                    url: "https://jorukagulaam.com",
                  });
                } else {
                  navigator.clipboard.writeText(shareText);
                  alert("Result copied! 📋");
                }
              }}
              className="w-full py-3.5 rounded-xl border-2 border-ink/15 text-ink/70 font-bold text-sm hover:bg-ink/5 active:scale-95 transition-all"
            >
              Share Result ⬇️
            </button>
            <button
              onClick={onRestart}
              className="w-full py-3 text-ink/30 text-xs font-medium hover:text-ink/50 transition-colors"
            >
              Play Again →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
