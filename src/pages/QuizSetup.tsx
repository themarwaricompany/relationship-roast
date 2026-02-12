import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/lib/quizStore';
import { createQuizSession } from '@/lib/quizApi';
import { toast } from 'sonner';

const genderOptions = [
  { value: 'male', label: 'Male 🙋‍♂️' },
  { value: 'female', label: 'Female 🙋‍♀️' },
  { value: 'nonbinary', label: 'Non-binary 🌈' },
];

const statusOptions = [
  { value: 'dating', label: '💑 Dating' },
  { value: 'married', label: '💍 Married' },
  { value: 'livein', label: '🏠 Live-in' },
];

const QuizSetup = () => {
  const navigate = useNavigate();
  const setSetup = useQuizStore((s) => s.setSetup);
  const setSessionId = useQuizStore((s) => s.setSessionId);

  const [partnerAName, setPartnerAName] = useState('');
  const [partnerBName, setPartnerBName] = useState('');
  const [partnerAGender, setPartnerAGender] = useState('male');
  const [partnerBGender, setPartnerBGender] = useState('female');
  const [relationshipStatus, setRelationshipStatus] = useState<'dating' | 'married' | 'livein'>('dating');
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = partnerAName.trim() && partnerBName.trim() && !isLoading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    try {
      const session = await createQuizSession({
        partnerAName: partnerAName.trim(),
        partnerBName: partnerBName.trim(),
        partnerAGender,
        partnerBGender,
        relationshipStatus,
      });

      setSetup({
        partnerAName: partnerAName.trim(),
        partnerBName: partnerBName.trim(),
        partnerAGender,
        partnerBGender,
        relationshipStatus,
      });
      setSessionId(session.id, session.share_code);
      navigate('/quiz/play');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong, try again!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cinematic-bg bg-cover bg-center flex items-center justify-center px-4 py-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <h1 className="text-3xl font-heading font-black text-center mb-2">
          <span className="text-red-600">Quiz Setup</span> 🫡
        </h1>
        <p className="text-center text-rose-700/60 text-sm mb-8 font-body">
          Pehle apni details daalo, phir maza aayega
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-body text-rose-800/70 mb-1.5">Your Name</label>
            <input
              type="text"
              value={partnerAName}
              onChange={(e) => setPartnerAName(e.target.value)}
              placeholder="Apna naam daalo..."
              maxLength={30}
              className="w-full bg-white/60 border border-rose-200/60 rounded-lg px-4 py-3 text-rose-900 font-body placeholder:text-rose-400/50 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-body text-rose-800/70 mb-1.5">Your Gender</label>
            <div className="flex gap-2">
              {genderOptions.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setPartnerAGender(g.value)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-body border transition-all ${partnerAGender === g.value
                    ? 'bg-red-50 border-red-400 text-red-600 font-medium'
                    : 'bg-white/50 border-rose-200/60 text-rose-700 hover:border-rose-300'
                    }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-body text-rose-800/70 mb-1.5">Partner's Name</label>
            <input
              type="text"
              value={partnerBName}
              onChange={(e) => setPartnerBName(e.target.value)}
              placeholder="Partner ka naam daalo..."
              maxLength={30}
              className="w-full bg-white/60 border border-rose-200/60 rounded-lg px-4 py-3 text-rose-900 font-body placeholder:text-rose-400/50 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-body text-rose-800/70 mb-1.5">Partner's Gender</label>
            <div className="flex gap-2">
              {genderOptions.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setPartnerBGender(g.value)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-body border transition-all ${partnerBGender === g.value
                    ? 'bg-red-50 border-red-400 text-red-600 font-medium'
                    : 'bg-white/50 border-rose-200/60 text-rose-700 hover:border-rose-300'
                    }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-body text-rose-800/70 mb-1.5">Relationship Status</label>
            <div className="flex gap-2">
              {statusOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setRelationshipStatus(s.value as 'dating' | 'married' | 'livein')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-body border transition-all ${relationshipStatus === s.value
                    ? 'bg-red-50 border-red-400 text-red-600 font-medium'
                    : 'bg-white/50 border-rose-200/60 text-rose-700 hover:border-rose-300'
                    }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-4 rounded-full font-heading font-bold text-lg transition-all ${canSubmit
              ? 'bg-red-500 text-white shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:bg-red-600'
              : 'bg-rose-200 text-rose-400 cursor-not-allowed'
              }`}
          >
            {isLoading ? 'Setting up...' : "Let's Go →"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizSetup;
