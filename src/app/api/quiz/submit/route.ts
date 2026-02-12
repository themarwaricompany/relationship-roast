import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { calculateRawScores, normalizeScore } from "@/lib/scoring";
import type { OptionKey } from "@/types";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sessionId, partner, answers } = body;

        if (!sessionId || !partner || !answers) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

        // Calculate scores
        const scores = calculateRawScores(answers as Record<number, OptionKey>);
        const normalizedSelf = normalizeScore(scores.selfScore);
        const normalizedPartner = normalizeScore(scores.partnerScore);

        // Determine which partner
        const isPartnerA = partner === "a";

        const updateData: Record<string, unknown> = {};

        if (isPartnerA) {
            updateData.partner_a_answers = answers;
            updateData.partner_a_score = normalizedSelf;
            updateData.status = "waiting_for_b";
        } else {
            updateData.partner_b_answers = answers;
            updateData.partner_b_score = normalizedSelf;
            updateData.status = "generating";
        }

        const { error: updateErr } = await supabase
            .from("quiz_sessions")
            .update(updateData)
            .eq("id", sessionId);

        if (updateErr) {
            console.error("Update error:", updateErr);
            return NextResponse.json({ error: "Failed to save answers" }, { status: 500 });
        }

        // Check if both partners are done
        const bothComplete = !isPartnerA && session.partner_a_answers != null;

        return NextResponse.json({
            success: true,
            bothComplete,
            selfScore: normalizedSelf,
            partnerScore: normalizedPartner,
        });
    } catch (err) {
        console.error("Submit error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
