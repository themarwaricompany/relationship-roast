import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/lib/quizStore';
import { getQuestionsForStatus, categoryInfo, calculateScores } from '@/data/questions';
import { submitPartnerAnswers } from '@/lib/quizApi';
import { toast } from 'sonner';

const optionLabels = ['A', 'B', 'C', 'D'] as const;
const optionKeys = ['a', 'b', 'c', 'd'] as const;

const QuizFlow = () => {
  const navigate = useNavigate();
  const store = useQuizStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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

  const prevCategory = currentIndex > 0 ? questions[currentIndex - 1].category : null;
  const showCategoryHeader = currentQuestion.category !== prevCategory;

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    store.setAnswer(currentQuestion.id, option);

    setTimeout(async () => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      } else {
        // Quiz complete for current partner
        try {
          const answers = isPartnerA
            ? { ...store.partnerAAnswers, [currentQuestion.id]: option }
            : { ...store.partnerBAnswers, [currentQuestion.id]: option };
          const score = calculateScores(answers, store.currentPartner);
          
          await submitPartnerAnswers(store.sessionId!, store.currentPartner, answers, score);

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
        }
      }
    }, 400);
  };

  const cat = categoryInfo[currentQuestion.category];

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col px-4 py-6">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground font-body">
            {currentName}'s turn
          </span>
          <span className="text-sm text-muted-foreground font-body">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-neon-gradient rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
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

              <h2 className="text-xl md:text-2xl font-heading font-bold mb-8 leading-snug">
                {currentQuestion.questionText}
              </h2>

              <div className="space-y-3">
                {optionKeys.map((key, i) => {
                  const isSelected = selectedOption === key;
                  return (
                    <motion.button
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelect(key)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all font-body text-sm leading-relaxed ${
                        isSelected
                          ? 'bg-primary/20 border-primary border-glow-pink text-foreground'
                          : 'bg-card border-border text-foreground/90 hover:border-muted-foreground/50 active:bg-card/80'
                      }`}
                    >
                      <span className="text-muted-foreground font-semibold mr-2">{optionLabels[i]}.</span>
                      {currentQuestion.options[key]}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuizFlow;
