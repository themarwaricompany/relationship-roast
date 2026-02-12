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

  // Skip tracking — each partner gets 2 skips max
  partnerASkipsUsed: number;
  partnerBSkipsUsed: number;
  // Track which questions were skipped
  partnerASkipped: Set<string>;
  partnerBSkipped: Set<string>;

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
  skipQuestion: (questionId: string) => boolean; // returns false if no skips left
  unskipQuestion: (questionId: string) => void;
  getSkipsRemaining: () => number;
  isQuestionSkipped: (questionId: string) => boolean;
  completePartnerA: () => void;
  startPartnerB: () => void;
  completePartnerB: () => void;
  setStatus: (status: QuizState['status']) => void;
  reset: () => void;
}

const MAX_SKIPS = 2;

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
  partnerASkipsUsed: 0,
  partnerBSkipsUsed: 0,
  partnerASkipped: new Set<string>(),
  partnerBSkipped: new Set<string>(),
  status: 'setup',

  setSetup: (data) => set({ ...data, status: 'partner_a_quiz', currentPartner: 'a' }),
  setSessionId: (id, shareCode) => set({ sessionId: id, shareCode }),

  setAnswer: (questionId, answer) => {
    const state = get();
    if (state.currentPartner === 'a') {
      // If this question was previously skipped, un-skip it
      const newSkipped = new Set(state.partnerASkipped);
      const wasSkipped = newSkipped.delete(questionId);
      set({
        partnerAAnswers: { ...state.partnerAAnswers, [questionId]: answer },
        partnerASkipped: newSkipped,
        partnerASkipsUsed: wasSkipped ? state.partnerASkipsUsed - 1 : state.partnerASkipsUsed,
      });
    } else {
      const newSkipped = new Set(state.partnerBSkipped);
      const wasSkipped = newSkipped.delete(questionId);
      set({
        partnerBAnswers: { ...state.partnerBAnswers, [questionId]: answer },
        partnerBSkipped: newSkipped,
        partnerBSkipsUsed: wasSkipped ? state.partnerBSkipsUsed - 1 : state.partnerBSkipsUsed,
      });
    }
  },

  removeAnswer: (questionId) => {
    const state = get();
    if (state.currentPartner === 'a') {
      const newAnswers = { ...state.partnerAAnswers };
      delete newAnswers[questionId];
      set({ partnerAAnswers: newAnswers });
    } else {
      const newAnswers = { ...state.partnerBAnswers };
      delete newAnswers[questionId];
      set({ partnerBAnswers: newAnswers });
    }
  },

  skipQuestion: (questionId) => {
    const state = get();
    if (state.currentPartner === 'a') {
      if (state.partnerASkipsUsed >= MAX_SKIPS) return false;
      const newSkipped = new Set(state.partnerASkipped);
      newSkipped.add(questionId);
      // Also remove any existing answer for this question
      const newAnswers = { ...state.partnerAAnswers };
      delete newAnswers[questionId];
      set({
        partnerASkipsUsed: state.partnerASkipsUsed + 1,
        partnerASkipped: newSkipped,
        partnerAAnswers: newAnswers,
      });
      return true;
    } else {
      if (state.partnerBSkipsUsed >= MAX_SKIPS) return false;
      const newSkipped = new Set(state.partnerBSkipped);
      newSkipped.add(questionId);
      const newAnswers = { ...state.partnerBAnswers };
      delete newAnswers[questionId];
      set({
        partnerBSkipsUsed: state.partnerBSkipsUsed + 1,
        partnerBSkipped: newSkipped,
        partnerBAnswers: newAnswers,
      });
      return true;
    }
  },

  unskipQuestion: (questionId) => {
    const state = get();
    if (state.currentPartner === 'a') {
      const newSkipped = new Set(state.partnerASkipped);
      if (newSkipped.delete(questionId)) {
        set({
          partnerASkipsUsed: state.partnerASkipsUsed - 1,
          partnerASkipped: newSkipped,
        });
      }
    } else {
      const newSkipped = new Set(state.partnerBSkipped);
      if (newSkipped.delete(questionId)) {
        set({
          partnerBSkipsUsed: state.partnerBSkipsUsed - 1,
          partnerBSkipped: newSkipped,
        });
      }
    }
  },

  getSkipsRemaining: () => {
    const state = get();
    if (state.currentPartner === 'a') {
      return MAX_SKIPS - state.partnerASkipsUsed;
    }
    return MAX_SKIPS - state.partnerBSkipsUsed;
  },

  isQuestionSkipped: (questionId) => {
    const state = get();
    if (state.currentPartner === 'a') {
      return state.partnerASkipped.has(questionId);
    }
    return state.partnerBSkipped.has(questionId);
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
    partnerASkipsUsed: 0,
    partnerBSkipsUsed: 0,
    partnerASkipped: new Set<string>(),
    partnerBSkipped: new Set<string>(),
    status: 'setup',
  }),
}));
