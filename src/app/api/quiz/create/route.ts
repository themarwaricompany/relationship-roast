import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateShareCode } from "@/lib/scoring";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            partnerAName,
            partnerBName,
            partnerAGender,
            partnerBGender,
            relationshipStatus,
            college,
            photoUrl,
        } = body;

        // Validate
        if (!partnerAName?.trim() || !partnerBName?.trim()) {
            return NextResponse.json({ error: "Names are required" }, { status: 400 });
        }

        const shareCode = generateShareCode();

        const { data, error } = await supabase
            .from("quiz_sessions")
            .insert({
                partner_a_name: partnerAName.trim(),
                partner_b_name: partnerBName.trim(),
                partner_a_gender: partnerAGender,
                partner_b_gender: partnerBGender,
                relationship_status: relationshipStatus,
                college: college || null,
                photo_url: photoUrl || null,
                share_code: shareCode,
                status: "partner_a_playing",
            })
            .select("id")
            .single();

        if (error) {
            console.error("Create session error:", error);
            return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
        }

        return NextResponse.json({ sessionId: data.id, shareCode });
    } catch (err) {
        console.error("Create quiz error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
