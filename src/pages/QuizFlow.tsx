import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/lib/quizStore';
import { getQuestionsForStatus, categoryInfo, calculateScores } from '@/data/questions';
import { submitPartnerAnswers } from '@/lib/quizApi';
import { toast } from 'sonner';
import { ChevronLeft, SkipForward } from 'lucide-react';

const QuizFlow = () => {
    const navigate = useNavigate();
    const store = useQuizStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for back, 1 for forward
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCategoryTransition, setShowCategoryTransition] = useState(false);
    const [transitionCategory, setTransitionCategory] = useState<{ label: string; emoji: string } | null>(null);
    const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Get questions based on relationship status
    const questions = useMemo(
        () => getQuestionsForStatus(store.relationshipStatus),
        [store.relationshipStatus]
    );

    const totalQuestions = questions.length;
    const currentQuestion = questions[currentIndex];

    // Get the current partner's answers
    const currentAnswers = store.currentPartner === 'a' ? store.partnerAAnswers : store.partnerBAnswers;
    const selectedAnswer = currentQuestion ? currentAnswers[currentQuestion.id] : undefined;
    const isSkipped = currentQuestion ? store.isQuestionSkipped(currentQuestion.id) : false;
    const skipsRemaining = store.getSkipsRemaining();

    // Redirect if not in quiz state
    useEffect(() => {
        if (store.status !== 'partner_a_quiz' && store.status !== 'partner_b_quiz') {
            navigate('/');
        }
    }, [store.status, navigate]);

    // Cleanup auto-advance timer on unmount
    useEffect(() => {
        return () => {
            if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
        };
    }, []);

    // Check for category transition when moving forward
    const checkCategoryTransition = useCallback(
        (fromIndex: number, toIndex: number) => {
            if (toIndex >= totalQuestions || toIndex < 0) return false;
            if (fromIndex < 0 || fromIndex >= totalQuestions) return false;
            const fromCat = questions[fromIndex].category;
            const toCat = questions[toIndex].category;
            if (fromCat !== toCat) {
                const catInfo = categoryInfo[toCat];
                setTransitionCategory({ label: catInfo.label, emoji: catInfo.emoji });
                setShowCategoryTransition(true);
                setTimeout(() => {
                    setShowCategoryTransition(false);
                    setTransitionCategory(null);
                }, 1200);
                return true;
            }
            return false;
        },
        [questions, totalQuestions]
    );

    // Navigate to next question
    const goNext = useCallback(() => {
        if (currentIndex < totalQuestions - 1) {
            setDirection(1);
            const nextIndex = currentIndex + 1;
            checkCategoryTransition(currentIndex, nextIndex);
            setCurrentIndex(nextIndex);
        }
    }, [currentIndex, totalQuestions, checkCategoryTransition]);

    // Navigate to previous question
    const goBack = useCallback(() => {
        if (currentIndex > 0) {
            setDirection(-1);
            const prevIndex = currentIndex - 1;
            checkCategoryTransition(currentIndex, prevIndex);
            setCurrentIndex(prevIndex);
        }
    }, [currentIndex, checkCategoryTransition]);

    // Handle answer selection — auto-advances after a brief delay
    const handleSelectAnswer = useCallback(
        (optionKey: string) => {
            if (!currentQuestion) return;
            store.setAnswer(currentQuestion.id, optionKey);

            // Clear any existing auto-advance timer
            if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);

            // Auto-advance to next question after 800ms
            if (currentIndex < totalQuestions - 1) {
                autoAdvanceTimer.current = setTimeout(() => {
                    goNext();
                }, 800);
            }
        },
        [currentQuestion, store, currentIndex, totalQuestions, goNext]
    );

    // Skip current question
    const handleSkip = useCallback(() => {
        if (!currentQuestion) return;
        if (isSkipped) {
            // Already skipped — unskip and let them answer
            store.unskipQuestion(currentQuestion.id);
            return;
        }
        const success = store.skipQuestion(currentQuestion.id);
        if (!success) {
            toast.error('No skips left! 😅 Sab questions answer karo!');
            return;
        }
        toast.success(`Skipped! ${store.getSkipsRemaining()} skip${store.getSkipsRemaining() === 1 ? '' : 's'} baaki hai`);
        // Auto-advance to next question
        if (currentIndex < totalQuestions - 1) {
            setDirection(1);
            const nextIndex = currentIndex + 1;
            checkCategoryTransition(currentIndex, nextIndex);
            setCurrentIndex(nextIndex);
        }
    }, [currentQuestion, isSkipped, store, currentIndex, totalQuestions, checkCategoryTransition]);

    // Check if quiz can be submitted
    const canSubmit = useMemo(() => {
        // All non-skipped questions must be answered
        return questions.every(
            (q) => currentAnswers[q.id] !== undefined || store.isQuestionSkipped(q.id)
        );
    }, [questions, currentAnswers, store]);

    // Handle quiz completion / submit
    const handleComplete = useCallback(async () => {
        if (!canSubmit || isSubmitting) return;
        setIsSubmitting(true);

        try {
            const score = calculateScores(currentAnswers, store.currentPartner);

            if (store.sessionId) {
                await submitPartnerAnswers(
                    store.sessionId,
                    store.currentPartner,
                    currentAnswers,
                    score
                );
            }

            if (store.currentPartner === 'a') {
                store.completePartnerA();
                navigate('/quiz/waiting');
            } else {
                store.completePartnerB();
                navigate('/results');
            }
        } catch (err) {
            console.error(err);
            toast.error('Submit nahi ho paaya 😢 Phir try karo!');
        } finally {
            setIsSubmitting(false);
        }
    }, [canSubmit, isSubmitting, currentAnswers, store, navigate]);

    // Whether we're on the LAST question
    const isLastQuestion = currentIndex === totalQuestions - 1;
    const isFirstQuestion = currentIndex === 0;

    // Calculate progress
    const answeredCount = questions.filter(
        (q) => currentAnswers[q.id] !== undefined || store.isQuestionSkipped(q.id)
    ).length;
    const progressPercent = (answeredCount / totalQuestions) * 100;

    if (!currentQuestion) return null;

    // Category transition overlay
    if (showCategoryTransition && transitionCategory) {
        return (
            <div className="min-h-screen bg-cinematic-bg bg-cover bg-center flex items-center justify-center px-4 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="text-center relative z-10"
                >
                    <div className="text-6xl mb-4">{transitionCategory.emoji}</div>
                    <h2 className="text-3xl font-heading font-black text-rose-900">
                        {transitionCategory.label}
                    </h2>
                </motion.div>
            </div>
        );
    }

    const partnerName =
        store.currentPartner === 'a' ? store.partnerAName : store.partnerBName;

    return (
        <div className="min-h-screen bg-cinematic-bg bg-cover bg-center relative flex flex-col">
            {/* Content */}
            <div className="relative z-10 flex flex-col flex-1 max-w-lg mx-auto w-full px-4 py-6">
                {/* Top bar: progress + partner label */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-body text-rose-800/70">
                            {partnerName}'s Turn
                        </span>
                        <span className="text-sm font-body text-rose-800/70">
                            {currentIndex + 1} / {totalQuestions}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-rose-200/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-red-500 rounded-full"
                            initial={false}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                {/* Category label */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{currentQuestion.categoryEmoji}</span>
                    <span className="text-xs font-heading font-semibold text-rose-700/60 uppercase tracking-wider">
                        {currentQuestion.categoryLabel}
                    </span>
                </div>

                {/* Question card */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentQuestion.id}
                        custom={direction}
                        initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="flex-1 flex flex-col"
                    >
                        {/* Question text */}
                        <div className="bg-white/60 backdrop-blur-sm border border-rose-200/60 rounded-2xl p-5 mb-5 shadow-sm">
                            <h2 className="text-xl md:text-2xl font-heading font-bold text-rose-900 leading-snug">
                                {currentQuestion.questionText}
                            </h2>
                            {isSkipped && (
                                <div className="mt-2 flex items-center gap-1.5">
                                    <span className="text-xs font-body text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                        ⏭ Skipped
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Answer options */}
                        <div className="space-y-3">
                            {(['a', 'b', 'c', 'd'] as const).map((optKey) => {
                                const optionText = currentQuestion.options[optKey];
                                const isSelected = selectedAnswer === optKey;
                                const optionLabel = optKey.toUpperCase();

                                return (
                                    <motion.button
                                        key={optKey}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleSelectAnswer(optKey)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-3 ${isSelected
                                                ? 'bg-red-50 border-red-400 shadow-[0_2px_12px_rgba(220,38,38,0.15)]'
                                                : 'bg-white/50 border-rose-200/60 hover:bg-white/70 hover:border-rose-300/80'
                                            }`}
                                    >
                                        <span
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-heading font-bold shrink-0 ${isSelected
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-rose-100 text-rose-500'
                                                }`}
                                        >
                                            {optionLabel}
                                        </span>
                                        <span
                                            className={`font-body text-sm leading-relaxed ${isSelected ? 'text-rose-900 font-medium' : 'text-rose-800/80'
                                                }`}
                                        >
                                            {optionText}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Bottom navigation bar */}
                <div className="mt-auto pt-6">
                    <div className="flex items-center gap-3">
                        {/* Back button */}
                        {!isFirstQuestion && (
                            <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={goBack}
                                className="flex items-center justify-center gap-1.5 px-5 py-4 rounded-2xl font-body text-sm font-semibold border border-rose-300/60 text-rose-700 bg-white/50 hover:bg-white/70 hover:border-rose-400/70 active:bg-white/80 transition-all shrink-0"
                            >
                                <ChevronLeft size={16} />
                                Back
                            </motion.button>
                        )}

                        {/* Main bottom button — Skip or Submit */}
                        {isLastQuestion && canSubmit ? (
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleComplete}
                                disabled={isSubmitting}
                                className={`flex-1 py-4 rounded-2xl font-heading font-bold text-base transition-all ${!isSubmitting
                                        ? 'bg-red-500 text-white shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:bg-red-600'
                                        : 'bg-rose-200 text-rose-400 cursor-not-allowed'
                                    }`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Answers 🫡'}
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSkip}
                                disabled={skipsRemaining <= 0 && !isSkipped}
                                className={`flex-1 py-4 rounded-2xl font-heading font-bold text-base flex items-center justify-center gap-2 transition-all ${isSkipped
                                        ? 'bg-amber-50 border border-amber-300 text-amber-700 hover:bg-amber-100'
                                        : skipsRemaining > 0
                                            ? 'bg-white/50 border border-rose-300/60 text-rose-700 hover:bg-white/70 hover:border-rose-400/70'
                                            : 'bg-rose-50/50 border border-rose-200/40 text-rose-300 cursor-not-allowed'
                                    }`}
                            >
                                <SkipForward size={18} />
                                {isSkipped ? 'Unskip' : 'Skip'}
                                {!isSkipped && skipsRemaining > 0 && (
                                    <span className="ml-1 text-xs tabular-nums bg-rose-100 px-2 py-0.5 rounded-lg text-rose-500">
                                        {skipsRemaining} left
                                    </span>
                                )}
                                {!isSkipped && skipsRemaining <= 0 && (
                                    <span className="ml-1 text-xs text-rose-300">
                                        No skips left
                                    </span>
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizFlow;
