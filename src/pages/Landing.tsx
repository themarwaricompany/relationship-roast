import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-neon-pink opacity-60 animate-pulse-glow" />
        <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-neon-blue opacity-40 animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 rounded-full bg-neon-green opacity-50 animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-neon-purple opacity-40 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 right-10 w-2 h-2 rounded-full bg-neon-pink opacity-30 animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-lg relative z-10"
      >
        {/* Emoji */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="text-7xl mb-6 animate-float"
        >
          🫡
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-5xl md:text-6xl font-heading font-black tracking-tight mb-2"
        >
          <span className="text-glow-pink text-primary">JORU KA</span>
          <br />
          <span className="text-glow-blue text-secondary">GULAAM</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-xl md:text-2xl text-muted-foreground mt-4 mb-2 font-body"
        >
          Pata lagao kaun hai asli Gulaam 🫡
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-sm text-muted-foreground/70 mb-10 font-body"
        >
          A fun couple's quiz that reveals who's REALLY whipped in your relationship
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/quiz/new')}
          className="bg-primary text-primary-foreground font-heading font-bold text-lg px-10 py-4 rounded-full box-glow-pink hover:brightness-110 transition-all duration-300"
        >
          Start Quiz →
        </motion.button>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { emoji: '📝', text: 'Answer 18 fun questions' },
            { emoji: '🔄', text: 'Your partner answers too' },
            { emoji: '🎯', text: 'AI reveals the Gulaam' },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{step.emoji}</span>
              <span className="text-xs text-muted-foreground font-body">{step.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
