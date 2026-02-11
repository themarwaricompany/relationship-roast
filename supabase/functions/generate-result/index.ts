import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { 
      partnerAName, partnerBName, 
      partnerAGender, partnerBGender,
      relationshipStatus,
      partnerAAnswers, partnerBAnswers,
      questions 
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build the answers comparison text
    let answersText = "";
    for (const q of questions) {
      const aAnswer = partnerAAnswers[q.id] || "not answered";
      const bAnswer = partnerBAnswers[q.id] || "not answered";
      answersText += `\n[${q.categoryEmoji} ${q.categoryLabel}]\nQ: "${q.questionText}"\n- ${partnerAName}: Option ${aAnswer.toUpperCase()} — "${q.options[aAnswer] || 'skipped'}"\n- ${partnerBName}: Option ${bAnswer.toUpperCase()} — "${q.options[bAnswer] || 'skipped'}"\n`;
    }

    const systemPrompt = `You are the AI brain behind "Joru Ka Gulaam" — a viral Hinglish couple's quiz. Your job is to generate HILARIOUS, shareable relationship verdicts based on how both partners answered quiz questions.

VOICE & TONE:
- Write in Hinglish (Hindi-English mix) throughout. Use Roman script Hinglish.
- Be funny, spicy, and roast-y. Think stand-up comedian meets relationship counselor.
- Use cultural references that 18-35 year old Indian couples would relate to (Bollywood, cricket, Swiggy, Instagram, family drama, etc.)
- Each verdict should be so funny and relatable that someone would screenshot it and send to their friends.
- Avoid anything genuinely hurtful, sexist, or relationship-damaging. Punch should come from relatability, not cruelty.
- Don't be preachy or give actual relationship advice. This is entertainment.

SCORING GUIDE:
- Option A answers = "I dominate" → partner gets gulaam points
- Option B answers = "They dominate" → answerer gets gulaam points  
- Option C answers = "We're equal" → minimal points (roast them for being diplomatic)
- Option D answers = "Funny wildcard" → contextual points
- Cross-reference: If BOTH say "I'm the boss" → roast both for delusion
- If they agree one is gulaam → extra spicy verdict for that person

Score 0-100 where higher = more gulaam. Be generous with scores (most people should be 30-80 range).`;

    const userPrompt = `Here are the quiz results for ${partnerAName} (${partnerAGender}) and ${partnerBName} (${partnerBGender}).
They are ${relationshipStatus}.

THEIR ANSWERS:
${answersText}

Generate the results now. Make it HILARIOUS and shareable.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_results",
              description: "Generate the quiz results with scores, titles, and verdicts",
              parameters: {
                type: "object",
                properties: {
                  partner_a_score: { type: "number", description: "Gulaam score 0-100 for partner A" },
                  partner_b_score: { type: "number", description: "Gulaam score 0-100 for partner B" },
                  partner_a_title: { type: "string", description: "Funny gulaam title for partner A based on score and gender" },
                  partner_b_title: { type: "string", description: "Funny gulaam title for partner B based on score and gender" },
                  tagline: { type: "string", description: "One viral-worthy Hinglish one-liner for the scorecard" },
                  category_verdicts: {
                    type: "object",
                    properties: {
                      kitchen: { type: "string", description: "2-3 sentence funny verdict about kitchen dynamics" },
                      remote: { type: "string", description: "2-3 sentence funny verdict about entertainment/remote dynamics" },
                      paisa: { type: "string", description: "2-3 sentence funny verdict about money dynamics" },
                      argument: { type: "string", description: "2-3 sentence funny verdict about argument dynamics" },
                      jealousy: { type: "string", description: "2-3 sentence funny verdict about social/jealousy dynamics" },
                    },
                    required: ["kitchen", "remote", "paisa", "argument", "jealousy"],
                    additionalProperties: false,
                  },
                  overall_verdict: { type: "string", description: "3-4 sentence overall roast summarizing the relationship dynamic" },
                },
                required: ["partner_a_score", "partner_b_score", "partner_a_title", "partner_b_title", "tagline", "category_verdicts", "overall_verdict"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_results" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again in a moment" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-result error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
