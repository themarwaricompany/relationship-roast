import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "college";

    try {
        let query = supabase
            .from("quiz_sessions")
            .select("id, partner_a_name, partner_b_name, college, city, ai_result, leaderboard_opt_in")
            .eq("status", "complete")
            .eq("leaderboard_opt_in", true)
            .order("completed_at", { ascending: false })
            .limit(50);

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
        }

        // Transform and sort by combined score
        const entries = (data || [])
            .map((session) => {
                const result = session.ai_result as Record<string, number> | null;
                const scoreA = result?.partner_a_score || 0;
                const scoreB = result?.partner_b_score || 0;
                return {
                    id: session.id,
                    partner_a_name: session.partner_a_name,
                    partner_b_name: session.partner_b_name,
                    college: session.college,
                    city: session.city,
                    combined_score: scoreA + scoreB,
                };
            })
            .sort((a, b) => b.combined_score - a.combined_score);

        return NextResponse.json({ entries });
    } catch (err) {
        console.error("Leaderboard error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sessionId, optIn } = body;

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        }

        const { error } = await supabase
            .from("quiz_sessions")
            .update({ leaderboard_opt_in: optIn })
            .eq("id", sessionId);

        if (error) {
            return NextResponse.json({ error: "Failed to update opt-in" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Leaderboard opt-in error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
