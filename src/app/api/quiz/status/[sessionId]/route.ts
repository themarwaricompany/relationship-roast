import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params;

        const { data: session, error } = await supabase
            .from("quiz_sessions")
            .select("*")
            .eq("id", sessionId)
            .single();

        if (error || !session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        return NextResponse.json({ session });
    } catch (err) {
        console.error("Status check error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
