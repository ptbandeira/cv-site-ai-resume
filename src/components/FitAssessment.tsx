import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { BRIDGE_ARCHITECT_PERSONA } from "@/lib/persona";
import { Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const FitAssessment = () => {
  const [jd, setJd] = useState("");
  const [showResults, setShowResults] = useState(false);

  // We use useChat to leverage the existing infrastructure, even though this is a single turn.
  // We will force the AI to return JSON.
  const { messages, append, isLoading } = useChat({
    api: import.meta.env.VITE_CHAT_API_URL || '/functions/v1/chat',
    initialMessages: [
      {
        id: 'system-fit',
        role: 'system',
        content: `${BRIDGE_ARCHITECT_PERSONA}
        
        SPECIAL INSTRUCTION:
        The user will provide a Job Description. You MUST analyze it against Pedro's context.
        You MUST return ONLY a strict JSON object (no markdown formatting, no other text) with this structure:
        {
          "strengths": ["string", "string"],
          "gaps": ["string", "string"]
        }
        Be honest. Finding gaps is the "Honest Fit" protocol.
        `
      }
    ],
  });

  const handleAnalyze = async () => {
    if (!jd.trim()) return;
    setShowResults(true);
    await append({
      role: 'user',
      content: `Analyze this Job Description:\n\n${jd}`
    });
  };

  // Extract the last message from assistant
  const lastMessage = messages[messages.length - 1];
  const isAssistant = lastMessage?.role === 'assistant';

  let analysis = { strengths: [], gaps: [] };
  if (isAssistant && !isLoading) {
    try {
      // Clean up potential markdown code blocks
      const cleanContent = lastMessage.content.replace(/```json/g, '').replace(/```/g, '').trim();
      analysis = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse JSON", e);
      // Fallback or error state
    }
  }

  return (
    <div id="fit-assessment" className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      {!showResults ? (
        <Card className="p-8 border-accent/20 bg-card/50 backdrop-blur">
          <h2 className="text-3xl font-serif text-foreground mb-4">Fit Assessment Protocol</h2>
          <p className="text-muted-foreground mb-6">
            Paste your Job Description below. I will run a semantic analysis against Pedro's neural context ("The Cortex") to identify
            <span className="text-success font-medium"> aligned strengths</span> and
            <span className="text-destructive font-medium"> honest gaps</span>.
          </p>

          <Textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste Job Description here..."
            className="min-h-[200px] mb-6 bg-secondary/50 border-border/50 focus:border-accent"
          />

          <Button
            onClick={handleAnalyze}
            disabled={!jd.trim()}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg"
          >
            Run Fit Analysis <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-serif">Analysis Results</h3>
            <Button variant="ghost" onClick={() => setShowResults(false)}>New Analysis</Button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <p className="text-muted-foreground animate-pulse">Scanning AgenticOS Context...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="p-6 border-success/20 bg-success/5">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <h4 className="text-xl font-medium text-success">Core Strengths</h4>
                </div>
                <ul className="space-y-3">
                  {analysis.strengths?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-foreground/90">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-success/60" />
                      {item}
                    </li>
                  )) || <p className="text-muted-foreground italic">Parsing response...</p>}
                </ul>
              </Card>

              {/* Gaps */}
              <Card className="p-6 border-destructive/20 bg-destructive/5">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-destructive" />
                  <h4 className="text-xl font-medium text-destructive">Potential Gaps</h4>
                </div>
                <ul className="space-y-3">
                  {analysis.gaps?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-foreground/90">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive/60" />
                      {item}
                    </li>
                  )) || <p className="text-muted-foreground italic">Parsing response...</p>}
                </ul>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FitAssessment;
