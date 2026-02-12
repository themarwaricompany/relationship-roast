import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";
import type { QuizSession, AIResult } from "@/types";

function getGenAI() {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
}

/**
 * Generate a scorecard image using Gemini's image generation.
 * Falls back to null if generation fails.
 */
export async function generateScorecard(
    session: QuizSession,
    result: AIResult
): Promise<string | null> {
    try {
        const prompt = `Create a stunning, premium scorecard image for a couple's quiz app called "Joru Ka Gulaam". 

Design specs:
- Aspect ratio: 1080x1920 (Instagram story format)
- Background: Dark, moody, cinematic golden hour city bokeh (warm amber/orange tones fading to dark)
- Style: Modern, editorial, premium — like a movie poster or K-drama title card
- Font style: Bold sans-serif headings (like Space Grotesk), clean sans-serif body (like DM Sans)

Content to include:
- Title "JORU KA GULAAM" in bold text at top with a red gradient glow
- 🫡 emoji next to the title
- "${session.partner_a_name}" on the left with score "${result.partner_a_score}/100" and title "${result.partner_a_title}"
- "${session.partner_b_name}" on the right with score "${result.partner_b_score}/100" and title "${result.partner_b_title}"
- "vs" between them in small muted text
- Quote at bottom: "${result.tagline}"
- Small text at very bottom: "jorukagulaam.com"
- Use red (#DC2626) for accents and gold (#F59E0B) for titles
- Scores should be very large and prominent
- Use frosted glass card effect for score containers
- Overall mood: warm, cinematic, dramatic but fun

Do NOT include any watermarks, logos besides the app name, or device frames.`;

        const response = await getGenAI().models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        // Check if image was generated
        const candidate = response.candidates?.[0];
        if (!candidate?.content?.parts) {
            console.error("No image in Gemini response");
            return null;
        }

        // Find inline data (image)
        const imagePart = candidate.content.parts.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (part: any) => part.inlineData?.mimeType?.startsWith("image/")
        );

        if (!imagePart?.inlineData) {
            console.error("No image data in response");
            return null;
        }

        // Decode base64 and upload to Supabase
        const imageBuffer = Buffer.from(imagePart.inlineData.data!, "base64");
        const fileName = `scorecards/${session.id}-${Date.now()}.png`;

        const { error: uploadErr } = await supabase.storage
            .from("quiz-assets")
            .upload(fileName, imageBuffer, {
                contentType: "image/png",
                upsert: true,
            });

        if (uploadErr) {
            console.error("Scorecard upload error:", uploadErr);
            return null;
        }

        const { data: urlData } = supabase.storage
            .from("quiz-assets")
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    } catch (err) {
        console.error("Scorecard generation failed:", err);
        return null;
    }
}
