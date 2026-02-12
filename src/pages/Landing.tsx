import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cinematic-bg bg-cover bg-center flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Warm dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(20,10,5,0.45)] via-[rgba(20,10,5,0.55)] to-[rgba(20,10,5,0.7)]" />

      {/* Floating warm bokeh particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-amber-400 opacity-40 animate-pulse-glow" />
        <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-orange-300 opacity-30 animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 rounded-full bg-yellow-400 opacity-35 animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-red-400 opacity-30 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 right-10 w-2 h-2 rounded-full bg-amber-300 opacity-25 animate-pulse-glow" style={{ animationDelay: '2s' }} />
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
          <span className="text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]">JORU KA</span>
          <br />
          <span className="text-red-500 drop-shadow-[0_0_25px_rgba(220,38,38,0.5)]">GULAAM</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-xl md:text-2xl text-white/75 mt-4 mb-2 font-body"
        >
          Pata lagao kaun hai asli <span className="text-red-400 font-semibold">Gulaam</span> 🫡
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-sm text-white/50 mb-10 font-body"
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
          className="bg-red-600 text-white font-heading font-bold text-lg px-10 py-4 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:bg-red-700 hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all duration-300"
        >
          Quiz Shuru Karo →
        </motion.button>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { emoji: '📝', text: 'Tum answer karo' },
            { emoji: '📲', text: 'Partner ko bhejo' },
            { emoji: '🫡', text: 'Results dekho aur share karo' },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{step.emoji}</span>
              <span className="text-xs text-white/50 font-body">{step.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
