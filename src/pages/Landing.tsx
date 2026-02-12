import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cinematic-bg bg-cover bg-center flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Soft warm overlay for consistency */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,240,230,0.15)] via-transparent to-[rgba(255,220,210,0.2)]" />

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
          <span className="text-rose-900 drop-shadow-[0_1px_2px_rgba(150,50,50,0.15)]">JORU KA</span>
          <br />
          <span className="text-red-600 drop-shadow-[0_1px_4px_rgba(220,38,38,0.25)]">GULAAM</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-xl md:text-2xl text-rose-800/80 mt-4 mb-2 font-body"
        >
          Pata lagao kaun hai asli <span className="text-red-600 font-semibold">Gulaam</span> 🫡
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-sm text-rose-700/50 mb-10 font-body"
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
          className="bg-red-600 text-white font-heading font-bold text-lg px-10 py-4 rounded-full shadow-[0_4px_20px_rgba(220,38,38,0.35)] hover:bg-red-700 hover:shadow-[0_6px_30px_rgba(220,38,38,0.45)] transition-all duration-300"
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
              <span className="text-xs text-rose-700/60 font-body">{step.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
