import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";
import type { QuizSession, AIResult } from "@/types";

function getGenAI() {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
}

/**
 * Build the K-drama styled scorecard prompt with quiz results overlay
 */
function buildScorecardPrompt(session: QuizSession, result: AIResult): string {
    return `Cinematic portrait photography in the style of high-budget Korean drama. Create a stunning premium scorecard image for a couple's quiz result.

Design the image as a premium social-media-ready scorecard with the following details rendered as beautiful text overlays in the image:

TOP: "JORU KA GULAAM" title in bold elegant text with a subtle red glow
LEFT SIDE: "${session.partner_a_name}" — Score: ${result.partner_a_score}/100 — Title: "${result.partner_a_title}"
RIGHT SIDE: "${session.partner_b_name}" — Score: ${result.partner_b_score}/100 — Title: "${result.partner_b_title}"
CENTER between them: "VS" in small elegant text
BOTTOM: "${result.tagline}"
FOOTER: "jorukagulaam.com"

Style specifications:
- Flawless porcelain skin with soft luminous glow for any illustrated people
- Minimalist contemporary Korean fashion, elegant clean styling
- Bokeh-blurred Seoul cityscape background with skyscrapers and Han River
- Golden hour soft warm cinematic lighting
- Shallow depth of field
- Professional color grading with warm tones
- 4K ultra high resolution, photorealistic high-fidelity detail
- Premium kdrama cinematography aesthetic, shot on cinema camera with 85mm lens at f/1.4
- Use red (#DC2626) for accent elements and gold (#F59E0B) for titles/scores
- Scores should be very large and prominent
- Use frosted glass card effect for score containers
- Overall mood: warm, cinematic, dramatic but fun

Do NOT include any watermarks, device frames, or logos besides the app name.`;
}

/**
 * Generate a scorecard image using Gemini 2.5 Flash Image.
 * Supports two modes:
 * 1. Text-only: generates a cinematic scorecard with names/scores/titles
 * 2. Photo-enhanced: includes couple's photo as reference for Gemini to stylize
 */
export async function generateScorecard(
    session: QuizSession,
    result: AIResult,
    photoBase64?: string,
    photoMimeType?: string
): Promise<string | null> {
    try {
        const ai = getGenAI();
        const prompt = buildScorecardPrompt(session, result);

        // Build content parts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contentParts: any[] = [{ text: prompt }];

        // If photo is provided, include it as a reference image
        if (photoBase64 && photoMimeType) {
            contentParts.unshift({
                inlineData: {
                    mimeType: photoMimeType,
                    data: photoBase64,
                },
            });
            // Prepend instruction to use the reference photo
            contentParts.unshift({
                text: "Use the following reference photo of the couple. Transform them into the K-drama cinematic style while maintaining their exact poses and composition. Overlay the scorecard text on the image.",
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-05-20",
            contents: [{ role: "user", parts: contentParts }],
        });

        // Find the image part in the response
        const candidate = response.candidates?.[0];
        if (!candidate?.content?.parts) {
            console.error("No content in Gemini image response");
            return null;
        }

        const imagePart = candidate.content.parts.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (part: any) => part.inlineData?.mimeType?.startsWith("image/")
        );

        if (!imagePart?.inlineData) {
            console.error("No image data in Gemini response");
            return null;
        }

        // Upload to Supabase Storage
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
