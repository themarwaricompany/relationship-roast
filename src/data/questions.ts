export interface Question {
    id: number;
    question: string;
    emoji: string;
    points: number;
    category: string;
}

export const QUIZ_DATA: Question[] = [
    // ── Warm-Up (5 pts each) ──
    { id: 1, question: "Do you know their food order by heart?", emoji: "🍟", points: 5, category: "Warm-Up" },
    { id: 2, question: "Do you text 'reached safely' without being asked?", emoji: "🏠", points: 5, category: "Warm-Up" },
    { id: 3, question: "Do you remember the exact date you first met?", emoji: "📅", points: 5, category: "Warm-Up" },
    { id: 4, question: "Do you carry an extra jacket just for them?", emoji: "🧥", points: 5, category: "Warm-Up" },

    // ── Getting Serious (8 pts each) ──
    { id: 5, question: "Do you reply to their texts within 30 seconds?", emoji: "⚡", points: 8, category: "Getting Serious" },
    { id: 6, question: "Have you watched their favorite show just for them?", emoji: "🎬", points: 8, category: "Getting Serious" },
    { id: 7, question: "Do you wake up early to make chai for them?", emoji: "☕", points: 8, category: "Getting Serious" },
    { id: 8, question: "Do you carry their bags while shopping?", emoji: "🛍️", points: 8, category: "Getting Serious" },

    // ── Dedicated (10 pts each) ──
    { id: 9, question: "Do you let them control the TV remote always?", emoji: "📺", points: 10, category: "Dedicated" },
    { id: 10, question: "Have you memorized their parents' birthdays?", emoji: "🎂", points: 10, category: "Dedicated" },
    { id: 11, question: "Do you say 'Haan ji' more than 'Nahi'?", emoji: "🫡", points: 10, category: "Dedicated" },
    { id: 12, question: "Do you share your phone password with them?", emoji: "🔐", points: 10, category: "Dedicated" },

    // ── Senior Gulaam (12 pts each) ──
    { id: 13, question: "Do you have their fingerprint saved on your phone?", emoji: "📱", points: 12, category: "Senior Gulaam" },
    { id: 14, question: "Do you cancel plans with friends when they call?", emoji: "📞", points: 12, category: "Senior Gulaam" },
    { id: 15, question: "Do you drop everything when they need you?", emoji: "🏃", points: 12, category: "Senior Gulaam" },
    { id: 16, question: "Do you let them win every argument on purpose?", emoji: "😤", points: 12, category: "Senior Gulaam" },

    // ── Ultimate Gulaam (15 pts each) ──
    { id: 17, question: "Have you apologized when it was THEIR mistake?", emoji: "🤡", points: 15, category: "Ultimate Gulaam" },
    { id: 18, question: "Have you unfollowed someone because they asked?", emoji: "👀", points: 15, category: "Ultimate Gulaam" },
    { id: 19, question: "Do you need their permission before making plans?", emoji: "🙏", points: 15, category: "Ultimate Gulaam" },
    { id: 20, question: "Would you delete your Instagram if they asked?", emoji: "💀", points: 15, category: "Ultimate Gulaam" },
];

export const MAX_POINTS = QUIZ_DATA.reduce((sum, q) => sum + q.points, 0);

export function getTitle(pct: number): string {
    if (pct >= 80) return "ULTIMATE GULAAM 🫡";
    if (pct >= 60) return "Pakka Gulaam 😏";
    if (pct >= 40) return "Part-Time Gulaam 🤔";
    if (pct >= 20) return "Thoda Gulaam 😅";
    return "Free Bird 🕊️";
}
