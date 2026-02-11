import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/lib/quizStore';

const WaitingScreen = () => {
  const navigate = useNavigate();
  const store = useQuizStore();

  if (!store.partnerAName) {
    navigate('/');
    return null;
  }

  const handleStartPartnerB = () => {
    store.startPartnerB();
    navigate('/quiz/play');
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-6xl mb-6"
        >
          ⏳
        </motion.div>

        <h1 className="text-2xl font-heading font-bold mb-2">
          <span className="text-primary text-glow-pink">{store.partnerAName}</span>, you're done! 🎉
        </h1>

        <p className="text-muted-foreground font-body mb-8">
          Ab <span className="text-secondary font-semibold">{store.partnerBName}</span> ki baari hai!
          Unhe phone de do ya link share karo 😏
        </p>

        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <p className="text-sm text-muted-foreground font-body mb-3">
            Send this to {store.partnerBName}:
          </p>
          <p className="text-foreground font-body text-sm italic">
            "{store.partnerBName}, {store.partnerAName} ne quiz liya hai... ab teri baari 😏"
          </p>
        </div>

        {/* For now, same-device flow */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartPartnerB}
          className="w-full py-4 rounded-full font-heading font-bold text-lg bg-secondary text-secondary-foreground box-glow-blue transition-all"
        >
          {store.partnerBName}, Start Your Quiz →
        </motion.button>

        <p className="text-xs text-muted-foreground/60 font-body mt-4">
          Pass the phone to {store.partnerBName} — no peeking! 👀
        </p>
      </motion.div>
    </div>
  );
};

export default WaitingScreen;
