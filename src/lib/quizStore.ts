import { create } from 'zustand';

interface QuizState {
  // Setup
  partnerAName: string;
  partnerBName: string;
  partnerAGender: string;
  partnerBGender: string;
  relationshipStatus: 'dating' | 'married' | 'livein';
  
  // Quiz state
  currentPartner: 'a' | 'b';
  partnerAAnswers: Record<string, string>;
  partnerBAnswers: Record<string, string>;
  
  // Status
  status: 'setup' | 'partner_a_quiz' | 'waiting_for_b' | 'partner_b_quiz' | 'completed';
  
  // Actions
  setSetup: (data: {
    partnerAName: string;
    partnerBName: string;
    partnerAGender: string;
    partnerBGender: string;
    relationshipStatus: 'dating' | 'married' | 'livein';
  }) => void;
  setAnswer: (questionId: string, answer: string) => void;
  completePartnerA: () => void;
  startPartnerB: () => void;
  completePartnerB: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  partnerAName: '',
  partnerBName: '',
  partnerAGender: 'male',
  partnerBGender: 'female',
  relationshipStatus: 'dating',
  currentPartner: 'a',
  partnerAAnswers: {},
  partnerBAnswers: {},
  status: 'setup',

  setSetup: (data) => set({ ...data, status: 'partner_a_quiz', currentPartner: 'a' }),

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

  completePartnerB: () => set({ status: 'completed' }),

  reset: () => set({
    partnerAName: '',
    partnerBName: '',
    partnerAGender: 'male',
    partnerBGender: 'female',
    relationshipStatus: 'dating',
    currentPartner: 'a',
    partnerAAnswers: {},
    partnerBAnswers: {},
    status: 'setup',
  }),
}));
