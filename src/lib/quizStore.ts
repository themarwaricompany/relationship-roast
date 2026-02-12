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
  
  // Skip feature — limited to 2 uses per partner per quiz
  skipsRemaining: number;
  skippedQuestions: string[];
  
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
  removeAnswer: (questionId: string) => void;
  useSkip: (questionId: string) => void;
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
  skipsRemaining: 2,
  skippedQuestions: [],
  status: 'setup',

  setSetup: (data) => set({ ...data, status: 'partner_a_quiz', currentPartner: 'a', skipsRemaining: 2, skippedQuestions: [] }),
  setSessionId: (id, shareCode) => set({ sessionId: id, shareCode }),

  setAnswer: (questionId, answer) => {
    const state = get();
    // If question was previously skipped, un-skip it
    const wasSkipped = state.skippedQuestions.includes(questionId);
    const updatedSkipped = wasSkipped
      ? state.skippedQuestions.filter(q => q !== questionId)
      : state.skippedQuestions;
    const updatedSkipsRemaining = wasSkipped
      ? state.skipsRemaining + 1
      : state.skipsRemaining;

    if (state.currentPartner === 'a') {
      set({
        partnerAAnswers: { ...state.partnerAAnswers, [questionId]: answer },
        skippedQuestions: updatedSkipped,
        skipsRemaining: updatedSkipsRemaining,
      });
    } else {
      set({
        partnerBAnswers: { ...state.partnerBAnswers, [questionId]: answer },
        skippedQuestions: updatedSkipped,
        skipsRemaining: updatedSkipsRemaining,
      });
    }
  },

  removeAnswer: (questionId) => {
    const state = get();
    if (state.currentPartner === 'a') {
      const { [questionId]: _, ...rest } = state.partnerAAnswers;
      set({ partnerAAnswers: rest });
    } else {
      const { [questionId]: _, ...rest } = state.partnerBAnswers;
      set({ partnerBAnswers: rest });
    }
  },

  useSkip: (questionId) => {
    const state = get();
    if (state.skipsRemaining <= 0) return;
    // Remove any existing answer for this question
    if (state.currentPartner === 'a') {
      const { [questionId]: _, ...rest } = state.partnerAAnswers;
      set({
        partnerAAnswers: rest,
        skipsRemaining: state.skipsRemaining - 1,
        skippedQuestions: [...state.skippedQuestions, questionId],
      });
    } else {
      const { [questionId]: _, ...rest } = state.partnerBAnswers;
      set({
        partnerBAnswers: rest,
        skipsRemaining: state.skipsRemaining - 1,
        skippedQuestions: [...state.skippedQuestions, questionId],
      });
    }
  },

  completePartnerA: () => set({ status: 'waiting_for_b' }),
  startPartnerB: () => set({ status: 'partner_b_quiz', currentPartner: 'b', skipsRemaining: 2, skippedQuestions: [] }),
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
    skipsRemaining: 2,
    skippedQuestions: [],
    status: 'setup',
  }),
}));
