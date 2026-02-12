import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateResults } from "@/lib/ai/generateResults";
import { generateScorecard } from "@/lib/ai/generateScorecard";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sessionId } = body;

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        }

        // Fetch session
        const { data: session, error: fetchErr } = await supabase
            .from("quiz_sessions")
            .select("*")
            .eq("id", sessionId)
            .single();

        if (fetchErr || !session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // Don't regenerate if already complete
        if (session.status === "complete" && session.ai_result) {
            return NextResponse.json({ success: true, result: session.ai_result });
        }

        // Check both partners have answered
        if (!session.partner_a_answers || !session.partner_b_answers) {
            return NextResponse.json({ error: "Both partners must complete the quiz first" }, { status: 400 });
        }

        // Generate AI verdict
        const aiResult = await generateResults(session);

        // Attempt scorecard image generation (non-blocking)
        let scorecardUrl = null;
        try {
            scorecardUrl = await generateScorecard(session, aiResult);
        } catch (imgErr) {
            console.error("Scorecard generation failed (continuing):", imgErr);
        }

        // Save result
        const { error: updateErr } = await supabase
            .from("quiz_sessions")
            .update({
                ai_result: aiResult,
                scorecard_image_url: scorecardUrl,
                status: "complete",
                completed_at: new Date().toISOString(),
            })
            .eq("id", sessionId);

        if (updateErr) {
            console.error("Update error:", updateErr);
            return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
        }

        return NextResponse.json({ success: true, result: aiResult });
    } catch (err) {
        console.error("Generate result error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
