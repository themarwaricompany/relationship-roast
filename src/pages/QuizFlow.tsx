import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/lib/quizStore';
import { getQuestionsForStatus, categoryInfo, calculateScores } from '@/data/questions';
import { submitPartnerAnswers } from '@/lib/quizApi';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Undo2, SkipForward } from 'lucide-react';

const optionLabels = ['A', 'B', 'C', 'D'] as const;
const optionKeys = ['a', 'b', 'c', 'd'] as const;

const QuizFlow = () => {
  const navigate = useNavigate();
  const store = useQuizStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = forward, -1 = backward
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = useMemo(
    () => getQuestionsForStatus(store.relationshipStatus),
    [store.relationshipStatus]
  );

  if (!store.partnerAName || !store.sessionId) {
    navigate('/quiz/new');
    return null;
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isPartnerA = store.currentPartner === 'a';
  const currentName = isPartnerA ? store.partnerAName : store.partnerBName;
  const currentAnswers = isPartnerA ? store.partnerAAnswers : store.partnerBAnswers;

  const currentAnswer = currentAnswers[currentQuestion.id] ?? null;
  const isSkipped = store.skippedQuestions.includes(currentQuestion.id);
  const isAnswered = currentAnswer !== null;
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < questions.length - 1;
  const isLastQuestion = currentIndex === questions.length - 1;

  const prevCategory = currentIndex > 0 ? questions[currentIndex - 1].category : null;
  const showCategoryHeader = currentQuestion.category !== prevCategory;

  // Check if all questions are either answered or skipped
  const allComplete = useMemo(() => {
    return questions.every(
      (q) => currentAnswers[q.id] !== undefined || store.skippedQuestions.includes(q.id)
    );
  }, [questions, currentAnswers, store.skippedQuestions]);

  const handleSelect = useCallback(
    (option: string) => {
      store.setAnswer(currentQuestion.id, option);
    },
    [store, currentQuestion.id]
  );

  const handleNext = useCallback(() => {
    if (canGoForward) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canGoForward]);

  const handleBack = useCallback(() => {
    if (canGoBack) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canGoBack]);

  const handleUndo = useCallback(() => {
    if (isAnswered) {
      store.removeAnswer(currentQuestion.id);
    }
  }, [isAnswered, store, currentQuestion.id]);

  const handleSkip = useCallback(() => {
    if (store.skipsRemaining <= 0) {
      toast.error('Skip limit reached! Bas 2 baar skip kar sakte ho 😏');
      return;
    }
    store.useSkip(currentQuestion.id);
    // Auto-advance if possible
    if (canGoForward) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [store, currentQuestion.id, canGoForward]);

  const handleFinish = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Filter out skipped questions from scoring
      const answeredOnly: Record<string, string> = {};
      for (const [qId, ans] of Object.entries(currentAnswers)) {
        if (!store.skippedQuestions.includes(qId)) {
          answeredOnly[qId] = ans;
        }
      }

      const score = calculateScores(answeredOnly, store.currentPartner);

      await submitPartnerAnswers(store.sessionId!, store.currentPartner, answeredOnly, score);

      if (isPartnerA) {
        store.completePartnerA();
        navigate('/quiz/waiting');
      } else {
        store.completePartnerB();
        navigate('/results');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save answers, please try again');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, currentAnswers, store, isPartnerA, navigate]);

  const cat = categoryInfo[currentQuestion.category];

  // Animation variants for directional slide
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 80 : -80,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -80 : 80,
    }),
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col px-4 py-6">
      <div className="max-w-md mx-auto w-full">
        {/* Header: Name + Progress Counter */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground font-body">
            {currentName}'s turn
          </span>
          <div className="flex items-center gap-3">
            {/* Skip counter badge */}
            <span
              className={`text-xs font-body px-2 py-0.5 rounded-full border transition-colors ${store.skipsRemaining > 0
                  ? 'border-neon-purple/50 text-neon-purple'
                  : 'border-muted-foreground/30 text-muted-foreground'
                }`}
            >
              ⚡ {store.skipsRemaining} skip{store.skipsRemaining !== 1 ? 's' : ''}
            </span>
            <span className="text-sm text-muted-foreground font-body">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-neon-gradient rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Category header */}
              {showCategoryHeader && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="text-sm font-body text-primary font-semibold">{cat.label}</span>
                </motion.div>
              )}

              {/* Skipped badge */}
              {isSkipped && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/15 border border-neon-purple/30 text-neon-purple text-xs font-body mb-3"
                >
                  <SkipForward className="w-3 h-3" />
                  Skipped
                </motion.div>
              )}

              {/* Question text */}
              <h2 className="text-xl md:text-2xl font-heading font-bold mb-8 leading-snug">
                {currentQuestion.questionText}
              </h2>

              {/* Answer options */}
              <div className="space-y-3">
                {optionKeys.map((key, i) => {
                  const isSelected = currentAnswer === key;
                  return (
                    <motion.button
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelect(key)}
                      disabled={isSkipped}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all font-body text-sm leading-relaxed ${isSkipped
                          ? 'bg-muted/30 border-border/50 text-foreground/40 cursor-not-allowed'
                          : isSelected
                            ? 'bg-primary/20 border-primary border-glow-pink text-foreground'
                            : 'bg-card border-border text-foreground/90 hover:border-muted-foreground/50 active:bg-card/80'
                        }`}
                    >
                      <span className="text-muted-foreground font-semibold mr-2">
                        {optionLabels[i]}.
                      </span>
                      {currentQuestion.options[key]}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="max-w-md mx-auto w-full mt-6">
        <div className="flex items-center justify-between gap-2">
          {/* Back button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            disabled={!canGoBack}
            className={`flex items-center gap-1 px-3 py-2.5 rounded-xl font-body text-sm transition-all ${canGoBack
                ? 'bg-card border border-border text-foreground/80 hover:border-muted-foreground/50 active:bg-card/80'
                : 'bg-muted/20 text-muted-foreground/40 cursor-not-allowed border border-transparent'
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </motion.button>

          {/* Center actions: Undo + Skip */}
          <div className="flex items-center gap-2">
            {/* Undo button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleUndo}
              disabled={!isAnswered}
              className={`flex items-center gap-1 px-3 py-2.5 rounded-xl font-body text-xs transition-all ${isAnswered
                  ? 'bg-card border border-border text-foreground/80 hover:border-neon-blue/50 active:bg-card/80'
                  : 'bg-muted/20 text-muted-foreground/40 cursor-not-allowed border border-transparent'
                }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
              Undo
            </motion.button>

            {/* Skip button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
              disabled={store.skipsRemaining <= 0 || isSkipped}
              className={`flex items-center gap-1 px-3 py-2.5 rounded-xl font-body text-xs transition-all ${store.skipsRemaining > 0 && !isSkipped
                  ? 'bg-neon-purple/10 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 active:bg-neon-purple/15'
                  : 'bg-muted/20 text-muted-foreground/40 cursor-not-allowed border border-transparent'
                }`}
            >
              <SkipForward className="w-3.5 h-3.5" />
              Skip
            </motion.button>
          </div>

          {/* Next / Finish button */}
          {isLastQuestion && allComplete ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleFinish}
              disabled={isSubmitting || (!isAnswered && !isSkipped)}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-body text-sm font-semibold transition-all ${isSubmitting
                  ? 'bg-primary/50 text-primary-foreground/70 cursor-wait'
                  : isAnswered || isSkipped
                    ? 'bg-primary text-primary-foreground box-glow-pink hover:bg-primary/90 active:bg-primary/80'
                    : 'bg-muted/20 text-muted-foreground/40 cursor-not-allowed border border-transparent'
                }`}
            >
              {isSubmitting ? 'Saving...' : 'Finish 🎉'}
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!canGoForward || (!isAnswered && !isSkipped)}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-body text-sm font-semibold transition-all ${canGoForward && (isAnswered || isSkipped)
                  ? 'bg-primary text-primary-foreground box-glow-pink hover:bg-primary/90 active:bg-primary/80'
                  : 'bg-muted/20 text-muted-foreground/40 cursor-not-allowed border border-transparent'
                }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizFlow;
