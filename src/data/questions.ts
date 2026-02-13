export interface QuizOption {
    text: string;
    userScore: number;
    partnerScore: number;
}

export interface Question {
    id: number;
    question: string;
    emoji: string;
    options: QuizOption[];
}

export const QUIZ_QUESTIONS: Question[] = [
    {
        id: 1,
        question: "Ladaai ke baad pehle sorry kaun bolta hai?",
        emoji: "😤",
        options: [
            { text: "Main hamesha 🫡", userScore: 1, partnerScore: 0 },
            { text: "Woh hamesha 😏", userScore: 0, partnerScore: 1 },
            { text: "Dono ego hold karte hain 💀", userScore: 0.5, partnerScore: 0.5 },
        ],
    },
    {
        id: 2,
        question: "Netflix pe remote kis ke haath mein hota hai?",
        emoji: "📺",
        options: [
            { text: "Mere 😤", userScore: 0, partnerScore: 1 },
            { text: "Unke 🫡", userScore: 1, partnerScore: 0 },
            { text: "World War 3 hoti hai 🔥", userScore: 0.5, partnerScore: 0.5 },
        ],
    },
    {
        id: 3,
        question: "Relationship mein zyada dramatic kaun hai?",
        emoji: "🎭",
        options: [
            { text: "Main obviously 🎬", userScore: 1, partnerScore: 0 },
            { text: "Woh pakka 😏", userScore: 0, partnerScore: 1 },
            { text: "Dono Oscar level 🏆", userScore: 0.5, partnerScore: 0.5 },
        ],
    },
    {
        id: 4,
        question: "Bahar khaana kahan khana hai — ye kaun decide karta hai?",
        emoji: "🍕",
        options: [
            { text: "Main decide karta/karti hoon 😤", userScore: 0, partnerScore: 1 },
            { text: "Woh decide karte hain 🫡", userScore: 1, partnerScore: 0 },
            { text: "2 ghante debate hoti hai 💀", userScore: 0.5, partnerScore: 0.5 },
        ],
    },
    {
        id: 5,
        question: "Phone check karne ka scene kaisa hai?",
        emoji: "📱",
        options: [
            { text: "Main check karta/karti hoon unka 👀", userScore: 0, partnerScore: 1 },
            { text: "Woh check karte hain mera 😶", userScore: 1, partnerScore: 0 },
            { text: "Trust hai boss, no checking 😎", userScore: 0, partnerScore: 0 },
        ],
    },
    {
        id: 6,
        question: "Rishte mein jealous kaun hota hai zyada?",
        emoji: "🔥",
        options: [
            { text: "Main thoda sa 😅", userScore: 1, partnerScore: 0 },
            { text: "Woh full FBI mode 🕵️", userScore: 0, partnerScore: 1 },
            { text: "Koi nahi, chill hai 😎", userScore: 0, partnerScore: 0 },
        ],
    },
];

export const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;
