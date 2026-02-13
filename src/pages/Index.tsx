import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MiniAppSandbox from "@/components/MiniAppSandbox";
import Experience from "@/components/Experience";
import FitAssessment from "@/components/FitAssessment";
import SaasVsBuild from "@/components/SaasVsBuild";
import AutomationAuditor from "@/components/AutomationAuditor";
import AnalogAdvantage from "@/components/AnalogAdvantage";
import InsightPulse from "@/components/InsightPulse";
import TeamsAgentDemo from "@/components/TeamsAgentDemo";
import DataTransformation from "@/components/DataTransformation";
import SavingsCalculator from "@/components/SavingsCalculator";
import StrategicFAQ from "@/components/StrategicFAQ";
import AIChat from "@/components/AIChat";
import FloatingAICTA from "@/components/FloatingAICTA";
import Footer from "@/components/Footer";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header onOpenChat={openChat} />
      <main>
        <Hero onOpenChat={openChat} />
        <AnalogAdvantage onOpenChat={openChat} />
        <TeamsAgentDemo />
        <DataTransformation />
        <div id="resource-audit">
          <SavingsCalculator />
          <SaasVsBuild />
        </div>
        <div id="automation-auditor">
          <AutomationAuditor />
        </div>
        <div id="sandbox">
          <MiniAppSandbox />
        </div>
        <Experience />
        <InsightPulse />
        <StrategicFAQ />
        <FitAssessment />
      </main>
      <Footer onOpenChat={openChat} />
      <FloatingAICTA onOpenChat={openChat} />
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
