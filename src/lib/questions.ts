import type { Question } from '@/types';

export const QUESTIONS: Question[] = [
    // ─── Category 1: Kitchen Ka Raja/Rani ─────────────────────────────────────
    {
        id: 1,
        category: 'kitchen',
        categoryLabel: 'Kitchen Ka Raja/Rani',
        categoryEmoji: '🍳',
        questionOrder: 1,
        text: {
            dating: "Date pe kya khana hai — ye kaun decide karta hai?",
            married: "Aaj dinner mein kya banega — ye kaun decide karta hai?",
            livein: "Aaj Swiggy se kya order karna hai — ye kaun decide karta hai?",
        },
        options: {
            a: { text: "Main decide karta/karti hoon, partner ki choice secondary hai 😤", selfScore: 0, partnerScore: 8, reaction: 'crown' },
            b: { text: "Partner decide karta/karti hai, main bas khush rehta/rehti hoon 🫡", selfScore: 8, partnerScore: 0, reaction: 'salute' },
            c: { text: "Dono milke decide karte hain (sure, sure... 🙄)", selfScore: 3, partnerScore: 3, reaction: 'handshake' },
            d: { text: "Swiggy ka 'Popular Near You' decide karta hai 🛵", selfScore: 2, partnerScore: 2, reaction: 'lol' },
        },
    },
    {
        id: 2,
        category: 'kitchen',
        categoryLabel: 'Kitchen Ka Raja/Rani',
        categoryEmoji: '🍳',
        questionOrder: 2,
        text: {
            dating: "Date pe kaun treat karta hai mostly?",
            married: "Kitchen mein kaun zyada kaam karta hai honestly?",
            livein: "Bartan kaun dhota hai sach mein?",
        },
        options: {
            a: { text: "Main hi handle karta/karti hoon mostly 💪", selfScore: 0, partnerScore: 8, reaction: 'crown' },
            b: { text: "Partner karta/karti hai, main moral support deta/deti hoon 🫡", selfScore: 8, partnerScore: 0, reaction: 'salute' },
            c: { text: "50-50 hai bilkul (Rab Ne Bana Di Jodi types) 🤝", selfScore: 3, partnerScore: 3, reaction: 'handshake' },
            d: { text: "Zomato Gold hamare ghar ka personal chef hai 🍔", selfScore: 2, partnerScore: 2, reaction: 'lol' },
        },
    },

    // ─── Category 2: Remote Control Politics ──────────────────────────────────
    {
        id: 3,
        category: 'remote',
        categoryLabel: 'Remote Control Politics',
        categoryEmoji: '📺',
        questionOrder: 1,
        text: {
            dating: "Netflix & chill mein Netflix kaun choose karta hai?",
            married: "TV ka remote actually kiske control mein hai?",
            livein: "Raat ko kya dekhna hai — ye battle kaun jeetta hai?",
        },
        options: {
            a: { text: "Mera phone/TV, meri choice 😤", selfScore: 0, partnerScore: 8, reaction: 'crown' },
            b: { text: "Partner ka taste chalega, main adjust kar leta/leti hoon 🫡", selfScore: 8, partnerScore: 0, reaction: 'salute' },
            c: { text: "Dono milke choose karte hain (45 min scrolling included) 🤝", selfScore: 3, partnerScore: 3, reaction: 'handshake' },
            d: { text: "Hum log 2 ghanta scroll karte hain, phir so jaate hain 😴", selfScore: 2, partnerScore: 2, reaction: 'skull' },
        },
    },
    {
        id: 4,
        category: 'remote',
        categoryLabel: 'Remote Control Politics',
        categoryEmoji: '📺',
        questionOrder: 2,
        text: {
            dating: "Date plan kaun banata hai usually?",
            married: "Sunday ko kya karna hai — kaun plan karta hai?",
            livein: "Weekend ka scene kaun set karta hai?",
        },
        options: {
            a: { text: "Main plan karta/karti hoon, partner follows 📋", selfScore: 0, partnerScore: 8, reaction: 'crown' },
            b: { text: "Partner plan karta/karti hai, main bas ready ho jaata/jaati hoon 🫡", selfScore: 8, partnerScore: 0, reaction: 'salute' },
            c: { text: "Dono milke decide karte hain democratically 🤝", selfScore: 3, partnerScore: 3, reaction: 'handshake' },
            d: { text: "Weekend plans? Hum dono bed pe pade rehte hain 🛌", selfScore: 2, partnerScore: 2, reaction: 'lol' },
        },
    },

    // ─── Category 3: Paison Ka Hisaab ────────────────────────────────────────
    {
        id: 5,
        category: 'paisa',
        categoryLabel: 'Paison Ka Hisaab',
        categoryEmoji: '💰',
        questionOrder: 1,
        text: {
            dating: "Dono mein se kaun zyada impulsive shopper hai?",
            married: "Amazon/Myntra ka bill kaun zyada badhaata hai?",
            livein: "Online shopping ka addiction kisse zyada hai?",
        },
        options: {
            a: { text: "Main toh soch samajh ke kharch karta/karti hoon... partner nahi 💸", selfScore: 0, partnerScore: 8, reaction: 'money' },
            b: { text: "Okay fine... main thoda zyada shop karta/karti hoon 😅", selfScore: 8, partnerScore: 0, reaction: 'money' },
            c: { text: "Dono equally responsible hain with money 🤝", selfScore: 3, partnerScore: 3, reaction: 'handshake' },
            d: { text: "Hum dono broke hain, koi kuch nahi khareedta 💀", selfScore: 2, partnerScore: 2, reaction: 'skull' },
        },
    },
    {
        id: 6,
        category: 'paisa',
        categoryLabel: 'Paison Ka Hisaab',
        categoryEmoji: '💰',
        questionOrder: 2,
        text: {
            dating: "Date ka bill kaun pay karta hai honestly?",
            married: "Restaurant pe bill aata hai toh kaun uthata hai?",
            livein: "Rent aur bills ka hisaab kaun rakhta hai?",
        },
        options: {
            a: { text: "Main pay karta/karti hoon mostly 💳", selfScore: 0, partnerScore: 8, reaction: 'crown' },
            b: { text: "Partner pay karta/karti hai, main pretend karta/karti hoon wallet dhundh raha/rahi hoon 🫡", selfScore: 8, partnerScore: 0, reaction: 'salute' },
            c: { text: "Hamesha split karte hain fairly 🤝", selfScore: 3, partnerScore: 3, reaction: 'handshake' },
            d: { text: "Jo bhi card ka notification pehle nahi dekhta, wo pay karta hai 😂", selfScore: 2, partnerScore: 2, reaction: 'lol' },
        },
    },

    // ─── Category 4: Argument Arena ───────────────────────────────────────────
    {
        id: 7,
        category: 'argument',
        categoryLabel: 'Argument Arena',
        categoryEmoji: '⚔️',
        questionOrder: 1,
        text: {
            dating: "Fight ke baad pehle kaun message karta hai?",
            married: "Cold war ke baad pehle kaun surrender karta hai?",
            livein: "Argument ke baad ghar mein baat kaun shuru karta hai pehle?",
        },
        options: {
            a: { text: "Main KABHI pehle sorry nahi bolta/bolti. Principle hai. 😤", selfScore: 0, partnerScore: 8, reaction: 'boxing' },
            b: { text: "Main hi bolta/bolti hoon pehle... chahe galti meri na ho 🫡", selfScore: 8, partnerScore: 0, reaction: 'salute' },
            c: { text: "Dono ek saath sorry bol dete hain 🤝", selfScore: 3, partnerScore: 3, reaction: 'handshake' },
            d: { text: "Koi sorry nahi bolta — 3 din baad normal ho jaata hai automatically 😶", selfScore: 2, partnerScore: 2, reaction: 'skull' },
        },
    },
    {
        id: 8,
        category: 'argument',
        categoryLabel: 'Argument Arena',
        categoryEmoji: '⚔️',
        questionOrder: 2,
        text: {
            dating: "Choti si baat ko kaun bada bana deta hai?",
            married: "Purani baatein kaun zyada ukhad ke laata hai fights mein?",
            livein: "Kaun dhamki deta hai — 'Main ja raha/rahi hoon'?",
        },
        options: {
            a: { text: "Partner WAY zyada dramatic hai, main calm rehta/rehti hoon 😌", selfScore: 0, partnerScore: 8, reaction: 'boxing' },
            b: { text: "Theek hai... main thoda dramatic ho jaata/jaati hoon kabhi kabhi 😅", selfScore: 8, partnerScore: 0, reaction: 'salute' },
            c: { text: "Dono equally dramatic hain honestly 🤝", selfScore: 3, partnerScore: 3, reaction: 'handshake' },
            d: { text: "Humari fights Oscar-worthy performances hain 🎬", selfScore: 2, partnerScore: 2, reaction: 'popcorn' },
        },
    },
    {
        id: 9,
        category: 'argument',
        categoryLabel: 'Argument Arena',
        categoryEmoji: '⚔️',
        questionOrder: 3,
        text: {
            dating: "Seen-zone karta kaun hai zyada?",
            married: "Ghar mein 'baat nahi karunga/karungi' mode kaun activate karta hai?",
            livein: "Ek hi ghar mein rehke ignore kaun karta hai better?",
        },
        options: {
            a: { text: "Main expert hoon silent treatment mein 🤫", selfScore: 0, partnerScore: 8, reaction: 'crown' },
            b: { text: "Partner ka silent treatment professional level ka hai 😶", selfScore: 8, partnerScore: 0, reaction: 'skull' },
            c: { text: "Hum log communicate karte hain maturely 🤝", selfScore: 3, partnerScore: 3, reaction: 'handshake' },
            d: { text: "Silent treatment? 2 minute mein dono crack ho jaate hain 😂", selfScore: 2, partnerScore: 2, reaction: 'heart' },
        },
    },

    // ─── Category 5: Social Scene & Jealousy Meter ───────────────────────────
    {
        id: 10,
        category: 'jealousy',
        categoryLabel: 'Social Scene & Jealousy Meter',
        categoryEmoji: '📱',
        questionOrder: 1,
        text: {
            dating: "Partner ka phone bajta hai toh kaun puchta hai 'kaun tha?'",
            married: "Kisi ka message aaye toh kaun investigate karta hai?",
            livein: "Late night notification aaye toh kaun react karta hai?",
        },
        options: {
            a: { text: "Main toh kabhi nahi puchta/puchti. Chill hoon. 😎", selfScore: 0, partnerScore: 8, reaction: 'smirk' },
            b: { text: "Main THODA sa puch leta/leti hoon... concern hai bas 👀", selfScore: 8, partnerScore: 0, reaction: 'fire' },
            c: { text: "Dono equally curious hain 🤝", selfScore: 3, partnerScore: 3, reaction: 'handshake' },
            d: { text: "Hum dono ek dusre ka phone freely use karte hain — no secrets 📱", selfScore: 2, partnerScore: 2, reaction: 'heart' },
        },
    },
    {
        id: 11,
        category: 'jealousy',
        categoryLabel: 'Social Scene & Jealousy Meter',
        categoryEmoji: '📱',
        questionOrder: 2,
        text: {
            dating: "Instagram pe kaun zyada couple photos daalta hai?",
            married: "Anniversary/birthday pe kaun 500 word essay likhta hai Instagram pe?",
            livein: "Couple content kaun zyada create karta hai?",
        },
        options: {
            a: { text: "Main daalta/daalti hoon proudly, partner camera-shy hai 📸", selfScore: 0, partnerScore: 8, reaction: 'crown' },
            b: { text: "Partner daalta/daalti hai, main bas tag hota/hoti hoon 🫡", selfScore: 8, partnerScore: 0, reaction: 'salute' },
            c: { text: "Dono equally cringe hain social media pe 🤝", selfScore: 3, partnerScore: 3, reaction: 'handshake' },
            d: { text: "Humara relationship social media pe exist hi nahi karta 👻", selfScore: 2, partnerScore: 2, reaction: 'shocked' },
        },
    },
    {
        id: 12,
        category: 'jealousy',
        categoryLabel: 'Social Scene & Jealousy Meter',
        categoryEmoji: '📱',
        questionOrder: 3,
        text: {
            dating: "Kisi aur se baat kare toh kaun zyada react karta hai?",
            married: "Office ke 'friend' ka naam aaye toh kaun alert ho jaata hai?",
            livein: "Kaun zyada keep-tabs karta hai partner pe?",
        },
        options: {
            a: { text: "Main chill hoon, partner jealous type hai 😏", selfScore: 0, partnerScore: 8, reaction: 'smirk' },
            b: { text: "Okay theek hai... main thoda possessive hoon 😤", selfScore: 8, partnerScore: 0, reaction: 'fire' },
            c: { text: "Dono secure hain, trust hai 🤝", selfScore: 3, partnerScore: 3, reaction: 'handshake' },
            d: { text: "Jealous? Hum toh ek dusre ke ex ke saath bhi friendly hain 💀", selfScore: 2, partnerScore: 2, reaction: 'skull' },
        },
    },
];

export function getQuestionsByCategory(category: string): Question[] {
    return QUESTIONS.filter(q => q.category === category);
}
