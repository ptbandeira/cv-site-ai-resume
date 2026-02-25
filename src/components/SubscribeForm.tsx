import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const { error } = await supabase
        .from("subscribers")
        .insert([{ email: email.toLowerCase().trim(), source: "pulse" }]);

      if (error) {
        // Postgres unique violation code
        if (error.code === "23505") {
          setStatus("duplicate");
        } else {
          throw error;
        }
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch (err: any) {
      console.error("Subscribe error:", err);
      setErrorMsg(err?.message ?? "Something went wrong. Try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-stone-200 rounded-sm p-6 text-center">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mb-3" />
        <p className="font-serif text-base text-foreground mb-1">You're in.</p>
        <p className="text-xs font-mono text-muted-foreground">
          Weekly digest, every Friday — signal only, no noise.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-stone-200 bg-stone-50/40 rounded-sm p-6">
      <div className="mb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2">
          Weekly Signal Digest
        </span>
        <p className="font-serif text-base text-foreground leading-snug">
          Get the week's AI signal in your inbox — every Friday.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Analysis for operators, not enthusiasts. No vendor hype.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="flex-1 px-4 py-2.5 text-sm font-mono bg-white border border-stone-200 rounded-sm focus:outline-none focus:border-stone-400 placeholder:text-stone-400 disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading" || !email}
          className="px-5 py-2.5 text-xs font-mono uppercase tracking-widest bg-foreground text-background rounded-sm hover:bg-stone-700 disabled:opacity-40 transition-colors whitespace-nowrap"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>

      {status === "duplicate" && (
        <p className="mt-3 text-xs font-mono text-amber-600">
          Already subscribed — you'll get the next digest Friday.
        </p>
      )}
      {status === "error" && (
        <p className="mt-3 text-xs font-mono text-red-500">
          {errorMsg || "Error. Try again in a moment."}
        </p>
      )}
    </div>
  );
}
