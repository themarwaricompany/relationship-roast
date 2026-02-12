import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
        }

        const ext = file.name.split(".").pop() || "jpg";
        const fileName = `photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { error } = await supabase.storage
            .from("quiz-assets")
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error("Upload error:", error);
            return NextResponse.json({ error: "Upload failed" }, { status: 500 });
        }

        const { data: urlData } = supabase.storage
            .from("quiz-assets")
            .getPublicUrl(fileName);

        return NextResponse.json({ url: urlData.publicUrl });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
