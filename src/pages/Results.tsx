import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/lib/quizStore';
import { generateAIResult } from '@/lib/quizApi';
import { getTitle, getComboTitle, categoryInfo } from '@/data/questions';
import { toast } from 'sonner';

const categoryKeys = ['kitchen', 'remote', 'paisa', 'argument', 'jealousy'] as const;

interface AIResult {
  partner_a_score: number;
  partner_b_score: number;
  partner_a_title: string;
  partner_b_title: string;
  tagline: string;
  category_verdicts: Record<string, string>;
  overall_verdict: string;
}

const Results = () => {
  const navigate = useNavigate();
  const store = useQuizStore();
  const [revealStage, setRevealStage] = useState(0);
  const [displayScoreA, setDisplayScoreA] = useState(0);
  const [displayScoreB, setDisplayScoreB] = useState(0);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiError, setAiError] = useState(false);

  const loadingMessages = [
    'Tumhare answers analyze ho rahe hain... 🔍',
    'AI ko hassi aa rahi hai tumhare answers padh ke 😂',
    'Gulaam score calculate ho raha hai... 📊',
    'Results almost ready... screenshot lene ki tayyari karo 📸',
  ];
  const [loadingMsg, setLoadingMsg] = useState(0);

  useEffect(() => {
    if (store.status !== 'generating' && store.status !== 'completed') {
      navigate('/');
      return;
    }

    const msgInterval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % loadingMessages.length);
    }, 1200);

    // Generate AI result
    if (store.sessionId) {
      generateAIResult(store.sessionId)
        .then((result) => {
          setAiResult(result as AIResult);
          store.setStatus('completed');
          clearInterval(msgInterval);
          setRevealStage(1);
        })
        .catch((err) => {
          console.error('AI generation failed:', err);
          setAiError(true);
          clearInterval(msgInterval);
          // Fallback to local scores
          setRevealStage(1);
          toast.error('AI was too busy laughing — showing quick results! 😂');
        });
    }

    return () => clearInterval(msgInterval);
  }, []);

  const scoreA = aiResult?.partner_a_score ?? (store.partnerAAnswers ? Math.round(Object.values(store.partnerAAnswers).filter(v => v === 'b').length / Math.max(Object.keys(store.partnerAAnswers).length, 1) * 100) : 50);
  const scoreB = aiResult?.partner_b_score ?? (store.partnerBAnswers ? Math.round(Object.values(store.partnerBAnswers).filter(v => v === 'b').length / Math.max(Object.keys(store.partnerBAnswers).length, 1) * 100) : 50);
  const titleA = aiResult?.partner_a_title ?? getTitle(scoreA, store.partnerAGender);
  const titleB = aiResult?.partner_b_title ?? getTitle(scoreB, store.partnerBGender);
  const comboTitle = getComboTitle(scoreA, scoreB);

  // Score count-up
  useEffect(() => {
    if (revealStage < 1) return;
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setDisplayScoreA(Math.round((scoreA * step) / steps));
      setDisplayScoreB(Math.round((scoreB * step) / steps));
      if (step >= steps) {
        clearInterval(interval);
        setTimeout(() => setRevealStage(2), 500);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [revealStage, scoreA, scoreB]);

  // Auto-reveal categories
  useEffect(() => {
    if (revealStage < 2 || revealStage >= 2 + categoryKeys.length) return;
    const timer = setTimeout(() => setRevealStage((prev) => prev + 1), 800);
    return () => clearTimeout(timer);
  }, [revealStage]);

  const handleNewQuiz = () => {
    store.reset();
    navigate('/');
  };

  const handleWhatsAppShare = () => {
    const msg = encodeURIComponent(
      `Hamara Joru Ka Gulaam score dekho 😂🫡\n${store.partnerAName}: ${scoreA}/100 — ${titleA}\n${store.partnerBName}: ${scoreB}/100 — ${titleB}\n\nApna score nikalo → ${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  if (store.status !== 'generating' && store.status !== 'completed') return null;

  // Loading screen
  if (revealStage === 0) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="text-5xl mb-6 inline-block"
          >
            ⚡
          </motion.div>
          <motion.p
            key={loadingMsg}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-body text-muted-foreground"
          >
            {loadingMessages[loadingMsg]}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-gradient px-4 py-8">
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl font-heading font-black">
            <span className="text-primary text-glow-pink">{store.partnerAName}</span>
            {' '}&{' '}
            <span className="text-secondary text-glow-blue">{store.partnerBName}</span>
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">Gulaam Score Results 🫡</p>
          {aiResult?.tagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-primary/80 font-body mt-2 italic"
            >
              "{aiResult.tagline}"
            </motion.p>
          )}
        </motion.div>

        {/* Scores */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-card border border-border rounded-2xl p-5 text-center border-glow-pink">
            <p className="text-sm text-muted-foreground font-body mb-1">{store.partnerAName}</p>
            <p className="text-5xl font-heading font-black text-primary text-glow-pink">{displayScoreA}</p>
            <p className="text-xs text-muted-foreground font-body mt-1">/ 100</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 text-center border-glow-blue">
            <p className="text-sm text-muted-foreground font-body mb-1">{store.partnerBName}</p>
            <p className="text-5xl font-heading font-black text-secondary text-glow-blue">{displayScoreB}</p>
            <p className="text-xs text-muted-foreground font-body mt-1">/ 100</p>
          </div>
        </motion.div>

        {/* Titles */}
        {revealStage >= 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 space-y-2">
            <p className="font-body text-sm">
              <span className="text-primary font-semibold">{store.partnerAName}</span>: {titleA}
            </p>
            <p className="font-body text-sm">
              <span className="text-secondary font-semibold">{store.partnerBName}</span>: {titleB}
            </p>
            {comboTitle && (
              <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-lg font-heading font-bold text-accent mt-3 text-glow-green">
                {comboTitle}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Overall verdict */}
        {revealStage >= 2 && aiResult?.overall_verdict && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl p-4 mb-4">
            <p className="text-sm text-foreground/90 font-body leading-relaxed italic">
              {aiResult.overall_verdict}
            </p>
          </motion.div>
        )}

        {/* Category Verdicts */}
        <div className="space-y-3 mb-8">
          {categoryKeys.map((catKey, i) => {
            if (revealStage < 3 + i) return null;
            const info = categoryInfo[catKey];
            const verdict = aiResult?.category_verdicts?.[catKey];
            return (
              <motion.div key={catKey} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{info.emoji}</span>
                  <span className="text-sm font-heading font-bold text-foreground">{info.label}</span>
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {verdict || 'AI is still thinking about this one... 🤔'}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Share Section */}
        {revealStage >= 3 + categoryKeys.length && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <p className="text-center text-sm text-muted-foreground font-body mb-4">Share your results! 📸</p>

            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3.5 rounded-full font-heading font-bold bg-neon-green/90 text-background transition-all hover:brightness-110"
            >
              💬 Share on WhatsApp
            </button>

            <button
              onClick={handleNewQuiz}
              className="w-full py-3.5 rounded-full font-heading font-bold border border-border text-muted-foreground transition-all hover:border-muted-foreground/50"
            >
              🔄 Challenge Another Couple
            </button>

            <p className="text-center text-xs text-muted-foreground/50 font-body pt-4">jorukagulaam.com</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Results;
