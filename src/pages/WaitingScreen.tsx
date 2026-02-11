import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/lib/quizStore';
import { toast } from 'sonner';

const WaitingScreen = () => {
  const navigate = useNavigate();
  const store = useQuizStore();

  if (!store.partnerAName) {
    navigate('/');
    return null;
  }

  const shareUrl = store.shareCode
    ? `${window.location.origin}/join/${store.shareCode}`
    : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied! 📋');
  };

  const handleWhatsAppShare = () => {
    const msg = encodeURIComponent(
      `${store.partnerBName}, ${store.partnerAName} ne quiz liya hai... ab teri baari 😏\n\n${shareUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleStartPartnerB = () => {
    store.startPartnerB();
    navigate('/quiz/play');
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full"
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
        </p>

        {/* Share options */}
        <div className="space-y-3 mb-8">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3.5 rounded-full font-heading font-bold text-sm bg-neon-green/90 text-background transition-all hover:brightness-110"
          >
            💬 Share on WhatsApp
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full py-3 rounded-full font-body text-sm border border-border text-muted-foreground hover:border-muted-foreground/50 transition-all"
          >
            📋 Copy Quiz Link
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-xs text-muted-foreground font-body">OR pass the phone</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartPartnerB}
          className="w-full py-4 rounded-full font-heading font-bold text-lg bg-secondary text-secondary-foreground box-glow-blue transition-all"
        >
          {store.partnerBName}, Start Quiz →
        </motion.button>

        <p className="text-xs text-muted-foreground/60 font-body mt-4">
          No peeking at each other's answers! 👀
        </p>
      </motion.div>
    </div>
  );
};

export default WaitingScreen;
