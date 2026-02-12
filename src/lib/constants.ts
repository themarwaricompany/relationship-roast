import type { ScoreTier, CategoryMeta, QuizCategory } from '@/types';

// ─── Score Tiers ──────────────────────────────────────────────────────────────

export const SCORE_TIERS: ScoreTier[] = [
    { min: 0, max: 20, male: "Alpha Mard 💪", female: "Alpha Aurat 💪", neutral: "Alpha Partner 💪" },
    { min: 21, max: 40, male: "Thoda Gulaam, Thoda Boss", female: "Thodi Gulaam, Thodi Boss", neutral: "Thoda Gulaam, Thoda Boss" },
    { min: 41, max: 60, male: "Part-Time Gulaam", female: "Part-Time Gulaam", neutral: "Part-Time Gulaam" },
    { min: 61, max: 80, male: "Senior Gulaam 📋", female: "Senior Gulaam 📋", neutral: "Senior Gulaam 📋" },
    { min: 81, max: 100, male: "Certified Joru Ka Gulaam 🫡", female: "Certified Miyaan Ki Gulaam 🫡", neutral: "Certified Gulaam 🫡" },
];

// ─── Category Metadata ────────────────────────────────────────────────────────

export const CATEGORIES: CategoryMeta[] = [
    { key: 'kitchen', label: 'Kitchen Ka Raja/Rani', emoji: '🍳' },
    { key: 'remote', label: 'Remote Control Politics', emoji: '📺' },
    { key: 'paisa', label: 'Paison Ka Hisaab', emoji: '💰' },
    { key: 'argument', label: 'Argument Arena', emoji: '⚔️' },
    { key: 'jealousy', label: 'Social Scene & Jealousy Meter', emoji: '📱' },
];

export const CATEGORY_ORDER: QuizCategory[] = ['kitchen', 'remote', 'paisa', 'argument', 'jealousy'];

// ─── Loading Messages ─────────────────────────────────────────────────────────

export const GENERATING_MESSAGES = [
    "Tumhare dono ke answers compare ho rahe hain... 🔍",
    "AI ko hassi aa rahi hai 😂",
    "Gulaam score calculate ho raha hai... 📊",
    "Dramatic reveal incoming... 🎬",
    "Dono ki kahani match ho rahi hai... 🤔",
    "Roast prepare ho raha hai... 🔥",
    "Certificate print ho raha hai... 🫡",
];

export const WAITING_MESSAGES = [
    "Partner ka wait ho raha hai... ⏳",
    "Kab tak wait karaoge? 😤",
    "Abhi tak quiz nahi liya? Forward karo! 📲",
    "Hum bore ho rahe hain idhar... 🥱",
    "Partner se bolo jaldi kare! ⚡",
    "Shaadi mein itna wait toh kiya nahi hoga... 💒",
];

// ─── Share Text Templates ─────────────────────────────────────────────────────

export function getShareText(
    partnerAName: string,
    partnerBName: string,
    scoreA: number,
    scoreB: number,
    titleA: string,
    titleB: string,
): string {
    return `Hamara Joru Ka Gulaam score 😂🫡\n${partnerAName}: ${scoreA}/100 — ${titleA}\n${partnerBName}: ${scoreB}/100 — ${titleB}\n\nApna score nikalo → jorukagulaam.com`;
}

export function getPartnerInviteText(partnerBName: string, shareUrl: string): string {
    return `${partnerBName}, maine Joru Ka Gulaam quiz liya hai 😏 Ab teri baari: ${shareUrl}`;
}

// ─── Combo Titles ─────────────────────────────────────────────────────────────

export function getComboTitle(scoreA: number, scoreB: number): string | null {
    if (scoreA >= 80 && scoreB >= 80) return "Dono Ek Dusre Ke Gulaam 💀";
    if (scoreA < 20 && scoreB < 20) return "Dono Boss Hai — Toh Ladai Kaun Jeetega? 🥊";
    if ((scoreA >= 90 && scoreB < 20) || (scoreB >= 90 && scoreA < 20)) {
        return "Ek Raja, Ek Gulaam — Classic Bollywood Setup 🎬";
    }
    return null;
}

// ─── Max Score ─────────────────────────────────────────────────────────────────

export const MAX_RAW_SCORE = 96; // 12 questions × 8 max per question
