// supabase/functions/chat/index.ts
// Supabase Edge Function — AI Chat handler for useChat (Vercel AI SDK)
//
// Deploy with: supabase functions deploy chat
// Requires env vars: GOOGLE_GENERATIVE_AI_API_KEY
//
// This function receives messages from the frontend's useChat hook
// and streams back responses from Gemini via the Vercel AI SDK.

// @ts-nocheck — This file runs in Supabase Edge Functions (Deno runtime), not Vite
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { messages } = await req.json();

        const google = createGoogleGenerativeAI({
            apiKey: Deno.env.get("GOOGLE_GENERATIVE_AI_API_KEY")!,
        });

        const result = streamText({
            model: google("gemini-2.5-pro"),
            messages: convertToModelMessages(messages),
            temperature: 0.4,
            maxOutputTokens: 1024,
        });

        return result.toTextStreamResponse({
            headers: corsHeaders,
        });
    } catch (error) {
        console.error("Chat function error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate response" }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
