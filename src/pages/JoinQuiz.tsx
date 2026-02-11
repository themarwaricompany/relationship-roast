import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuizStore } from '@/lib/quizStore';
import { getSessionByShareCode } from '@/lib/quizApi';
import { toast } from 'sonner';

const JoinQuiz = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const store = useQuizStore();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (!shareCode) return;
    
    getSessionByShareCode(shareCode)
      .then((s) => {
        setSession(s);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Quiz not found! 😕');
        navigate('/');
      });
  }, [shareCode]);

  const handleStart = () => {
    if (!session) return;

    // If already completed, go to results
    if (session.status === 'completed') {
      store.setSetup({
        partnerAName: session.partner_a_name,
        partnerBName: session.partner_b_name,
        partnerAGender: session.partner_a_gender,
        partnerBGender: session.partner_b_gender,
        relationshipStatus: session.relationship_status,
      });
      store.setSessionId(session.id, session.share_code);
      store.setStatus('completed');
      navigate('/results');
      return;
    }

    // Set up store for partner B
    store.setSetup({
      partnerAName: session.partner_a_name,
      partnerBName: session.partner_b_name,
      partnerAGender: session.partner_a_gender,
      partnerBGender: session.partner_b_gender,
      relationshipStatus: session.relationship_status,
    });
    store.setSessionId(session.id, session.share_code);
    store.startPartnerB();
    navigate('/quiz/play');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} className="text-4xl">
          ⚡
        </motion.div>
      </div>
    );
  }

  if (!session) return null;

  const isCompleted = session.status === 'completed';

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-6xl mb-6">🫡</div>

        {isCompleted ? (
          <>
            <h1 className="text-2xl font-heading font-bold mb-4">
              Results are ready! 🎉
            </h1>
            <p className="text-muted-foreground font-body mb-8">
              <span className="text-primary font-semibold">{session.partner_a_name}</span> &{' '}
              <span className="text-secondary font-semibold">{session.partner_b_name}</span> ka Gulaam score dekho!
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-heading font-bold mb-4">
              <span className="text-primary text-glow-pink">{session.partner_a_name}</span> thinks they're NOT a Gulaam...
            </h1>
            <p className="text-muted-foreground font-body mb-8">
              Ab unhe galat prove karo, <span className="text-secondary font-semibold">{session.partner_b_name}</span>! 😏
            </p>
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-full py-4 rounded-full font-heading font-bold text-lg bg-primary text-primary-foreground box-glow-pink transition-all"
        >
          {isCompleted ? 'View Results →' : 'Start My Quiz →'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default JoinQuiz;
