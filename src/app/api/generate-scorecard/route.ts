import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateScorecard } from "@/lib/ai/generateScorecard";
import type { QuizSession, AIResult } from "@/types";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sessionId, photoBase64, photoMimeType } = body;

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

        const quizSession = session as QuizSession;

        if (!quizSession.ai_result) {
            return NextResponse.json({ error: "Results not generated yet" }, { status: 400 });
        }

        const result = quizSession.ai_result as AIResult;

        // Generate scorecard image
        const scorecardUrl = await generateScorecard(
            quizSession,
            result,
            photoBase64 || undefined,
            photoMimeType || undefined
        );

        if (!scorecardUrl) {
            return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
        }

        // Update session with scorecard URL
        await supabase
            .from("quiz_sessions")
            .update({ scorecard_image_url: scorecardUrl })
            .eq("id", sessionId);

        return NextResponse.json({ scorecardUrl });
    } catch (err) {
        console.error("Generate scorecard error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
