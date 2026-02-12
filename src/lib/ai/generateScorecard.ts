import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";
import type { QuizSession, AIResult } from "@/types";

function getGenAI() {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
}

/**
 * Build the K-drama styled scorecard prompt with quiz results overlay
 */
function buildScorecardPrompt(session: QuizSession, result: AIResult, hasPhoto: boolean): string {
    const baseStyle = hasPhoto 
        ? "Elegant hand-drawn illustration portrait in love, black ink line art with rose gold and pink metallic accents"
        : "Cinematic K-drama style romantic portrait illustration, premium Korean drama aesthetic";

    const featurePreservation = hasPhoto
        ? "PRESERVE EXACT HAIRSTYLES, EYEGLASSES, AND ALL FACIAL FEATURES FROM ORIGINAL PHOTO, maintain all personal characteristics accurately including hair texture, spectacle frames, facial structure"
        : "Create beautiful romantic K-drama style couple portrait with elegant features, soft romantic expressions";

    return `${baseStyle}, sophisticated premium quality illustration for a couple's quiz result scorecard.

${featurePreservation}

VISUAL LAYOUT AND TEXT OVERLAYS (CRITICAL - ALL TEXT MUST BE CLEARLY VISIBLE):

╔═══════════════════════════════════════════════════╗
║          🏆 JORU KA GULAAM 🏆                    ║
║     (top banner, bold elegant red & gold text)   ║
╠═══════════════════════════════════════════════════╣
║  ┌─────────────────────────────────────────┐    ║
║  │                                          │    ║
║  │   ${session.partner_a_name}                        ❤️                       ${session.partner_b_name}   │    ║
║  │   (left side)                                         (right side)        │    ║
║  │                                          │    ║
║  │        [COUPLE ILLUSTRATION]             │    ║
║  │     ${hasPhoto ? '(preserving exact features)' : '(romantic K-drama style)'}           │    ║
║  │                                          │    ║
║  │   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │    ║
║  │                                          │    ║
║  │   🎖️ "${result.partner_a_title}"                                             │    ║
║  │   (AWARD TITLE - VERY LARGE & PROMINENT)│    ║
║  │   elegant decorative scroll/certificate  │    ║
║  │                                          │    ║
║  │   🎖️ "${result.partner_b_title}"                                             │    ║
║  │   (AWARD TITLE - VERY LARGE & PROMINENT)│    ║
║  │   elegant decorative scroll/certificate  │    ║
║  │                                          │    ║
║  └─────────────────────────────────────────┘    ║
║                                                   ║
║  💬 "${result.tagline}"                          ║
║     (center, witty tagline in stylish font)      ║
║                                                   ║
║  ════════════════════════════════════════        ║
║     ✨ Apna Score Nikalo! ✨                     ║
║        JoruKaGulaam.com                          ║
║  ════════════════════════════════════════        ║
╚═══════════════════════════════════════════════════╝

CRITICAL TEXT HIERARCHY (IMPORTANCE ORDER):
1. AWARD TITLES - "${result.partner_a_title}" & "${result.partner_b_title}" - MOST IMPORTANT, largest decorative text with scroll/certificate aesthetic, THESE ARE THE STAR OF THE IMAGE
2. NAMES - "${session.partner_a_name}" & "${session.partner_b_name}" - Clear readable elegant font with heart between them
3. APP TITLE - "JORU KA GULAAM" - Bold banner at top with trophy emoji, red (#DC2626) and gold accents
4. TAGLINE - "${result.tagline}" - Prominent witty quote in stylish font
5. CTA - "Apna Score Nikalo!" with "JoruKaGulaam.com" - Engaging call-to-action to drive viewers to the site

NO SCORES DISPLAYED - Focus entirely on the fun, quirky, shareable couple award titles!

LAYOUT STRUCTURE:
- Top section: "JORU KA GULAAM" in decorative banner with trophy emoji, red and gold styling
- Upper area: Names positioned left and right with ❤️ heart in center
- Center: Couple illustration ${hasPhoto ? 'maintaining exact hairstyles, glasses, facial features' : 'in romantic K-drama cinematography style'}
- Award section: TITLES displayed like ceremonial scrolls/certificates with elegant flourishes and decorative frames - THIS IS THE MAIN HIGHLIGHT
- Lower section: Tagline in witty stylish placement
- Footer: Call-to-action "Apna Score Nikalo!" with "JoruKaGulaam.com" in elegant decorative frame to encourage viewers to visit

STYLE SPECIFICATIONS:
- Art style: ${hasPhoto ? 'hand-drawn romantic illustration with metallic ink accents, clean black ink lines' : 'premium K-drama cinematography, cinematic portrait photography aesthetic'}
- Color palette: red (#DC2626), gold (#F59E0B), rose gold metallic, blush pink, warm cream background
- Typography: elegant calligraphy for titles, romantic script for awards, decorative fonts throughout
- Background: ${hasPhoto ? 'soft romantic gradient blush pink to cream with floating hearts and rose petals' : 'bokeh-blurred Seoul cityscape with Han River, golden hour lighting'}
- Lighting: warm romantic glow, soft backlight bokeh effect, golden hour cinematography
- Frame style: vintage ornate border in rose gold with Art Nouveau flourishes
- Award presentation: Decorative scrolls or certificate ribbons around the titles making them look prestigious and shareable
- Romantic elements: floating hearts, rose petals, soft bokeh lights, romantic aura

${hasPhoto ? `
CRITICAL FEATURE PRESERVATION:
- Hairstyle: MUST preserve exact hair length, parting, texture (straight/wavy/curly), volume, styling from photo
- Eyewear: MUST preserve precise spectacle frames (shape, color, thickness, size) if present
- Facial features: maintain exact face shape, expressions, distinctive characteristics
- Transform into elegant illustration style while keeping all personal features identical
` : `
K-DRAMA AESTHETIC:
- Flawless porcelain skin with soft luminous glow
- Minimalist contemporary Korean fashion, elegant clean styling
- Shallow depth of field, professional color grading
- 4K ultra high resolution, premium cinematography
- Shot on cinema camera with 85mm lens at f/1.4 aesthetic
`}

TECHNICAL REQUIREMENTS:
- Aspect ratio: 3:4 portrait orientation
- All text must be crystal clear and legible
- Award titles MUST be the visual focal point with maximum decorative emphasis - people should be proud to share this
- High resolution, print-ready quality
- Social media optimized for Instagram/Facebook/WhatsApp sharing
- Premium quality output, sophisticated and shareable
- Design should make couples feel special and excited to share their unique award

NEGATIVE PROMPT: ${hasPhoto ? 'changed hairstyle, different glasses, altered facial features, ' : ''}messy text, illegible fonts, cluttered design, low quality, amateur rendering, hidden titles, generic appearance, overly cartoonish, scores, numbers, numerical ratings

Do NOT include any watermarks, device frames, scores, numerical ratings, or additional logos besides the specified branding. FOCUS ON MAKING THE AWARD TITLES THE STAR!`;
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
        const hasPhoto = !!(photoBase64 && photoMimeType);
        const prompt = buildScorecardPrompt(session, result, hasPhoto);

        // Build request for REST API
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parts: any[] = [];

        // If photo is provided, include it as a reference image
        if (hasPhoto) {
            parts.push({
                inline_data: {
                    mime_type: photoMimeType,
                    data: photoBase64,
                },
            });
            parts.push({
                text: "REFERENCE PHOTO PROVIDED: Use this photo of the couple as reference. PRESERVE their exact hairstyles, eyeglasses (if present), and all facial features accurately. Transform them into the elegant illustration style while maintaining all personal characteristics identical to the original photo.",
            });
        }

        parts.push({ text: prompt });

        const requestBody = {
            contents: [{
                parts: parts
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-goog-api-key': process.env.GEMINI_API_KEY || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API error:", errorData);
            return null;
        }

        const data = await response.json();

        // Find the image part in the response
        const candidate = data.candidates?.[0];
        if (!candidate?.content?.parts) {
            console.error("No content in Gemini image response");
            return null;
        }

        const imagePart = candidate.content.parts.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (part: any) => part.inlineData?.mimeType?.startsWith("image/")
        );

        if (!imagePart?.inlineData?.data) {
            console.error("No image data in Gemini response");
            return null;
        }

        // Upload to Supabase Storage
        const imageBuffer = Buffer.from(imagePart.inlineData.data, "base64");
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
