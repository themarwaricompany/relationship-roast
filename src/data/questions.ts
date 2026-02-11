export interface Question {
  id: string;
  category: 'kitchen' | 'remote' | 'paisa' | 'argument' | 'jealousy';
  categoryLabel: string;
  categoryEmoji: string;
  relationshipStatus: 'all' | 'dating' | 'married' | 'livein';
  questionText: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  // Scoring: a = partner gets points, b = you get points, c = minimal, d = contextual
}

export const categoryInfo = {
  kitchen: { label: 'Kitchen Ka Raja/Rani', emoji: '🍳' },
  remote: { label: 'Remote Control Politics', emoji: '📺' },
  paisa: { label: 'Paison Ka Hisaab', emoji: '💰' },
  argument: { label: 'Argument Arena', emoji: '⚔️' },
  jealousy: { label: 'Social Scene & Jealousy Meter', emoji: '📱' },
};

export const allQuestions: Question[] = [
  // ===== KITCHEN KA RAJA/RANI =====
  {
    id: 'k1',
    category: 'kitchen',
    categoryLabel: 'Kitchen Ka Raja/Rani',
    categoryEmoji: '🍳',
    relationshipStatus: 'all',
    questionText: 'Dinner kya khana hai — ye kaun decide karta hai?',
    options: {
      a: 'Main decide karta/karti hoon, partner ko choice nahi milti 😤',
      b: 'Partner decide karta/karti hai, main bas khata/khati hoon 🫡',
      c: 'Dono milke decide karte hain (jhooth mat bolo) 🤝',
      d: 'Swiggy ka algorithm decide karta hai 🛵',
    },
  },
  {
    id: 'k2',
    category: 'kitchen',
    categoryLabel: 'Kitchen Ka Raja/Rani',
    categoryEmoji: '🍳',
    relationshipStatus: 'all',
    questionText: 'Cooking kaun karta hai ghar mein?',
    options: {
      a: 'Main hi chef hoon — partner kitchen mein allowed nahi 👨‍🍳',
      b: 'Partner pakata hai, main sirf taste test karta/karti hoon 😋',
      c: 'Dono milke banate hain — teamwork 💪',
      d: 'Maggi bana lete hain, cooking kaun karta hai 🍜',
    },
  },
  {
    id: 'k3',
    category: 'kitchen',
    categoryLabel: 'Kitchen Ka Raja/Rani',
    categoryEmoji: '🍳',
    relationshipStatus: 'dating',
    questionText: 'Date pe restaurant kaun pick karta hai?',
    options: {
      a: 'Main decide karta/karti hoon — mere standards high hain 🍽️',
      b: 'Partner choose karta hai, mujhe bas khana milna chahiye 🤷',
      c: 'Dono Google Maps pe scroll karte hain 30 min tak 📱',
      d: 'Jahan discount ho wahan chalte hain 💸',
    },
  },
  {
    id: 'k3m',
    category: 'kitchen',
    categoryLabel: 'Kitchen Ka Raja/Rani',
    categoryEmoji: '🍳',
    relationshipStatus: 'married',
    questionText: 'Ghar ka khana ya bahar ka — kaun decide karta hai?',
    options: {
      a: 'Main bolta/bolti hoon aaj bahar se order karo — done ✅',
      b: 'Partner ka jo mood ho wahi hoga 🫡',
      c: 'Mutual discussion hota hai (sure sure) 🙄',
      d: 'Saas/Mummy decide karti hain — hum toh bachche hain 👵',
    },
  },
  {
    id: 'k3l',
    category: 'kitchen',
    categoryLabel: 'Kitchen Ka Raja/Rani',
    categoryEmoji: '🍳',
    relationshipStatus: 'livein',
    questionText: 'Bartan kaun dhota hai?',
    options: {
      a: 'Partner dhota hai — main supervisor hoon 🧐',
      b: 'Main hi dhota/dhoti hoon har baar 😩',
      c: 'Turn by turn karte hain (mostly main) 🔄',
      d: 'Paper plates use karte hain — problem solved 🧠',
    },
  },
  {
    id: 'k4',
    category: 'kitchen',
    categoryLabel: 'Kitchen Ka Raja/Rani',
    categoryEmoji: '🍳',
    relationshipStatus: 'all',
    questionText: 'Grocery list kaun banata hai?',
    options: {
      a: 'Main banata/banati hoon — full control 📋',
      b: 'Partner ka department hai, main bas trolley push karta/karti hoon 🛒',
      c: 'Dono milke decide karte hain 🤝',
      d: 'Blinkit pe jo sale mein ho wahi le aao 📦',
    },
  },

  // ===== REMOTE CONTROL POLITICS =====
  {
    id: 'r1',
    category: 'remote',
    categoryLabel: 'Remote Control Politics',
    categoryEmoji: '📺',
    relationshipStatus: 'all',
    questionText: 'Netflix pe kya dekhna hai — kaun decide karta hai?',
    options: {
      a: 'Mera remote, meri marzi — partner adjust karega 🎬',
      b: 'Partner ka taste chalega, main compromise karta/karti hoon 😔',
      c: 'Dono milke choose karte hain (45 min scrolling) 📱',
      d: 'Phone pe alag alag dekhte hain — peace ✌️',
    },
  },
  {
    id: 'r2',
    category: 'remote',
    categoryLabel: 'Remote Control Politics',
    categoryEmoji: '📺',
    relationshipStatus: 'all',
    questionText: 'TV ka remote kiskey haath mein rehta hai?',
    options: {
      a: 'Mere paas — possession is power 👑',
      b: 'Partner ke paas — main phone pe shift ho gaya/gayi 📱',
      c: 'Turn by turn lete hain (yeah right) 🔄',
      d: 'Remote kho gaya hai — ab sab phone pe dekhte hain 🤷',
    },
  },
  {
    id: 'r3',
    category: 'remote',
    categoryLabel: 'Remote Control Politics',
    categoryEmoji: '📺',
    relationshipStatus: 'dating',
    questionText: 'Date plans kaun banata hai?',
    options: {
      a: 'Main full plan karta/karti hoon — surprise element 🎁',
      b: 'Partner plan karta hai, main bus ready ho ke jaata/jaati hoon 💅',
      c: '"Tu bol na kya karna hai" — infinite loop 🔁',
      d: 'Plans? Ghar pe Netflix IS the date 🛋️',
    },
  },
  {
    id: 'r3m',
    category: 'remote',
    categoryLabel: 'Remote Control Politics',
    categoryEmoji: '📺',
    relationshipStatus: 'married',
    questionText: 'Sunday ko kya karna hai — kaun decide karta hai?',
    options: {
      a: 'Main plan karta/karti hoon — Sunday mera hai 🏖️',
      b: 'Partner ki marzi chalti hai — main follow karta/karti hoon 🫡',
      c: 'Saath mein decide karte hain (after 2 hours of "tu bol na") 🙄',
      d: 'Sunday toh sone ke liye hai — koi plan nahi 😴',
    },
  },
  {
    id: 'r3l',
    category: 'remote',
    categoryLabel: 'Remote Control Politics',
    categoryEmoji: '📺',
    relationshipStatus: 'livein',
    questionText: 'AC ka temperature kaun set karta hai?',
    options: {
      a: 'Main set karta/karti hoon — optimal temperature mujhe pata hai ❄️',
      b: 'Partner ko thand lagti hai toh partner ki marzi 🥶',
      c: 'Compromise temperature pe rehte hain 🤝',
      d: 'AC war chal rahi hai — remote chhupaate hain ek dusre se 🔫',
    },
  },
  {
    id: 'r4',
    category: 'remote',
    categoryLabel: 'Remote Control Politics',
    categoryEmoji: '📺',
    relationshipStatus: 'all',
    questionText: 'Koi naya show start karna hai — approval kissey leni padti hai?',
    options: {
      a: 'Main start kar leta/leti hoon — partner ko baad mein bata dunga/dungi 😏',
      b: 'Partner bina bole start kar leta hai — main adjust karta/karti hoon 😤',
      c: 'Dono saath mein hi start karte hain — rule hai 📜',
      d: 'Solo mein dekh ke spoilers de deta/deti hoon 🤭',
    },
  },

  // ===== PAISON KA HISAAB =====
  {
    id: 'p1',
    category: 'paisa',
    categoryLabel: 'Paison Ka Hisaab',
    categoryEmoji: '💰',
    relationshipStatus: 'all',
    questionText: 'Paise pe kaun zyada control rakhta hai?',
    options: {
      a: 'Main CFO hoon is relationship ka 📊',
      b: 'Partner sambhalta hai — mere haath mein paisa safe nahi 💸',
      c: 'Dono equally responsible hain (theoretically) ⚖️',
      d: 'Koi control nahi — dono broke hain 😂',
    },
  },
  {
    id: 'p2',
    category: 'paisa',
    categoryLabel: 'Paison Ka Hisaab',
    categoryEmoji: '💰',
    relationshipStatus: 'all',
    questionText: 'Unnecessary shopping kaun zyada karta hai?',
    options: {
      a: 'Partner ka Amazon addiction hai — main responsible hoon 🛍️',
      b: 'Haan thoda main karta/karti hoon — but it sparks joy ✨',
      c: 'Dono equally khareedaari karte hain 🤝',
      d: 'Sale laga toh dono pagal ho jaate hain 🏃‍♂️🏃‍♀️',
    },
  },
  {
    id: 'p3',
    category: 'paisa',
    categoryLabel: 'Paison Ka Hisaab',
    categoryEmoji: '💰',
    relationshipStatus: 'dating',
    questionText: 'Date pe bill kaun pay karta hai?',
    options: {
      a: 'Main — kyunki main generous hoon 💳',
      b: 'Partner pay karta hai — main wallet bhool jaata/jaati hoon 🤭',
      c: 'Split karte hain — modern relationship hai 🤝',
      d: 'Jisko UPI offer aaye uska card ✨',
    },
  },
  {
    id: 'p3m',
    category: 'paisa',
    categoryLabel: 'Paison Ka Hisaab',
    categoryEmoji: '💰',
    relationshipStatus: 'married',
    questionText: 'Joint account ya separate — kisne decide kiya?',
    options: {
      a: 'Maine decide kiya — financial planning meri expertise hai 📈',
      b: 'Partner ne decide kiya — main agree kar liya 🫡',
      c: 'Mutual decision tha (partner ne convince kiya) 🤫',
      d: 'Separate hi safe hai — trust issues nahi, practical hai 🧠',
    },
  },
  {
    id: 'p3l',
    category: 'paisa',
    categoryLabel: 'Paison Ka Hisaab',
    categoryEmoji: '💰',
    relationshipStatus: 'livein',
    questionText: 'Rent split sach mein equal hai?',
    options: {
      a: 'Main zyada deta/deti hoon — but who\'s counting 💁',
      b: 'Partner zyada deta hai — main groceries cover karta/karti hoon 🛒',
      c: '50-50 sharp — spreadsheet maintain karte hain 📊',
      d: 'Venmo requests bhejte hain ek dusre ko 😂',
    },
  },
  {
    id: 'p4',
    category: 'paisa',
    categoryLabel: 'Paison Ka Hisaab',
    categoryEmoji: '💰',
    relationshipStatus: 'all',
    questionText: 'Bada purchase karna ho toh permission kissey leni padti hai?',
    options: {
      a: 'Main khareed leta/leti hoon — baad mein inform kar dunga/dungi 😎',
      b: 'Partner se puchna padta hai — warna sunna padta hai 😰',
      c: 'Dono discuss karte hain (but ek ki always chalti hai) 🤔',
      d: 'Hide kar ke khareedta/khareedti hoon — Amazon locker zindabad 📦',
    },
  },

  // ===== ARGUMENT ARENA =====
  {
    id: 'a1',
    category: 'argument',
    categoryLabel: 'Argument Arena',
    categoryEmoji: '⚔️',
    relationshipStatus: 'all',
    questionText: 'Ladai ke baad pehle sorry kaun bolta hai?',
    options: {
      a: 'Partner aata hai sorry bolke — meri ego strong hai 💪',
      b: 'Main hi cave in karta/karti hoon — peace chahiye 🕊️',
      c: 'Dono sorry bolte hain (after 3 din cold war) 🥶',
      d: 'Koi sorry nahi bolta — next day normal ho jaata hai 🤷',
    },
  },
  {
    id: 'a2',
    category: 'argument',
    categoryLabel: 'Argument Arena',
    categoryEmoji: '⚔️',
    relationshipStatus: 'all',
    questionText: 'Silent treatment kaun deta hai?',
    options: {
      a: 'Main — aur partner pagal ho jaata hai 😈',
      b: 'Partner deta hai — aur main 50 messages bhejta/bhejti hoon 📱',
      c: 'Dono dete hain — ghar mein sannata 🏚️',
      d: 'Silent treatment? Humari toh 24/7 ladai chalti hai 🗣️',
    },
  },
  {
    id: 'a3',
    category: 'argument',
    categoryLabel: 'Argument Arena',
    categoryEmoji: '⚔️',
    relationshipStatus: 'dating',
    questionText: 'Ladai ke baad pehle kaun text karta hai?',
    options: {
      a: 'Partner — kyunki meri value pata hai unko 😤',
      b: 'Main kar leta/leti hoon — miss karta/karti hoon yaar 🥺',
      c: 'Dono wait karte hain — fir memes bhejte hain 😂',
      d: 'Ladai? Humari toh abhi tak nahi hui (jhooth) 🤥',
    },
  },
  {
    id: 'a3m',
    category: 'argument',
    categoryLabel: 'Argument Arena',
    categoryEmoji: '⚔️',
    relationshipStatus: 'married',
    questionText: 'Fight ke baad couch pe kaun sota hai?',
    options: {
      a: 'Partner ko bhej deta/deti hoon — bed mera hai 🛏️',
      b: 'Main hi chala/chali jaata/jaati hoon — adjust kar leta/leti hoon 😔',
      c: 'Same bed pe sote hain — but baat nahi karte 🙄',
      d: 'AC zyada tez kar ke revenge leta/leti hoon ❄️😈',
    },
  },
  {
    id: 'a3l',
    category: 'argument',
    categoryLabel: 'Argument Arena',
    categoryEmoji: '⚔️',
    relationshipStatus: 'livein',
    questionText: '"Main ja raha/rahi hoon" — ye dhamki kaun deta hai?',
    options: {
      a: 'Main — drama queen/king hoon 🎭',
      b: 'Partner deta hai — main rokta/rokti hoon har baar 🥺',
      c: 'Dono dete hain — koi jaata nahi 😂',
      d: 'Lease agreement mein dono ka naam hai — koi ja nahi sakta 📄',
    },
  },
  {
    id: 'a4',
    category: 'argument',
    categoryLabel: 'Argument Arena',
    categoryEmoji: '⚔️',
    relationshipStatus: 'all',
    questionText: 'Purani ladai kaun bring up karta hai naye argument mein?',
    options: {
      a: 'Main — memory sharp hai meri 🧠',
      b: 'Partner ko sab yaad rehta hai — file maintain karta/karti hai 📁',
      c: 'Dono yaad dilate hain — it\'s a talent 🎯',
      d: 'Notes app mein list maintain karte hain 📝😂',
    },
  },

  // ===== SOCIAL SCENE & JEALOUSY METER =====
  {
    id: 'j1',
    category: 'jealousy',
    categoryLabel: 'Social Scene & Jealousy Meter',
    categoryEmoji: '📱',
    relationshipStatus: 'all',
    questionText: '"Ye kaun tha/thi?" — ye kaun zyada puchta hai?',
    options: {
      a: 'Main puchta/puchti hoon — investigation department 🔍',
      b: 'Partner ka full CBI scene hota hai 🕵️',
      c: 'Dono puchte hain — mutual interrogation 🤝',
      d: 'Koi nahi puchta — trust hai bhai 😎 (jhooth) 🤥',
    },
  },
  {
    id: 'j2',
    category: 'jealousy',
    categoryLabel: 'Social Scene & Jealousy Meter',
    categoryEmoji: '📱',
    relationshipStatus: 'all',
    questionText: 'Partner ka phone check karne ka mann kisko zyada karta hai?',
    options: {
      a: 'Mujhe curiosity hoti hai — but main control karta/karti hoon 😬',
      b: 'Partner mera phone check karta hai — FBI agent hai 🕵️‍♀️',
      c: 'Dono ek dusre ke phone ka password jaante hain 🔓',
      d: 'Phone check? Hum toh location share karte hain 24/7 📍',
    },
  },
  {
    id: 'j3',
    category: 'jealousy',
    categoryLabel: 'Social Scene & Jealousy Meter',
    categoryEmoji: '📱',
    relationshipStatus: 'dating',
    questionText: 'Instagram pe kisi aur ki photo like ki — kaun react karta hai?',
    options: {
      a: 'Main notice karta/karti hoon — screenshot bhi le leta/leti hoon 📸',
      b: 'Partner ka full investigation start ho jaata hai 🔬',
      c: 'Dono chill hain — it\'s just a like 🤷',
      d: 'Isliye dono ne ek dusre ko unfollow kar rakha hai 😂',
    },
  },
  {
    id: 'j3m',
    category: 'jealousy',
    categoryLabel: 'Social Scene & Jealousy Meter',
    categoryEmoji: '📱',
    relationshipStatus: 'married',
    questionText: 'Shaadi ke baad bhi insecurity hai kya?',
    options: {
      a: 'Mujhe thodi hai — partner ke office friends se 😒',
      b: 'Partner ko hai — mere gym buddy se 🏋️',
      c: 'Na bhai — mangalsutra/ring pehen li, tension khatam 💍',
      d: 'Insecurity? Bhai ab toh escape bhi nahi kar sakte 😂',
    },
  },
  {
    id: 'j3l',
    category: 'jealousy',
    categoryLabel: 'Social Scene & Jealousy Meter',
    categoryEmoji: '📱',
    relationshipStatus: 'livein',
    questionText: '"Tumhare friend ka message tha" — kaun zyada puchta hai?',
    options: {
      a: 'Main — mujhe sab jaanna hai 🔎',
      b: 'Partner puchta hai — jealousy meter high hai 📊',
      c: 'Koi nahi puchta — boundaries respect karte hain 🤝',
      d: 'Group mein add kar lete hain — transparency 💡',
    },
  },
  {
    id: 'j4',
    category: 'jealousy',
    categoryLabel: 'Social Scene & Jealousy Meter',
    categoryEmoji: '📱',
    relationshipStatus: 'all',
    questionText: 'Kaun zyada jealous hota hai overall?',
    options: {
      a: 'Main thoda sa — but cute wala jealous 🥺',
      b: 'Partner — full possessive mode 🔒',
      c: 'Dono equally — it\'s balanced 😂',
      d: 'Jealous? Humein toh ek dusre ko handle karna hi mushkil hai 🤹',
    },
  },
];

export function getQuestionsForStatus(status: 'dating' | 'married' | 'livein'): Question[] {
  return allQuestions.filter(
    (q) => q.relationshipStatus === 'all' || q.relationshipStatus === status
  );
}

export function calculateScores(
  answers: Record<string, string>,
  partnerLabel: 'a' | 'b'
): number {
  let gulaanPoints = 0;
  let totalQuestions = Object.keys(answers).length;
  
  Object.entries(answers).forEach(([, answer]) => {
    if (answer === 'b') gulaanPoints += 3; // "They dominate" = you're gulaam
    else if (answer === 'a') gulaanPoints += 0; // "I dominate" = partner is gulaam
    else if (answer === 'c') gulaanPoints += 1; // "Equal" = minimal
    else if (answer === 'd') gulaanPoints += 1.5; // "Wildcard" = contextual
  });

  const maxPoints = totalQuestions * 3;
  return Math.round((gulaanPoints / maxPoints) * 100);
}

export function getTitle(score: number, gender: string): string {
  if (score <= 20) {
    if (gender === 'male') return 'Alpha Mard 💪';
    if (gender === 'female') return 'Alpha Aurat 💪';
    return 'Alpha Partner 💪';
  }
  if (score <= 40) return 'Thoda Gulaam, Thoda Boss 😏';
  if (score <= 60) return 'Part-Time Gulaam 🫡';
  if (score <= 80) return 'Senior Gulaam 📋';
  if (gender === 'male') return 'Certified Joru Ka Gulaam 🫡';
  if (gender === 'female') return 'Certified Miyaan Ki Gulaam 🫡';
  return 'Certified Gulaam 🫡';
}

export function getComboTitle(scoreA: number, scoreB: number): string | null {
  if (scoreA >= 80 && scoreB >= 80) return 'Dono Ek Dusre Ke Gulaam 💀';
  if (scoreA <= 20 && scoreB <= 20) return 'Dono Boss Hai — Toh Ladai Kaun Jeetega? 🥊';
  if ((scoreA >= 90 && scoreB <= 20) || (scoreB >= 90 && scoreA <= 20)) return 'Ek Raja, Ek Gulaam — Classic Bollywood Setup 🎬';
  return null;
}
