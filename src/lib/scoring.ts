import type { QuizOption } from '../data/questions';

export type ResultTier = 'user_gulaam' | 'partner_gulaam' | 'equal' | 'sigma' | 'toxic';

export interface QuizResult {
    tier: ResultTier;
    title: string;
    description: string;
    emoji: string;
}

export function calculateResult(
    answers: QuizOption[],
    userName: string,
    partnerName: string,
): QuizResult {
    let userTotal = 0;
    let partnerTotal = 0;
    let chaosCount = 0;
    let chillCount = 0;

    for (const answer of answers) {
        userTotal += answer.userScore;
        partnerTotal += answer.partnerScore;

        // Track "both" answers (chaotic) and "neither" answers (chill)
        if (answer.userScore === 0.5 && answer.partnerScore === 0.5) {
            chaosCount++;
        }
        if (answer.userScore === 0 && answer.partnerScore === 0) {
            chillCount++;
        }
    }

    // Tier 5 — Toxic/Chaotic (lots of "war/debate" answers)
    if (chaosCount >= 4) {
        return {
            tier: 'toxic',
            title: 'Toxic But Can\'t Leave 🔥',
            description: `${userName} aur ${partnerName} — roz ladte hain, roz manate hain.`,
            emoji: '🔥',
        };
    }

    // Tier 4 — Sigma/Chill (lots of "trust/chill" answers)
    if (chillCount >= 3) {
        return {
            tier: 'sigma',
            title: 'Sigma Couple Alert 😎',
            description: `${userName} aur ${partnerName} — no drama, just vibes.`,
            emoji: '😎',
        };
    }

    const diff = userTotal - partnerTotal;

    // Tier 1 — User is the Gulaam
    if (diff >= 1.5) {
        return {
            tier: 'user_gulaam',
            title: 'Certified Joru Ka Gulaam 🏆',
            description: `${userName} is officially ${partnerName} ka gulaam. No arguments.`,
            emoji: '🏆',
        };
    }

    // Tier 2 — Partner is the Gulaam
    if (diff <= -1.5) {
        return {
            tier: 'partner_gulaam',
            title: `${partnerName} Hai Asli Gulaam 😂`,
            description: `${partnerName} thinks they run the show, but ${userName} is the real boss.`,
            emoji: '😂',
        };
    }

    // Tier 3 — Both equally whipped
    return {
        tier: 'equal',
        title: 'Dono Ek Dusre Ke Gulaam 🥰',
        description: `${userName} aur ${partnerName} — dono equally pagal hain ek dusre ke liye.`,
        emoji: '🥰',
    };
}
