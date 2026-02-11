import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/lib/quizStore';
import { calculateScores, getTitle, getComboTitle, categoryInfo, getQuestionsForStatus } from '@/data/questions';

const categoryKeys = ['kitchen', 'remote', 'paisa', 'argument', 'jealousy'] as const;

const mockVerdicts: Record<string, string> = {
  kitchen: 'Kitchen mein toh clear hai kaun boss hai aur kaun Swiggy pe order deta hai. Ek chef hai, ek food critic — bas review dena aata hai! 🍽️',
  remote: 'Remote control ke liye daily Mahabharat hoti hai. Ek binge-watcher hai, ek background noise pe sone wala. Classic! 📺',
  paisa: 'Paise ke maamle mein ek finance minister hai aur ek professional shopaholic. EMI pe EMI chal rahi hai! 💸',
  argument: 'Ladai mein ek pro boxer hai aur ek professional sorry-bolta/bolti hai. Referee chahiye tum dono ko! 🥊',
  jealousy: 'Social media pe ek FBI agent hai aur ek "main toh chill hoon" wala/wali. Chill hai par notification check zaroor karega/karegi! 🕵️',
};

const Results = () => {
  const navigate = useNavigate();
  const store = useQuizStore();
  const [revealStage, setRevealStage] = useState(0); // 0=loading, 1=scores, 2=titles, 3+=categories
  const [displayScoreA, setDisplayScoreA] = useState(0);
  const [displayScoreB, setDisplayScoreB] = useState(0);

  const scoreA = useMemo(() => calculateScores(store.partnerAAnswers, 'a'), [store.partnerAAnswers]);
  const scoreB = useMemo(() => calculateScores(store.partnerBAnswers, 'b'), [store.partnerBAnswers]);
  const titleA = getTitle(scoreA, store.partnerAGender);
  const titleB = getTitle(scoreB, store.partnerBGender);
  const comboTitle = getComboTitle(scoreA, scoreB);

  const loadingMessages = [
    'Tumhare answers analyze ho rahe hain... 🔍',
    'AI ko hassi aa rahi hai tumhare answers padh ke 😂',
    'Gulaam score calculate ho raha hai... 📊',
    'Results almost ready... screenshot lene ki tayyari karo 📸',
  ];
  const [loadingMsg, setLoadingMsg] = useState(0);

  useEffect(() => {
    if (store.status !== 'completed') {
      navigate('/');
      return;
    }

    // Loading phase
    const msgInterval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % loadingMessages.length);
    }, 1200);

    const revealTimer = setTimeout(() => {
      clearInterval(msgInterval);
      setRevealStage(1);
    }, 3500);

    return () => {
      clearInterval(msgInterval);
      clearTimeout(revealTimer);
    };
  }, []);

  // Score count-up animation
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
    if (revealStage < 2) return;
    if (revealStage >= 2 + categoryKeys.length) return;

    const timer = setTimeout(() => {
      setRevealStage((prev) => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [revealStage]);

  const handleNewQuiz = () => {
    store.reset();
    navigate('/');
  };

  if (store.status !== 'completed') return null;

  // Loading screen
  if (revealStage === 0) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
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
            exit={{ opacity: 0 }}
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-heading font-black">
            <span className="text-primary text-glow-pink">{store.partnerAName}</span>
            {' '}&{' '}
            <span className="text-secondary text-glow-blue">{store.partnerBName}</span>
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">Gulaam Score Results 🫡</p>
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
            <p className="text-5xl font-heading font-black text-primary text-glow-pink">
              {displayScoreA}
            </p>
            <p className="text-xs text-muted-foreground font-body mt-1">/ 100</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 text-center border-glow-blue">
            <p className="text-sm text-muted-foreground font-body mb-1">{store.partnerBName}</p>
            <p className="text-5xl font-heading font-black text-secondary text-glow-blue">
              {displayScoreB}
            </p>
            <p className="text-xs text-muted-foreground font-body mt-1">/ 100</p>
          </div>
        </motion.div>

        {/* Titles */}
        {revealStage >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 space-y-2"
          >
            <p className="font-body text-sm">
              <span className="text-primary font-semibold">{store.partnerAName}</span>:{' '}
              <span className="text-foreground">{titleA}</span>
            </p>
            <p className="font-body text-sm">
              <span className="text-secondary font-semibold">{store.partnerBName}</span>:{' '}
              <span className="text-foreground">{titleB}</span>
            </p>
            {comboTitle && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-lg font-heading font-bold text-accent mt-3 text-glow-green"
              >
                {comboTitle}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Category Verdicts */}
        <div className="space-y-3 mb-8">
          {categoryKeys.map((catKey, i) => {
            const stageNeeded = 3 + i;
            if (revealStage < stageNeeded) return null;
            const info = categoryInfo[catKey];
            return (
              <motion.div
                key={catKey}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{info.emoji}</span>
                  <span className="text-sm font-heading font-bold text-foreground">{info.label}</span>
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {mockVerdicts[catKey]}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Share Section — appears after all categories revealed */}
        {revealStage >= 3 + categoryKeys.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="text-center text-sm text-muted-foreground font-body mb-4">
              Share your results! 📸
            </p>

            <button className="w-full py-3.5 rounded-full font-heading font-bold bg-accent text-accent-foreground transition-all hover:brightness-110">
              📥 Download Scorecard
            </button>

            <button className="w-full py-3.5 rounded-full font-heading font-bold bg-neon-green/90 text-background transition-all hover:brightness-110">
              💬 Share on WhatsApp
            </button>

            <button
              onClick={handleNewQuiz}
              className="w-full py-3.5 rounded-full font-heading font-bold border border-border text-muted-foreground transition-all hover:border-muted-foreground/50"
            >
              🔄 Challenge Another Couple
            </button>

            <p className="text-center text-xs text-muted-foreground/50 font-body pt-4">
              jorukagulaam.com
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Results;
