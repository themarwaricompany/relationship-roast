import { create } from 'zustand';

interface QuizState {
  partnerAName: string;
  partnerBName: string;
  partnerAGender: string;
  partnerBGender: string;
  relationshipStatus: 'dating' | 'married' | 'livein';
  
  sessionId: string | null;
  shareCode: string | null;
  
  currentPartner: 'a' | 'b';
  partnerAAnswers: Record<string, string>;
  partnerBAnswers: Record<string, string>;
  
  status: 'setup' | 'partner_a_quiz' | 'waiting_for_b' | 'partner_b_quiz' | 'generating' | 'completed';
  
  setSetup: (data: {
    partnerAName: string;
    partnerBName: string;
    partnerAGender: string;
    partnerBGender: string;
    relationshipStatus: 'dating' | 'married' | 'livein';
  }) => void;
  setSessionId: (id: string, shareCode: string) => void;
  setAnswer: (questionId: string, answer: string) => void;
  completePartnerA: () => void;
  startPartnerB: () => void;
  completePartnerB: () => void;
  setStatus: (status: QuizState['status']) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  partnerAName: '',
  partnerBName: '',
  partnerAGender: 'male',
  partnerBGender: 'female',
  relationshipStatus: 'dating',
  sessionId: null,
  shareCode: null,
  currentPartner: 'a',
  partnerAAnswers: {},
  partnerBAnswers: {},
  status: 'setup',

  setSetup: (data) => set({ ...data, status: 'partner_a_quiz', currentPartner: 'a' }),
  setSessionId: (id, shareCode) => set({ sessionId: id, shareCode }),

  setAnswer: (questionId, answer) => {
    const state = get();
    if (state.currentPartner === 'a') {
      set({ partnerAAnswers: { ...state.partnerAAnswers, [questionId]: answer } });
    } else {
      set({ partnerBAnswers: { ...state.partnerBAnswers, [questionId]: answer } });
    }
  },

  completePartnerA: () => set({ status: 'waiting_for_b' }),
  startPartnerB: () => set({ status: 'partner_b_quiz', currentPartner: 'b' }),
  completePartnerB: () => set({ status: 'generating' }),
  setStatus: (status) => set({ status }),

  reset: () => set({
    partnerAName: '',
    partnerBName: '',
    partnerAGender: 'male',
    partnerBGender: 'female',
    relationshipStatus: 'dating',
    sessionId: null,
    shareCode: null,
    currentPartner: 'a',
    partnerAAnswers: {},
    partnerBAnswers: {},
    status: 'setup',
  }),
}));
