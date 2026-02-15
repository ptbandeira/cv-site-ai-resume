import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { BRIDGE_ARCHITECT_PERSONA } from "@/lib/persona";
import { Loader2, CheckCircle, XCircle, ArrowRight, Briefcase, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const FitAssessment = () => {
  const [activeTab, setActiveTab] = useState("workflow");
  const [showResults, setShowResults] = useState(false);

  // Workflow State
  const [industry, setIndustry] = useState("");
  const [workflowDesc, setWorkflowDesc] = useState("");
  const [constraints, setConstraints] = useState<string[]>([]);

  // Hiring State
  const [jd, setJd] = useState("");

  const toggleConstraint = (value: string) => {
    setConstraints(prev =>
      prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value]
    );
  };

  const { messages, append, isLoading } = useChat({
    api: import.meta.env.VITE_CHAT_API_URL || '/functions/v1/chat',
    initialMessages: [
      {
        id: 'system-fit',
        role: 'system',
        content: `${BRIDGE_ARCHITECT_PERSONA}
        
        SPECIAL INSTRUCTION:
        You are analyzing a user's context against Pedro's expertise (The Cortex).
        
        If the input is a WORKFLOW:
        - Identify "Strengths" (Where Pedro's Agentic/Automation experience adds value).
        - Identify "Gaps" (Risks, Missing Info, or Compliance concerns).
        
        If the input is a JOB DESCRIPTION:
        - Identify "Strengths" (Aligned skills).
        - Identify "Gaps" (Missing requirements or misalignments).

        You MUST return ONLY a strict JSON object (no markdown formatting, no other text) with this structure:
        {
          "strengths": ["string", "string", "string"],
          "gaps": ["string", "string", "string"],
          "recommendation": "string" (A 1-sentence strategic recommendation)
        }
        Be honest. Finding gaps is the "Honest Fit" protocol.
        `
      }
    ],
  });

  const handleAnalyze = async () => {
    const isWorkflow = activeTab === "workflow";
    const content = isWorkflow
      ? `Analyze this Workflow Opportunity:\nIndustry: ${industry}\nDescription: ${workflowDesc}\nConstraints: ${constraints.join(", ")}`
      : `Analyze this Job Description:\n\n${jd}`;

    if (!content.trim()) return;

    setShowResults(true);
    await append({
      role: 'user',
      content
    });
  };

  // Extract the last message from assistant
  const lastMessage = messages[messages.length - 1];
  const isAssistant = lastMessage?.role === 'assistant';

  let analysis = { strengths: [], gaps: [], recommendation: "" };
  if (isAssistant && !isLoading) {
    try {
      const cleanContent = lastMessage.content.replace(/```json/g, '').replace(/```/g, '').trim();
      analysis = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse JSON", e);
    }
  }

  const isValid = activeTab === "workflow"
    ? (industry && workflowDesc.trim().length > 10)
    : (jd.trim().length > 10);

  return (
    <div id="fit-assessment" className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fade-in text-left">
      {!showResults ? (
        <Card className="p-8 border-stone-200 bg-white shadow-xl shadow-stone-200/50">
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-foreground mb-4">Fit Assessment Protocol</h2>
            <p className="text-muted-foreground">
              I run a semantic analysis against my neural context ("The Cortex") to identify
              <span className="text-success font-medium"> aligned strengths</span> and
              <span className="text-destructive font-medium"> honest gaps</span>.
            </p>
          </div>

          <Tabs defaultValue="workflow" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-auto p-1 bg-stone-100 rounded-lg">
              <TabsTrigger value="workflow" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
                <FileText className="w-4 h-4 mr-2" /> Fix a Workflow
              </TabsTrigger>
              <TabsTrigger value="hiring" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
                <Briefcase className="w-4 h-4 mr-2" /> Hiring / Role Fit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workflow" className="space-y-6">
              <div className="space-y-2">
                <Label>Industry context</Label>
                <Select onValueChange={setIndustry}>
                  <SelectTrigger className="w-full h-12 text-lg">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthcare">Healthcare / Pharma</SelectItem>
                    <SelectItem value="Finance">Finance / Insurance</SelectItem>
                    <SelectItem value="Legal">Legal / Professional Services</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing / Logistics</SelectItem>
                    <SelectItem value="Retail">Retail / E-commerce</SelectItem>
                    <SelectItem value="Tech">SaaS / Technology</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Describe the process or bottleneck</Label>
                <Textarea
                  value={workflowDesc}
                  onChange={(e) => setWorkflowDesc(e.target.value)}
                  placeholder="e.g. We spend 10 hours a week copying data from PDFs to Excel..."
                  className="min-h-[150px] resize-none text-base p-4"
                />
              </div>

              <div className="space-y-3">
                <Label>Constraints & Dealbreakers</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {["Strict PII / GDPR Requirements", "Highly Regulated Industry", "Must stay On-Premises / Private Cloud", "No new SaaS Budget"].map((c) => (
                    <div key={c} className="flex items-center space-x-2 border border-stone-200 p-3 rounded-md hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => toggleConstraint(c)}>
                      <Checkbox id={c} checked={constraints.includes(c)} onCheckedChange={() => toggleConstraint(c)} />
                      <label htmlFor={c} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                        {c}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hiring" className="space-y-6">
              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the Job Description here..."
                  className="min-h-[300px] resize-none text-base p-4"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t border-stone-100">
            <p className="text-xs text-muted-foreground mb-6 flex flex-col gap-1">
              <span className="font-medium text-stone-600 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-emerald-500" /> Privacy First:
              </span>
              <span>Text is processed transiently for this analysis. No data is stored.</span>
            </p>

            <Button
              onClick={handleAnalyze}
              disabled={!isValid || isLoading}
              className="w-full bg-[#1A1A1A] text-white py-6 text-lg group border-0 rounded-lg hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Run Fit Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-2xl font-serif">Analysis Results</h3>
            <Button variant="ghost" onClick={() => setShowResults(false)} className="mx-0 px-0 hover:bg-transparent hover:text-primary">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> New Analysis
            </Button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">Scanning AgenticOS Context...</p>
                <p className="text-sm text-muted-foreground">Mapping against {activeTab === "workflow" ? "automation capabilities" : "experience patterns"}...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <Card className="p-6 border-emerald-100 bg-emerald-50/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-full">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h4 className="text-lg font-medium text-emerald-900">
                      {activeTab === "workflow" ? "Value Drivers" : "Core Strengths"}
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {analysis.strengths?.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-emerald-900/80 text-sm leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {item}
                      </li>
                    )) || <p className="text-muted-foreground italic">Parsing response...</p>}
                  </ul>
                </Card>

                {/* Gaps */}
                <Card className="p-6 border-rose-100 bg-rose-50/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-rose-100 rounded-full">
                      <XCircle className="w-5 h-5 text-rose-600" />
                    </div>
                    <h4 className="text-lg font-medium text-rose-900">
                      {activeTab === "workflow" ? "Risks & Gaps" : "Potential Gaps"}
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {analysis.gaps?.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-rose-900/80 text-sm leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-rose-500" />
                        {item}
                      </li>
                    )) || <p className="text-muted-foreground italic">Parsing response...</p>}
                  </ul>
                </Card>
              </div>

              {/* Recommendation & CTA */}
              {(analysis.recommendation || true) && (
                <div className="bg-[#1A1A1A] text-white p-8 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-white/90">Strategic Recommendation</h4>
                    <p className="text-stone-400 text-sm max-w-xl">
                      {analysis.recommendation || "Based on this analysis, a rapid validation sprint would likely yield the highest ROI to prove feasibility."}
                    </p>
                  </div>
                  <Button onClick={() => window.location.href = "#offers"} className="bg-white text-stone-950 hover:bg-stone-200 font-medium px-8 py-6 rounded-lg whitespace-nowrap">
                    Book a Reality Test
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FitAssessment;
