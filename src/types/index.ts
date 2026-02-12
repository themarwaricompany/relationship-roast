// ─── Quiz Types ───────────────────────────────────────────────────────────────

export type RelationshipStatus = 'dating' | 'married' | 'livein';
export type Gender = 'male' | 'female' | 'nonbinary';
export type QuizCategory = 'kitchen' | 'remote' | 'paisa' | 'argument' | 'jealousy';
export type ReactionType =
    | 'salute' | 'crown' | 'lol' | 'fire' | 'skull' | 'smirk'
    | 'boxing' | 'money' | 'handshake' | 'heart' | 'shocked' | 'popcorn';

export type SessionStatus =
    | 'setup'
    | 'partner_a_playing'
    | 'waiting_for_partner_b'
    | 'partner_b_playing'
    | 'generating'
    | 'complete';

export type OptionKey = 'a' | 'b' | 'c' | 'd';

export interface QuestionOption {
    text: string;
    selfScore: number;
    partnerScore: number;
    reaction: ReactionType;
}

export interface Question {
    id: number;
    category: QuizCategory;
    categoryLabel: string;
    categoryEmoji: string;
    questionOrder: number;
    text: {
        dating: string;
        married: string;
        livein: string;
    };
    options: {
        a: QuestionOption;
        b: QuestionOption;
        c: QuestionOption;
        d: QuestionOption;
    };
}

// ─── Session Types ────────────────────────────────────────────────────────────

export interface QuizSession {
    id: string;
    share_code: string;
    partner_a_name: string;
    partner_a_gender: Gender;
    partner_b_name: string;
    partner_b_gender: Gender;
    relationship_status: RelationshipStatus;
    college: string | null;
    city: string | null;
    photo_url: string | null;
    partner_a_answers: Record<number, OptionKey> | null;
    partner_b_answers: Record<number, OptionKey> | null;
    ai_result: AIResult | null;
    scorecard_image_url: string | null;
    partner_a_score: number | null;
    partner_b_score: number | null;
    combined_score: number | null;
    leaderboard_opted_in: boolean;
    status: SessionStatus;
    created_at: string;
    partner_a_completed_at: string | null;
    partner_b_completed_at: string | null;
    completed_at: string | null;
    shared_count: number;
}

// ─── AI Result Types ──────────────────────────────────────────────────────────

export interface AIResult {
    partner_a_score: number;
    partner_b_score: number;
    partner_a_title: string;
    partner_b_title: string;
    tagline: string;
    category_verdicts: Record<QuizCategory, string>;
    overall_verdict: string;
    cross_reference_highlights: string[];
}

// ─── Score Types ──────────────────────────────────────────────────────────────

export interface ScoreTier {
    min: number;
    max: number;
    male: string;
    female: string;
    neutral: string;
}

// ─── Leaderboard Types ────────────────────────────────────────────────────────

export interface LeaderboardEntry {
    id: string;
    partner_a_name: string;
    partner_b_name: string;
    combined_score: number;
    partner_a_score: number;
    partner_b_score: number;
    college: string | null;
    city: string | null;
    created_at: string;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface AnalyticsEvent {
    id: string;
    session_id: string;
    event_type: string;
    metadata: Record<string, unknown> | null;
    created_at: string;
}

// ─── Category Metadata ────────────────────────────────────────────────────────

export interface CategoryMeta {
    key: QuizCategory;
    label: string;
    emoji: string;
}
