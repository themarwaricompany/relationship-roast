import { GoogleGenAI } from "@google/genai";
import { QUESTIONS } from "@/lib/questions";
import { getTitle } from "@/lib/scoring";
import type { QuizSession, AIResult, OptionKey } from "@/types";
import { CATEGORY_ORDER, CATEGORIES } from "@/lib/constants";

function getGemini() {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
}

export async function generateResults(session: QuizSession): Promise<AIResult> {
    const partnerAAnswers = session.partner_a_answers as Record<number, OptionKey>;
    const partnerBAnswers = session.partner_b_answers as Record<number, OptionKey>;

    // Build answer comparison for the prompt
    const answerComparison = QUESTIONS.map((q) => {
        const aKey = partnerAAnswers[q.id];
        const bKey = partnerBAnswers[q.id];
        const aOption = q.options[aKey];
        const bOption = q.options[bKey];
        const catMeta = CATEGORIES.find((c) => c.key === q.category);

        return `Q${q.id} [${catMeta?.label || q.category}]: "${q.text[session.relationship_status || 'dating']}"
  ${session.partner_a_name} chose: "${aOption?.text}" (self=${aOption?.selfScore}, partner=${aOption?.partnerScore})
  ${session.partner_b_name} chose: "${bOption?.text}" (self=${bOption?.selfScore}, partner=${bOption?.partnerScore})`;
    }).join("\n\n");

    // Calculate final scores
    const scoreA = session.partner_a_score || 0;
    const scoreB = session.partner_b_score || 0;
    const titleA = getTitle(scoreA, session.partner_a_gender || "male");
    const titleB = getTitle(scoreB, session.partner_b_gender || "male");

    const prompt = `You are a hilarious Hinglish roast-master for the "Joru Ka Gulaam" couple's quiz. Your job is to roast this couple based on their quiz answers. The roast should be FUNNY, culturally Indian, Hinglish (mix of Hindi + English), and relationship-savvy. NOT mean-spirited — it should make both partners laugh.

## Context:
- ${session.partner_a_name} (${session.partner_a_gender}) scored ${scoreA}/100
- ${session.partner_b_name} (${session.partner_b_gender}) scored ${scoreB}/100
- Relationship status: ${session.relationship_status}
- Higher score = more "gulaam" (whipped)

## Their Answers:
${answerComparison}

## Instructions:
Generate a JSON response in this EXACT format:
{
  "partner_a_score": ${scoreA},
  "partner_b_score": ${scoreB},
  "partner_a_title": "<QUIRKY FUN COUPLE AWARD TITLE for ${session.partner_a_name} - examples: 'Toofani Couple Half', 'The Silent Boss', 'Netflix & Chill Champion', 'Breakfast in Bed Expert', 'Midnight Snack Partner', 'Adventure Buddy Supreme', 'Professional Hugger', etc. Make it FUN, SHAREABLE, and COUPLE-FOCUSED (not about being whipped)>",
  "partner_b_title": "<QUIRKY FUN COUPLE AWARD TITLE for ${session.partner_b_name} - examples: 'Toofani Couple Half', 'The Silent Boss', 'Netflix & Chill Champion', 'Breakfast in Bed Expert', 'Midnight Snack Partner', 'Adventure Buddy Supreme', 'Professional Hugger', etc. Make it FUN, SHAREABLE, and COUPLE-FOCUSED (not about being whipped)>",
  "tagline": "<One-liner roast summarizing this couple in Hinglish, max 15 words>",
  "overall_verdict": "<3-4 sentence overall Hinglish roast of this couple's dynamic. Make it cinematic and dramatic.>",
  "category_verdicts": {
    ${CATEGORY_ORDER.map((cat) => {
        const meta = CATEGORIES.find((c) => c.key === cat);
        return `"${cat}": "<2-3 sentence Hinglish roast for the ${meta?.label} category based on their answers>"`;
    }).join(",\n    ")}
  },
  "cross_reference_highlights": [
    "<Highlight 1: a funny contradiction or match between partner answers, in Hinglish>",
    "<Highlight 2: another funny observation>",
    "<Highlight 3: one more>"
  ]
}

CRITICAL AWARD TITLE GUIDELINES:
- Titles should be POSITIVE, QUIRKY, and FUN - NOT about scores or being "gulaam"
- Focus on couple dynamics, shared activities, personality traits
- Make them SHAREABLE - couples should be PROUD to share these titles!
- Examples: "Toofani Couple", "Adventure Junkies", "Lazy Sunday Champions", "Foodie Partners", "Late Night Philosophers", "Comedy Show Duo", "Road Trip Legends", "Sunrise Watchers", "Chai Pe Charcha Couple"
- Keep them short (2-5 words), memorable, and Instagram-worthy
- Avoid negative connotations - make couples feel SPECIAL and HAPPY

IMPORTANT:
- Use Hinglish naturally (Hindi words in Roman script mixed with English)
- Be witty, not vulgar
- Reference specific answers they gave for funnier roasts
- The tagline should be quotable/shareable
- THE AWARD TITLES ARE THE MOST IMPORTANT - make them creative, fun, and share-worthy!
- Return ONLY the JSON, no markdown or explanation`;

    try {
        const response = await getGemini().models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                temperature: 0.9,
                maxOutputTokens: 1500,
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error("No text in Gemini response");
        }

        // Parse JSON (handle potential markdown wrapping)
        let jsonText = text.trim();
        if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
        }

        const result: AIResult = JSON.parse(jsonText);
        return result;
    } catch (err) {
        console.error("AI generation failed:", err);

        // Return fallback result
        return {
            partner_a_score: scoreA,
            partner_b_score: scoreB,
            partner_a_title: titleA,
            partner_b_title: titleB,
            tagline: "Dono gulaam hai, bas style alag hai 🫡",
            overall_verdict: `${session.partner_a_name} aur ${session.partner_b_name} ki jodi bhi kya jodi hai! Dono ne quiz diya, aur dono ne prove kiya — pyaar mein sab gulaam hain. Ab share karo aur duniya ko dikhao!`,
            category_verdicts: Object.fromEntries(
                CATEGORY_ORDER.map((cat) => [cat, "Isse bhi answers aaye hain — AI abhi process kar raha hai 🤖"])
            ) as AIResult["category_verdicts"],
            cross_reference_highlights: [
                "Dono ne alag alag cheezein boli — classic couple moment 😂",
            ],
        };
    }
}
