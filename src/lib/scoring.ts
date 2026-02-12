import type { OptionKey, Gender, QuizCategory } from '@/types';
import { QUESTIONS } from './questions';
import { SCORE_TIERS, MAX_RAW_SCORE } from './constants';

interface ScoreResult {
    selfScore: number;
    partnerScore: number;
    categoryScores: Record<QuizCategory, { self: number; partner: number }>;
}

/**
 * Calculate raw scores from a set of answers
 */
export function calculateRawScores(answers: Record<number, OptionKey>): ScoreResult {
    let selfScore = 0;
    let partnerScore = 0;
    const categoryScores: Record<string, { self: number; partner: number }> = {};

    for (const question of QUESTIONS) {
        const answer = answers[question.id];
        if (!answer) continue;

        const option = question.options[answer];
        selfScore += option.selfScore;
        partnerScore += option.partnerScore;

        if (!categoryScores[question.category]) {
            categoryScores[question.category] = { self: 0, partner: 0 };
        }
        categoryScores[question.category].self += option.selfScore;
        categoryScores[question.category].partner += option.partnerScore;
    }

    return {
        selfScore,
        partnerScore,
        categoryScores: categoryScores as Record<QuizCategory, { self: number; partner: number }>,
    };
}

/**
 * Normalize raw score to 0-100 scale
 */
export function normalizeScore(rawScore: number): number {
    return Math.round((rawScore / MAX_RAW_SCORE) * 100);
}

/**
 * Get title for a score based on gender
 */
export function getTitle(score: number, gender: Gender): string {
    const tier = SCORE_TIERS.find(t => score >= t.min && score <= t.max);
    if (!tier) return "Part-Time Gulaam";

    switch (gender) {
        case 'male': return tier.male;
        case 'female': return tier.female;
        default: return tier.neutral;
    }
}

/**
 * Generate share code for quiz session
 */
export function generateShareCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
